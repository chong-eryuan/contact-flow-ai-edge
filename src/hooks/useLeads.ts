
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { toast } from '@/hooks/use-toast';

export interface Lead {
  id: string;
  user_id: string;
  title: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  value: number | null;
  status: 'new' | 'disqualified' | 'qualified' | 'contacted';
  source: string | null;
  tags: string[] | null;
  notes: string | null;
  target_date: string | null;
  contacted_date: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export function useLeads() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Lead[];
    },
    enabled: !!user
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('leads')
        .insert([{ ...leadData, user_id: user.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast({
        title: "线索创建成功",
        description: "新线索已成功添加到系统中",
      });
    },
    onError: (error) => {
      console.error('Error creating lead:', error);
      toast({
        title: "创建失败",
        description: "创建线索时出现错误，请重试",
        variant: "destructive",
      });
    }
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Lead> & { id: string }) => {
      const { data, error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast({
        title: "更新成功",
        description: "线索信息已更新",
      });
    },
    onError: (error) => {
      console.error('Error updating lead:', error);
      toast({
        title: "更新失败",
        description: "更新线索信息时出现错误",
        variant: "destructive",
      });
    }
  });
}

export function useDeleteLead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast({
        title: "删除成功",
        description: "线索已从系统中删除",
      });
    },
    onError: (error) => {
      console.error('Error deleting lead:', error);
      toast({
        title: "删除失败",
        description: "删除线索时出现错误",
        variant: "destructive",
      });
    }
  });
}
