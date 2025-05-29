
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { toast } from '@/hooks/use-toast';

export interface Task {
  id: string;
  user_id: string;
  project_id: string | null;
  client_id: string | null;
  title: string;
  description: string | null;
  status: 'new' | 'in_progress' | 'testing' | 'awaiting_feedback' | 'completed';
  priority: 'low' | 'normal' | 'high' | 'urgent' | null;
  due_date: string | null;
  assigned_to: string | null;
  tags: string[] | null;
  created_at: string | null;
  updated_at: string | null;
}

export function useTasks() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          projects(title),
          clients(name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as (Task & { 
        projects: { title: string } | null;
        clients: { name: string } | null;
      })[];
    },
    enabled: !!user
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ ...taskData, user_id: user.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "任务创建成功",
        description: "新任务已成功添加到系统中",
      });
    },
    onError: (error) => {
      console.error('Error creating task:', error);
      toast({
        title: "创建失败",
        description: "创建任务时出现错误，请重试",
        variant: "destructive",
      });
    }
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Task> & { id: string }) => {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "更新成功",
        description: "任务信息已更新",
      });
    },
    onError: (error) => {
      console.error('Error updating task:', error);
      toast({
        title: "更新失败",
        description: "更新任务信息时出现错误",
        variant: "destructive",
      });
    }
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "删除成功",
        description: "任务已从系统中删除",
      });
    },
    onError: (error) => {
      console.error('Error deleting task:', error);
      toast({
        title: "删除失败",
        description: "删除任务时出现错误",
        variant: "destructive",
      });
    }
  });
}
