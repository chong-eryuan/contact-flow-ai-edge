
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Bot, Copy, Clock, Sparkles } from 'lucide-react';
import { useAIConversations } from '@/hooks/useAIContentGenerator';
import { toast } from '@/hooks/use-toast';
import AIContentGenerator from '@/components/AIContentGenerator';

export default function AssistantHistory() {
  const { data: conversations = [], isLoading } = useAIConversations();

  const handleCopy = (text: string, type: 'prompt' | 'response') => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${type === 'prompt' ? 'Prompt' : 'Response'} content has been copied`,
    });
  };

  const getContentTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'follow-up-email': 'Follow-up Email',
      'client-proposal': 'Client Proposal',
      'meeting-summary': 'Meeting Summary',
      'project-update': 'Project Update',
      'marketing-content': 'Marketing Content',
      'custom': 'Custom Content'
    };
    return types[type] || type;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Assistant</h1>
          <p className="text-gray-600">Generate professional content and view your conversation history</p>
        </div>
      </div>

      {/* AI Content Generator */}
      <AIContentGenerator />

      {/* Conversation History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Conversation History
          </CardTitle>
          <CardDescription>
            All your AI-generated content displayed in reverse chronological order
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <Bot className="w-12 h-12 mx-auto mb-4 text-gray-300 animate-pulse" />
              <p className="text-gray-500">Loading conversations...</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No AI conversations found</p>
              <p className="text-sm mt-2">Start generating content above to see your history here</p>
            </div>
          ) : (
            <div className="space-y-6">
              {conversations.map((conversation) => (
                <div key={conversation.id} className="border rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {new Date(conversation.created_at).toLocaleString()}
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {getContentTypeLabel(conversation.content_type)}
                      </span>
                    </div>
                  </div>

                  {conversation.context && (
                    <div className="bg-yellow-50 rounded-lg p-3">
                      <h5 className="font-medium text-yellow-900 text-sm mb-1">Context</h5>
                      <p className="text-yellow-800 text-sm">{conversation.context}</p>
                    </div>
                  )}

                  {/* User Prompt */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-blue-900">Your Request</h4>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleCopy(conversation.prompt, 'prompt')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-blue-800 whitespace-pre-wrap">{conversation.prompt}</p>
                  </div>

                  {/* AI Response */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 flex items-center gap-2">
                        <Bot className="w-4 h-4" />
                        AI Generated Content
                      </h4>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleCopy(conversation.response, 'response')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="text-gray-700 whitespace-pre-wrap font-sans text-sm">
                      {conversation.response}
                    </div>
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
