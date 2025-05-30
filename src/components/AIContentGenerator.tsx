
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot, Sparkles, Copy, Send } from 'lucide-react';
import { useGenerateContent } from '@/hooks/useAIContentGenerator';
import { toast } from '@/hooks/use-toast';

const contentTypes = [
  { value: 'follow-up-email', label: 'Follow-up Email' },
  { value: 'client-proposal', label: 'Client Proposal' },
  { value: 'meeting-summary', label: 'Meeting Summary' },
  { value: 'project-update', label: 'Project Update' },
  { value: 'marketing-content', label: 'Marketing Content' },
  { value: 'custom', label: 'Custom Content' },
];

export default function AIContentGenerator() {
  const [prompt, setPrompt] = useState('');
  const [contentType, setContentType] = useState('');
  const [context, setContext] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  
  const generateMutation = useGenerateContent();

  const handleGenerate = async () => {
    if (!prompt.trim() || !contentType) {
      toast({
        title: "Missing Information",
        description: "Please provide both a prompt and select a content type.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await generateMutation.mutateAsync({
        prompt,
        contentType,
        context,
      });
      setGeneratedContent(result.content);
    } catch (error) {
      console.error('Generation error:', error);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    toast({
      title: "Copied to Clipboard",
      description: "Generated content has been copied to your clipboard.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            AI Content Generator
          </CardTitle>
          <CardDescription>
            Generate professional business content using AI assistance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="content-type">Content Type</Label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  {contentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="context">Context (Optional)</Label>
              <Input
                id="context"
                placeholder="e.g., Client name, project details..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="prompt">What would you like to generate?</Label>
            <Textarea
              id="prompt"
              placeholder="e.g., Write a follow-up email to a client about their project timeline..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
            />
          </div>
          
          <Button 
            onClick={handleGenerate}
            disabled={generateMutation.isPending}
            className="w-full"
          >
            {generateMutation.isPending ? (
              <>
                <Bot className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Generate Content
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedContent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-green-500" />
                Generated Content
              </span>
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                {generatedContent}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
