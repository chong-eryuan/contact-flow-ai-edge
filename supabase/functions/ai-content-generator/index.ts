
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('AI content generator function called');
    
    // Get request body
    const { prompt, contentType, context } = await req.json();
    console.log('Request params:', { prompt, contentType, context });
    
    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header');
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const token = authHeader.replace('Bearer ', '');
    console.log('Auth token received');
    
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      console.error('User authentication failed:', userError);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    console.log('User authenticated:', user.id);

    if (!openAIApiKey) {
      console.error('OpenAI API key not configured');
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create system prompt based on content type
    let systemPrompt = '';
    switch (contentType) {
      case 'follow-up-email':
        systemPrompt = 'You are a professional business assistant. Generate a polite, professional follow-up email that maintains good customer relationships. Keep it concise and actionable.';
        break;
      case 'client-proposal':
        systemPrompt = 'You are a business proposal writer. Create compelling, professional proposals that highlight value propositions and address client needs effectively.';
        break;
      case 'meeting-summary':
        systemPrompt = 'You are a meeting assistant. Create clear, organized meeting summaries with action items, decisions made, and next steps.';
        break;
      case 'project-update':
        systemPrompt = 'You are a project manager. Generate clear, informative project updates that communicate progress, challenges, and next steps to stakeholders.';
        break;
      case 'marketing-content':
        systemPrompt = 'You are a marketing content creator. Generate engaging, persuasive marketing content that resonates with the target audience and drives action.';
        break;
      default:
        systemPrompt = 'You are a helpful business assistant. Generate professional, relevant content based on the user\'s request.';
    }

    console.log('Calling OpenAI API');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Context: ${context || 'No additional context provided'}\n\nRequest: ${prompt}` }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.status, await response.text());
      return new Response(JSON.stringify({ error: 'OpenAI API error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;
    
    console.log('Content generated successfully');

    // Save the conversation to database
    const { data: savedConversation, error: saveError } = await supabase
      .from('ai_conversations')
      .insert({
        user_id: user.id,
        prompt,
        response: generatedContent,
        content_type: contentType,
        context: context || null,
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving conversation:', saveError);
      // Don't fail the request if saving fails, just log it
    } else {
      console.log('Conversation saved successfully');
    }

    return new Response(JSON.stringify({ 
      content: generatedContent,
      conversationId: savedConversation?.id 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-content-generator function:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
