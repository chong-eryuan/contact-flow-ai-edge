
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Calendar, Users, TrendingUp, MessageCircle, Brain, Clock } from 'lucide-react';
import { useMeetingPrepData } from '@/hooks/useMeetingPrep';
import { useGenerateContent } from '@/hooks/useAIContentGenerator';

interface MeetingPrepCardProps {
  meeting: {
    id: string;
    client_id: string;
    type: string;
    subject: string | null;
    scheduled_at: string;
    participants: string[] | null;
    clients: {
      name: string;
      company: string | null;
      industry: string | null;
      deal_size: number | null;
    } | null;
  };
}

export function MeetingPrepCard({ meeting }: MeetingPrepCardProps) {
  const [showPrep, setShowPrep] = useState(false);
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  
  const { data: prepData, isLoading } = useMeetingPrepData(meeting.client_id);
  const generateContent = useGenerateContent();

  const generateAIInsights = async () => {
    if (!prepData) return;
    
    const context = `
    Client: ${prepData.client?.name} (${prepData.client?.company || 'No company'})
    Industry: ${prepData.client?.industry || 'Not specified'}
    Deal Size: ${prepData.client?.deal_size ? `$${prepData.client.deal_size.toLocaleString()}` : 'Not specified'}
    
    Recent Interactions (${prepData.interactions.length}):
    ${prepData.interactions.map(int => `- ${int.type}: ${int.content}`).join('\n')}
    
    Active Deals (${prepData.deals.length}):
    ${prepData.deals.map(deal => `- ${deal.title}: $${deal.value?.toLocaleString() || 'No value'} (${deal.probability}% probability)`).join('\n')}
    
    Meeting Type: ${meeting.type}
    Meeting Subject: ${meeting.subject || 'No subject'}
    `;

    try {
      const result = await generateContent.mutateAsync({
        prompt: `Analyze this client meeting preparation data and provide actionable insights for the upcoming ${meeting.type}. Include: 1) Key talking points, 2) Potential concerns to address, 3) Opportunities to explore, 4) Recommended meeting agenda items. Keep it concise and professional.`,
        contentType: 'meeting-prep',
        context
      });
      
      setAiInsights(result.response);
    } catch (error) {
      console.error('Error generating AI insights:', error);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              {meeting.type === 'meeting' ? <Calendar className="w-5 h-5 text-blue-600" /> : <MessageCircle className="w-5 h-5 text-blue-600" />}
            </div>
            <div>
              <CardTitle className="text-lg">{meeting.subject || `${meeting.type} with ${meeting.clients?.name}`}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {formatTime(meeting.scheduled_at)}
                {meeting.clients?.company && (
                  <>
                    <span>•</span>
                    <span>{meeting.clients.company}</span>
                  </>
                )}
              </CardDescription>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowPrep(!showPrep)}
          >
            {showPrep ? 'Hide Prep' : 'Show Prep'}
          </Button>
        </div>
      </CardHeader>
      
      {showPrep && (
        <CardContent className="pt-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="ml-2">Loading preparation data...</span>
            </div>
          ) : prepData ? (
            <div className="space-y-6">
              {/* Client Overview */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Client Overview
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Industry:</span> {prepData.client?.industry || 'Not specified'}
                  </div>
                  <div>
                    <span className="font-medium">Deal Size:</span> {prepData.client?.deal_size ? `$${prepData.client.deal_size.toLocaleString()}` : 'Not specified'}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Active Deals */}
              {prepData.deals.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Active Deals ({prepData.deals.length})
                  </h4>
                  <div className="space-y-2">
                    {prepData.deals.slice(0, 3).map((deal) => (
                      <div key={deal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{deal.title}</p>
                          <p className="text-sm text-gray-600">
                            {deal.value ? `$${deal.value.toLocaleString()}` : 'No value'} • {deal.probability}% probability
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Recent Interactions */}
              {prepData.interactions.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Recent Interactions ({prepData.interactions.length})
                  </h4>
                  <div className="space-y-2">
                    {prepData.interactions.slice(0, 3).map((interaction) => (
                      <div key={interaction.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">{interaction.type}</Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(interaction.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{interaction.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* AI Insights */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    AI Meeting Insights
                  </h4>
                  <Button 
                    size="sm" 
                    onClick={generateAIInsights}
                    disabled={generateContent.isPending}
                  >
                    {generateContent.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      'Generate Insights'
                    )}
                  </Button>
                </div>
                
                {aiInsights && (
                  <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <div className="whitespace-pre-wrap text-sm">{aiInsights}</div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No preparation data available</p>
          )}
        </CardContent>
      )}
    </Card>
  );
}
