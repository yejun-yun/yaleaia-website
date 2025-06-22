const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const { Anthropic } = require('@anthropic-ai/sdk');

// Log environment variables (redacted for security)
console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
console.log('ANTHROPIC_API_KEY exists:', !!process.env.ANTHROPIC_API_KEY);

// Configure OpenAI with fallback for missing API key
const apiKey = process.env.OPENAI_API_KEY || 'dummy_key';
const openai = new OpenAI({
    apiKey: apiKey,
});

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// Model configurations
const MODEL_CONFIGS = {
    // Latest OpenAI models
    'o3': {
        provider: 'openai',
        model: 'o3',
        maxTokens: 100000
    },
    'o3-mini': {
        provider: 'openai',
        model: 'o3-mini',
        maxTokens: 65536
    },
    'gpt-4.1': {
        provider: 'openai',
        model: 'gpt-4.1',
        maxTokens: 32768
    },
    'gpt-4.1-mini': {
        provider: 'openai',
        model: 'gpt-4.1-mini',
        maxTokens: 16384
    },
    'o1': {
        provider: 'openai',
        model: 'o1',
        maxTokens: 32768
    },
    'o1-mini': {
        provider: 'openai',
        model: 'o1-mini',
        maxTokens: 16384
    },
    // Current OpenAI models
    'gpt-4o': {
        provider: 'openai',
        model: 'gpt-4o',
        maxTokens: 4096
    },
    'gpt-4o-mini': {
        provider: 'openai',
        model: 'gpt-4o-mini',
        maxTokens: 16384
    },
    'gpt-3.5-turbo': {
        provider: 'openai',
        model: 'gpt-3.5-turbo',
        maxTokens: 4096
    },
    // Latest Anthropic models
    'claude-4-sonnet': {
        provider: 'anthropic',
        model: 'claude-sonnet-4-20250514',
        maxTokens: 64000
    },
    'claude-4-opus': {
        provider: 'anthropic',
        model: 'claude-opus-4-20250514',
        maxTokens: 32000
    },
    'claude-3.7-sonnet': {
        provider: 'anthropic',
        model: 'claude-3-7-sonnet-20250219',
        maxTokens: 64000
    },
    // Current Anthropic models
    'claude-3-5-sonnet': {
        provider: 'anthropic',
        model: 'claude-3-5-sonnet-20241022',
        maxTokens: 4096
    },
    'claude-3-5-haiku': {
        provider: 'anthropic',
        model: 'claude-3-5-haiku-20241022',
        maxTokens: 4096
    },
    'claude-3-opus': {
        provider: 'anthropic',
        model: 'claude-3-opus-20240229',
        maxTokens: 4096
    }
};

// Simple test endpoint
router.get('/test', (req, res) => {
    res.json({ status: 'ok', message: 'API is working', env: { openai_key_exists: !!process.env.OPENAI_API_KEY } });
});

// Chat endpoint
router.post('/chat', async (req, res) => {
    const { message, model } = req.body;
    // The user object is now available from the authMiddleware
    // console.log('Authenticated user:', req.user);

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    // Get model configuration
    const modelConfig = MODEL_CONFIGS[model] || MODEL_CONFIGS['gpt-4o-mini']; // Default to gpt-4o-mini

    try {
        let reply;
        if (modelConfig.provider === 'openai') {
            // Handle reasoning models (o1, o3-mini) differently
            if (model.includes('o1') || model.includes('o3')) {
                const requestBody = {
                    model: modelConfig.model,
                    messages: [{ role: "user", content: message }],
                    max_completion_tokens: Math.min(modelConfig.maxTokens || 4096, 4096)
                };
                
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                });

                const data = await response.json();

                if (response.ok && data.choices && data.choices.length > 0) {
                    reply = data.choices[0].message.content;
                } else {
                    const errorMessage = data.error ? data.error.message : "Could not get a response from the model.";
                    console.error("OpenAI API error for reasoning model:", data);
                    return res.status(response.status || 500).json({ error: `Model Error: ${errorMessage}` });
                }
            } else {
                const completion = await openai.chat.completions.create({
                    model: modelConfig.model,
                    messages: [{ role: "user", content: message }],
                    max_tokens: modelConfig.maxTokens,
                });
                reply = completion.choices[0].message.content;
            }
        } else if (modelConfig.provider === 'anthropic') {
            const completion = await anthropic.messages.create({
                model: modelConfig.model,
                max_tokens: modelConfig.maxTokens,
                messages: [
                    { role: "user", content: message }
                ]
            });
            reply = completion.content[0].text;
        } else {
            return res.status(400).json({ error: 'Invalid model specified' });
        }
        res.json({ reply });
    } catch (error) {
        console.error('Error processing chat message:', error);
        res.status(500).json({ error: 'Failed to get response from AI model' });
    }
});

module.exports = router; 