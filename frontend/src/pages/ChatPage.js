import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Auth from '../components/Auth';
import Chat from '../components/Chat';
import './ChatPage.css';

const ChatPage = () => {
    const { currentUser } = useAuth();
    const [showAuth, setShowAuth] = useState(!currentUser);

    const handleAuthSuccess = () => {
        setShowAuth(false);
    };

    const handleLogout = () => {
        setShowAuth(true);
    };

    return (
        <div className="chat-page">
            <div className="chat-page-header">
                <h1>AI Chat Assistant</h1>
                <p>Chat with OpenAI's GPT or Anthropic's Claude AI models</p>
            </div>
            
            {showAuth ? (
                <Auth onAuthSuccess={handleAuthSuccess} />
            ) : (
                <div className="chat-wrapper">
                    <Chat onLogout={handleLogout} />
                </div>
            )}
        </div>
    );
};

export default ChatPage; 