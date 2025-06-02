
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { toast } from '@/hooks/use-toast';

export interface FollowUp {
  id: string;
  client_id: string | null;
  user_id: string;
  type: 'reminder' | 'escalation' | 'auto_followup';
  title: string;
  description: string | null;
  scheduled_for: string;
  completed_at: string | null;
  ai_suggested: boolean;
  conditions: any;
  created_at: string | null;
  clients?: { name: string } | null;
}

export function useFollowUps() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['follow_ups'],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('follow_ups')
        .select(`
          *,
          clients(name)
        `)
        .order('scheduled_for', { ascending: true });
      
      if (error) throw error;
      return data as FollowUp[];
    },
    enabled: !!user
  });
}

export function useCreateFollowUp() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (followUpData: Omit<FollowUp, 'id' | 'created_at' | 'user_id'>) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('follow_ups')
        .insert([{ ...followUpData, user_id: user.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follow_ups'] });
      toast({
        title: "Follow-up scheduled",
        description: "Follow-up reminder has been created",
      });
    },
    onError: (error) => {
      console.error('Error creating follow-up:', error);
      toast({
        title: "Failed to schedule follow-up",
        description: "An error occurred while creating the follow-up",
        variant: "destructive",
      });
    }
  });
}

export function useCompleteFollowUp() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('follow_ups')
        .update({ completed_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follow_ups'] });
      toast({
        title: "Follow-up completed",
        description: "Follow-up has been marked as completed",
      });
    },
    onError: (error) => {
      console.error('Error completing follow-up:', error);
      toast({
        title: "Update failed",
        description: "An error occurred while updating the follow-up",
        variant: "destructive",
      });
    }
  });
}
