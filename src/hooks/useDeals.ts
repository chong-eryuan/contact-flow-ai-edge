
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { toast } from '@/hooks/use-toast';

export interface Deal {
  id: string;
  client_id: string | null;
  user_id: string;
  title: string;
  description: string | null;
  value: number | null;
  stage_id: string | null;
  probability: number | null;
  expected_close_date: string | null;
  actual_close_date: string | null;
  status: 'active' | 'won' | 'lost';
  created_at: string | null;
  updated_at: string | null;
  clients?: { name: string } | null;
  pipeline_stages?: { name: string; color: string } | null;
}

export function useDeals() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['deals'],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('deals')
        .select(`
          *,
          clients(name),
          pipeline_stages(name, color)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Deal[];
    },
    enabled: !!user
  });
}

export function useCreateDeal() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (dealData: Omit<Deal, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('deals')
        .insert([{ ...dealData, user_id: user.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      toast({
        title: "Deal created successfully",
        description: "New deal has been added to the pipeline",
      });
    },
    onError: (error) => {
      console.error('Error creating deal:', error);
      toast({
        title: "Failed to create deal",
        description: "An error occurred while creating the deal",
        variant: "destructive",
      });
    }
  });
}

export function useUpdateDeal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Deal> & { id: string }) => {
      const { data, error } = await supabase
        .from('deals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      toast({
        title: "Deal updated",
        description: "Deal information has been updated",
      });
    },
    onError: (error) => {
      console.error('Error updating deal:', error);
      toast({
        title: "Update failed",
        description: "An error occurred while updating the deal",
        variant: "destructive",
      });
    }
  });
}
