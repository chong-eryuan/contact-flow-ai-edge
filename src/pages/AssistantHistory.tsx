
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Bot, Copy, Clock } from 'lucide-react';
import { mockAiRequests } from '@/lib/mockData';
import { toast } from '@/hooks/use-toast';

export default function AssistantHistory() {
  const handleCopy = (text: string, type: 'prompt' | 'response') => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${type === 'prompt' ? 'Prompt' : 'Response'} content has been copied`,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Assistant History</h1>
          <p className="text-gray-600">View all your conversations with the AI assistant</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            Conversation History
          </CardTitle>
          <CardDescription>
            All AI conversations displayed in reverse chronological order
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mockAiRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bot className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No AI conversation history found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {mockAiRequests
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .map((request) => (
                  <div key={request.id} className="border rounded-lg p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {new Date(request.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* User Prompt */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-blue-900">Your Prompt</h4>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleCopy(request.prompt, 'prompt')}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-blue-800 whitespace-pre-wrap">{request.prompt}</p>
                    </div>

                    {/* AI Response */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 flex items-center gap-2">
                          <Bot className="w-4 h-4" />
                          AI Response
                        </h4>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleCopy(request.response, 'response')}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{request.response}</p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
