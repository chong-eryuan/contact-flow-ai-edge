
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { toast } from '@/hooks/use-toast';

export interface PipelineStage {
  id: string;
  user_id: string;
  name: string;
  order_index: number;
  color: string;
  created_at: string | null;
}

export function usePipelineStages() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['pipeline_stages'],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('pipeline_stages')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return data as PipelineStage[];
    },
    enabled: !!user
  });
}

export function useCreatePipelineStage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (stageData: Omit<PipelineStage, 'id' | 'created_at' | 'user_id'>) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('pipeline_stages')
        .insert([{ ...stageData, user_id: user.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pipeline_stages'] });
      toast({
        title: "Stage created",
        description: "New pipeline stage has been added",
      });
    },
    onError: (error) => {
      console.error('Error creating pipeline stage:', error);
      toast({
        title: "Failed to create stage",
        description: "An error occurred while creating the stage",
        variant: "destructive",
      });
    }
  });
}
