
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface AIConversation {
  id: string;
  user_id: string;
  prompt: string;
  response: string;
  content_type: string;
  context?: string;
  created_at: string;
}

export function useAIConversations() {
  return useQuery({
    queryKey: ['ai-conversations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_conversations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as AIConversation[];
    }
  });
}

export function useGenerateContent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: { 
      prompt: string; 
      contentType: string; 
      context?: string;
    }) => {
      const { data, error } = await supabase.functions.invoke('ai-content-generator', {
        body: params
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-conversations'] });
      toast({
        title: "Content Generated Successfully",
        description: "Your AI-generated content is ready!",
      });
    },
    onError: (error) => {
      console.error('Error generating content:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    }
  });
}
