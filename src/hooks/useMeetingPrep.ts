
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';

export interface MeetingPrep {
  id: string;
  client_id: string;
  meeting_title: string;
  meeting_date: string;
  participants: string[];
  client_info: any;
  recent_interactions: any[];
  active_deals: any[];
  ai_insights: string | null;
  preparation_notes: string | null;
}

export function useTodaysMeetings() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['todays-meetings'],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');
      
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();
      
      // Get today's scheduled communications (meetings/calls)
      const { data: meetings, error } = await supabase
        .from('communications')
        .select(`
          *,
          clients(*)
        `)
        .in('type', ['meeting', 'call'])
        .gte('scheduled_at', startOfDay)
        .lte('scheduled_at', endOfDay)
        .is('completed_at', null)
        .order('scheduled_at', { ascending: true });
      
      if (error) throw error;
      return meetings || [];
    },
    enabled: !!user
  });
}

export function useMeetingPrepData(clientId: string) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['meeting-prep', clientId],
    queryFn: async () => {
      if (!user || !clientId) throw new Error('Not authenticated or no client');
      
      // Get client info
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single();
      
      if (clientError) throw clientError;
      
      // Get recent interactions (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: interactions, error: interactionsError } = await supabase
        .from('interactions')
        .select('*')
        .eq('client_id', clientId)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (interactionsError) throw interactionsError;
      
      // Get active deals
      const { data: deals, error: dealsError } = await supabase
        .from('deals')
        .select('*')
        .eq('client_id', clientId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (dealsError) throw dealsError;
      
      return {
        client: client || null,
        interactions: interactions || [],
        deals: deals || []
      };
    },
    enabled: !!user && !!clientId
  });
}
