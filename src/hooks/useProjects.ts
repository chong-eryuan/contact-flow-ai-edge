
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { toast } from '@/hooks/use-toast';

export interface Project {
  id: string;
  user_id: string;
  client_id: string | null;
  title: string;
  description: string | null;
  status: 'all' | 'in_progress' | 'on_hold' | 'completed';
  progress: number | null;
  start_date: string | null;
  due_date: string | null;
  tags: string[] | null;
  category: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export function useProjects() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          clients(name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as (Project & { clients: { name: string } | null })[];
    },
    enabled: !!user
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('projects')
        .insert([{ ...projectData, user_id: user.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "项目创建成功",
        description: "新项目已成功添加到系统中",
      });
    },
    onError: (error) => {
      console.error('Error creating project:', error);
      toast({
        title: "创建失败",
        description: "创建项目时出现错误，请重试",
        variant: "destructive",
      });
    }
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Project> & { id: string }) => {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "更新成功",
        description: "项目信息已更新",
      });
    },
    onError: (error) => {
      console.error('Error updating project:', error);
      toast({
        title: "更新失败",
        description: "更新项目信息时出现错误",
        variant: "destructive",
      });
    }
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "删除成功",
        description: "项目已从系统中删除",
      });
    },
    onError: (error) => {
      console.error('Error deleting project:', error);
      toast({
        title: "删除失败",
        description: "删除项目时出现错误",
        variant: "destructive",
      });
    }
  });
}
