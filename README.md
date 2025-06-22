# LLM Chat Website

A modern web application that integrates AI chatbot functionality into an existing website, featuring Firebase Authentication and support for a wide range of AI models from OpenAI and Anthropic.

## Project Structure

```
yaleaia-website/
├── backend/             # Node.js backend server
│   ├── routes/
│   │   └── api.js       # API routes for AI models
│   ├── .env             # Environment variables
│   ├── server.js        # Express server
│   └── package.json
├── frontend/            # React frontend with integrated chatbot
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat.js      # Main chat component
│   │   │   ├── Auth.js      # Authentication component
│   │   │   └── ...
│   │   ├── pages/
│   │   │   └── ChatPage.js  # Page hosting the chat component
│   │   ├── App.js
│   │   └── ...
│   └── package.json
└── README.md
```

## Features

- 🔐 **Firebase Authentication**: Secure user login/signup with email/password and Google OAuth.
- 🤖 **Multi-Model Support**: Access a diverse range of models from **OpenAI** (including `o3`, `o1-series`, `GPT-4.1`, `GPT-4o`) and **Anthropic** (`Claude 4`, `Claude 3.7`).
- ✈️ **Modern UI**: A clean and intuitive interface with icon-only buttons for a streamlined user experience.
- 💬 **Real-time Chat**: Live messaging with error handling and model selection.
- ⬆️ **File Uploads**: Attach files to your conversations.
- 🔍 **Message Search**: Easily search through your chat history.
- 📱 **Responsive Design**: Works seamlessly on both desktop and mobile devices.
- 🛡️ **Secure API**: Token-based authentication for all AI requests.

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- A Firebase project with Authentication (Email/Password and Google) enabled.
- OpenAI and/or Anthropic API keys.

### Backend Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file and add your credentials. See `.env.example` if available, or use the following template:
    ```dotenv
    OPENAI_API_KEY=your_openai_key_here
    ANTHROPIC_API_KEY=your_anthropic_key_here
    FIREBASE_SERVICE_ACCOUNT_KEY_JSON='{"type": "service_account", "project_id": ...}'
    PORT=5001
    ```
4.  Start the server:
    ```bash
    npm start
    ```
    The server will run on the port specified in your `.env` file (default: 5001).

### Frontend Setup

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file with your backend's URL.
    ```env
    REACT_APP_API_URL=http://localhost:5001/api
    ```
    *Note: If you configured a different port for the backend, update it here.*
4.  Configure your Firebase project details in `src/firebaseConfig.js`.

5.  Start the development server:
    ```bash
    npm start
    ```
    The frontend will run on port 3000 by default.

## API Endpoints

- `GET /health` - Health check endpoint.
- `POST /api/chat` - Sends a message to the selected AI model. Requires authentication.

## Customization

-   **Styling**: Modify CSS files in `src/components/` and `src/pages/`.
-   **AI Models**: Add or remove models in `backend/routes/api.js` and update the model selector in `frontend/src/components/Chat.js`.
-   **Authentication**: Configure additional providers in the Firebase Console.
-   **Website Content**: Update the React components in `src/pages/` to match your needs.

## Security Considerations

- Firebase API keys are safe to expose in client-side code
- All API requests require valid authentication tokens
- Backend validates all requests and should implement rate limiting
- Environment variables should be kept secure and not committed to version control

## License

MIT 