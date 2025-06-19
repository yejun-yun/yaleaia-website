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

    try {
        let reply;
        if (model === 'openai' || !model) { // Default to OpenAI if no model specified
            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: message }],
            });
            reply = completion.choices[0].message.content;
        } else if (model === 'anthropic') {
            const completion = await anthropic.messages.create({
                model: "claude-2", // Or your preferred Claude model
                max_tokens: 1024,
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