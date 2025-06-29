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
    // OpenAI Models
    'gpt-4o': {
        provider: 'openai',
        model: 'gpt-4o', // Most advanced, multimodal model
        maxTokens: 4096 
    },
    'gpt-4o-mini': {
        provider: 'openai',
        model: 'gpt-4o-mini', // Fast, affordable, and smart
        maxTokens: 16384
    },
    'gpt-3.5-turbo': {
        provider: 'openai',
        model: 'gpt-3.5-turbo', // Legacy model
        maxTokens: 4096
    },

    // Anthropic Models
    'claude-3-opus': {
        provider: 'anthropic',
        model: 'claude-3-opus-20240229', // Most powerful model for complex tasks
        maxTokens: 4096
    },
    'claude-3.5-sonnet': {
        provider: 'anthropic',
        model: 'claude-3.5-sonnet-20240620', // Best balance of intelligence and speed
        maxTokens: 8192
    },
    'claude-3-haiku': {
        provider: 'anthropic',
        model: 'claude-3-haiku-20240307', // Fastest and most compact model
        maxTokens: 4096
    }
};

// Simple test endpoint
router.get('/test', (req, res) => {
    res.json({ status: 'ok', message: 'API is working', env: { openai_key_exists: !!process.env.OPENAI_API_KEY } });
});

// Chat endpoint
router.post('/chat', async (req, res) => {
    const { messages, model, temperature } = req.body;
    // The user object is now available from the authMiddleware
    // console.log('Authenticated user:', req.user);

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: '`messages` is required and must be a non-empty array' });
    }

    // Get model configuration
    const modelConfig = MODEL_CONFIGS[model] || MODEL_CONFIGS['gpt-4o-mini']; // Default to gpt-4o-mini
    const temp = temperature !== undefined && temperature !== null ? temperature : 0.7;

    try {
        let reply;
        if (modelConfig.provider === 'openai') {
            const completion = await openai.chat.completions.create({
                model: modelConfig.model,
                messages: messages,
                max_tokens: modelConfig.maxTokens,
                temperature: temp
            });
            reply = completion.choices[0].message.content;
        } else if (modelConfig.provider === 'anthropic') {
            const safeTemperature = Math.max(0, Math.min(1, temp));
            const completion = await anthropic.messages.create({
                model: modelConfig.model,
                max_tokens: modelConfig.maxTokens,
                messages: messages,
                temperature: safeTemperature
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