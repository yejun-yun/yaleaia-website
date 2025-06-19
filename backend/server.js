// BACKEND IMPLEMENTATION (Node.js + Express)
// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const admin = require('firebase-admin');

// Load environment variables (optional for Railway deployment)
const envPath = path.resolve(__dirname, '.env');
console.log('Checking for .env file at:', envPath);
console.log('.env file exists:', fs.existsSync(envPath));

if (fs.existsSync(envPath)) {
    const result = dotenv.config();
    if (result.error) {
        console.error('Error loading .env file:', result.error);
    } else {
        console.log('Environment variables loaded successfully from .env file');
    }
} else {
    console.log('No .env file found - using environment variables from Railway');
}

// Initialize Firebase Admin SDK
// You'll need to set up GOOGLE_APPLICATION_CREDENTIALS environment variable
// or initialize with a service account object.
// For simplicity in .env, we'll assume GOOGLE_APPLICATION_CREDENTIALS path for now.
// Or, you can parse the service account JSON from an env var.

// Debug environment variables
console.log('Environment variables check:');
console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
console.log('ANTHROPIC_API_KEY exists:', !!process.env.ANTHROPIC_API_KEY);
console.log('FIREBASE_SERVICE_ACCOUNT_KEY_JSON exists:', !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY_JSON);

let serviceAccount;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY_JSON) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_JSON);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin SDK initialized with service account from env variable.');
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp(); // Reads from GOOGLE_APPLICATION_CREDENTIALS path
    console.log('Firebase Admin SDK initialized using GOOGLE_APPLICATION_CREDENTIALS path.');
  } else {
    console.error('Firebase Admin SDK not initialized. Set FIREBASE_SERVICE_ACCOUNT_KEY_JSON or GOOGLE_APPLICATION_CREDENTIALS.');
  }
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error);
}

const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000', // Local development
    'https://yaleaia-website.vercel.app', // Vercel deployment
    'https://yaleaia-website-frontend.vercel.app', // Alternative Vercel URL
    'https://yaleaia.org', // Custom domain
    'https://www.yaleaia.org' // Custom domain with www
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Authentication middleware (to be refined)
async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send({ error: 'Unauthorized: No token provided or malformed token.' });
  }
  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken; // Add user info to request object
    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    return res.status(403).send({ error: 'Forbidden: Invalid token.' });
  }
}

// Routes
app.use('/api/test', (req, res) => {
    res.json({ status: 'ok', message: 'API is working', env: { openai_key_exists: !!process.env.OPENAI_API_KEY } });
});

// Health check endpoint (no auth required)
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Backend is running',
        timestamp: new Date().toISOString(),
        env: { 
            openai_key_exists: !!process.env.OPENAI_API_KEY,
            anthropic_key_exists: !!process.env.ANTHROPIC_API_KEY,
            firebase_configured: !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY_JSON
        }
    });
});

app.use('/api', authMiddleware, apiRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});