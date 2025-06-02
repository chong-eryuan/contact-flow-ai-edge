
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { toast } from '@/hooks/use-toast';

export interface Communication {
  id: string;
  client_id: string | null;
  user_id: string;
  type: 'email' | 'call' | 'meeting' | 'note';
  subject: string | null;
  content: string | null;
  scheduled_at: string | null;
  completed_at: string | null;
  duration_minutes: number | null;
  participants: string[] | null;
  created_at: string | null;
  updated_at: string | null;
}

export function useCommunications(clientId?: string) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['communications', clientId],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');
      
      let query = supabase
        .from('communications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (clientId) {
        query = query.eq('client_id', clientId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Communication[];
    },
    enabled: !!user
  });
}

export function useCreateCommunication() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (communicationData: Omit<Communication, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('communications')
        .insert([{ ...communicationData, user_id: user.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['communications'] });
      queryClient.invalidateQueries({ queryKey: ['communications', data.client_id] });
      toast({
        title: "Communication logged",
        description: "Communication record has been saved",
      });
    },
    onError: (error) => {
      console.error('Error creating communication:', error);
      toast({
        title: "Failed to log communication",
        description: "An error occurred while saving the record",
        variant: "destructive",
      });
    }
  });
}
