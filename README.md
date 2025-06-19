# LLM Chat Website

A modern web application that integrates AI chatbot functionality into an existing website, featuring Firebase Authentication and support for multiple AI models (OpenAI GPT and Anthropic Claude).

## Project Structure

```
llm-website/
├── frontend/            # React frontend with integrated chatbot
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat.js      # Main chat component
│   │   │   ├── Chat.css
│   │   │   ├── Auth.js      # Authentication component
│   │   │   └── Auth.css
│   │   ├── contexts/
│   │   │   └── AuthContext.js # Firebase auth state management
│   │   ├── pages/
│   │   │   ├── Home.js      # Main website pages
│   │   │   ├── About.js
│   │   │   ├── Involve.js
│   │   │   ├── ChatPage.js  # Chat page wrapper
│   │   │   └── ...
│   │   ├── utils/
│   │   │   └── api.js       # API communication utilities
│   │   ├── firebaseConfig.js # Firebase client configuration
│   │   └── package.json
│   └── backend/             # Node.js backend server
    ├── server.js        # Express server
    ├── routes/
    │   └── api.js       # API routes for AI models
    ├── .env             # Environment variables (API keys, Firebase service account)
    └── package.json
```

## Features

- 🔐 **Firebase Authentication** - Secure user login/signup with email/password and Google OAuth
- 🤖 **Multi-Model AI Chat** - Support for OpenAI GPT and Anthropic Claude
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🎨 **Integrated UI** - Chatbot seamlessly integrated into existing website design
- 🛡️ **Secure API** - Token-based authentication for all AI requests
- ⚡ **Real-time Chat** - Live messaging with typing indicators and error handling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase project with Authentication enabled
- OpenAI API key and/or Anthropic API key

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your API keys and Firebase service account:
   ```dotenv
   OPENAI_API_KEY=your_openai_key_here
   ANTHROPIC_API_KEY=your_anthropic_key_here
   FIREBASE_SERVICE_ACCOUNT_KEY_JSON='{"type": "service_account", "project_id": ...}'
   ```

4. Start the server:
   ```bash
   npm run dev
   ```
   The server will run on port 5001 by default.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Firebase (if using a different project):
   - Update `src/firebaseConfig.js` with your Firebase project configuration
   - Enable Authentication methods in Firebase Console

4. Configure API URL (if backend runs on different port):
   - Update `.env.local` with your backend URL:
   ```env
   REACT_APP_API_URL=http://localhost:5001/api
   ```

5. Start the development server:
   ```bash
   npm start
   ```
   The frontend will run on port 3000 by default.

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Click on "AI Chat" in the navigation menu
3. Sign up or log in using email/password or Google
4. Choose between OpenAI (GPT) or Anthropic (Claude) models
5. Start chatting with the AI!

## API Endpoints

- `GET /api/test` - Health check endpoint
- `POST /api/chat` - Send message to AI models (requires authentication)

## Authentication

The application uses Firebase Authentication with the following features:
- Email/password registration and login
- Google OAuth integration
- Secure token management
- Automatic token refresh

## Deployment

### Backend Deployment
- Deploy to platforms like Heroku, Railway, or AWS
- Set environment variables for API keys and Firebase service account
- Ensure CORS is configured for your frontend domain

### Frontend Deployment
- Build the application: `npm run build`
- Deploy to platforms like Vercel, Netlify, or AWS S3
- Update `REACT_APP_API_URL` to point to your production backend

## Customization

- **Styling**: Modify CSS files in `src/components/` and `src/pages/`
- **AI Models**: Add new models in the backend and update the frontend selector
- **Authentication**: Configure additional providers in Firebase Console
- **Website Content**: Update pages in `src/pages/` to match your needs

## Security Considerations

- Firebase API keys are safe to expose in client-side code
- All API requests require valid authentication tokens
- Backend validates all requests and should implement rate limiting
- Environment variables should be kept secure and not committed to version control

## License

MIT 