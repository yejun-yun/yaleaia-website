# Frontend - LLM Website with Integrated Chatbot

This is the frontend application for the LLM Website, featuring an integrated AI chatbot with Firebase Authentication.

## What's Included

The following components have been integrated into this React application:

1. **Firebase Authentication** - For user login/signup
2. **AI Chat Component** - Chat interface with OpenAI and Anthropic support
3. **Authentication Context** - Manages user state across the app
4. **API Integration** - Connects to the backend server
5. **Existing Website Pages** - Home, About, Get Involved, etc.

## Files Structure

### New Files:
- `src/firebaseConfig.js` - Firebase configuration
- `src/contexts/AuthContext.js` - Authentication state management
- `src/utils/api.js` - API communication utilities
- `src/components/Chat.js` - Main chat interface
- `src/components/Chat.css` - Chat styling
- `src/components/Auth.js` - Login/signup component
- `src/components/Auth.css` - Auth styling
- `src/pages/ChatPage.js` - Chat page wrapper
- `src/pages/ChatPage.css` - Chat page styling

### Modified Files:
- `src/App.js` - Added AuthProvider and chat route
- `src/pages/Navbar.js` - Added "AI Chat" navigation link
- `package.json` - Added Firebase dependency

## Setup Instructions

### 1. Backend Server Setup

Make sure your backend server is running on port 5001. The chatbot expects the API to be available at `http://localhost:5001/api`.

If your backend is running on a different port, update the `.env.local` file:
```
REACT_APP_API_URL=http://localhost:YOUR_PORT/api
```

### 2. Firebase Configuration

The Firebase configuration is already set up with the project from the original chatbot. If you need to use a different Firebase project:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Add a web app to your project
4. Copy the configuration and update `src/firebaseConfig.js`
5. Enable Authentication methods (Email/Password and Google)

### 3. Environment Variables

The `.env.local` file has been created with the default API URL. You can modify it if needed:

```env
REACT_APP_API_URL=http://localhost:5001/api
```

### 4. Running the Application

1. Start your backend server first:
   ```bash
   cd ../backend
   npm run dev
   ```

2. Start the frontend:
   ```bash
   npm start
   ```

3. Navigate to `http://localhost:3000/chat` to access the chatbot

## Usage

1. Click on "AI Chat" in the navigation menu
2. Sign up or log in using email/password or Google
3. Choose between OpenAI (GPT) or Anthropic (Claude) models
4. Start chatting with the AI

## Deployment

When deploying:

1. Make sure your backend is deployed and accessible
2. Update the `REACT_APP_API_URL` in `.env.local` to point to your production backend
3. Build and deploy as usual:
   ```bash
   npm run build
   ```

## Troubleshooting

### Common Issues:

1. **"Failed to get response from AI"** - Check that your backend server is running and accessible
2. **Authentication errors** - Verify Firebase configuration and enabled authentication methods
3. **CORS errors** - Ensure your backend allows requests from your frontend domain

### API Connection Issues:

If the chatbot can't connect to the backend:
1. Check that the backend is running on the correct port
2. Verify the API URL in `.env.local`
3. Check browser console for network errors
4. Ensure your backend has proper CORS configuration

## Customization

You can customize the chatbot by:

1. **Styling**: Modify `src/components/Chat.css` and `src/components/Auth.css`
2. **Functionality**: Update `src/components/Chat.js` for new features
3. **Models**: Add more AI models in the backend and update the frontend selector
4. **UI**: Modify `src/pages/ChatPage.js` for different layouts

## Security Notes

- Firebase API keys are safe to expose in client-side code
- User authentication is handled securely through Firebase
- API calls require valid authentication tokens
- Backend should validate all requests and implement rate limiting 