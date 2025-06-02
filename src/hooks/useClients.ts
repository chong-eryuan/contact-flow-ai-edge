import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { toast } from '@/hooks/use-toast';

export interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  notes: string | null;
  tags: string[] | null;
  last_contact: string | null;
  created_at: string | null;
  user_id: string;
  // New CRM fields
  industry: string | null;
  deal_size: number | null;
  lead_score: number;
  stage: string;
  priority: string;
}

export function useClients() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Client[];
    },
    enabled: !!user
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (clientData: Omit<Client, 'id' | 'created_at' | 'user_id'>) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('clients')
        .insert([{ ...clientData, user_id: user.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Client added successfully",
        description: "New client has been added to the system",
      });
    },
    onError: (error) => {
      console.error('Error creating client:', error);
      toast({
        title: "Failed to add client",
        description: "An error occurred while adding the client, please try again",
        variant: "destructive",
      });
    }
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Client> & { id: string }) => {
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Update successful",
        description: "Client information has been updated",
      });
    },
    onError: (error) => {
      console.error('Error updating client:', error);
      toast({
        title: "Update failed",
        description: "An error occurred while updating client information",
        variant: "destructive",
      });
    }
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Delete successful",
        description: "Client has been removed from the system",
      });
    },
    onError: (error) => {
      console.error('Error deleting client:', error);
      toast({
        title: "Delete failed",
        description: "An error occurred while deleting the client",
        variant: "destructive",
      });
    }
  });
}
