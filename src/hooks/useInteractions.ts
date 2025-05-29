
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Interaction {
  id: string;
  client_id: string;
  type: string;
  content: string;
  created_at: string | null;
}

export function useInteractions(clientId: string) {
  return useQuery({
    queryKey: ['interactions', clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('interactions')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Interaction[];
    },
    enabled: !!clientId
  });
}

export function useCreateInteraction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (interactionData: Omit<Interaction, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('interactions')
        .insert([interactionData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['interactions', data.client_id] });
      // Also update the client's last_contact timestamp
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "联系记录添加成功",
        description: "新的联系记录已保存",
      });
    },
    onError: (error) => {
      console.error('Error creating interaction:', error);
      toast({
        title: "添加失败",
        description: "添加联系记录时出现错误",
        variant: "destructive",
      });
    }
  });
}
