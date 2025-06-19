import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchChatReply } from '../utils/api';
import { auth } from '../firebaseConfig';
import './Chat.css';

const Chat = ({ onLogout }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedModel, setSelectedModel] = useState('openai'); // 'openai' or 'anthropic'
    const { currentUser, logout, idToken, refreshIdToken } = useAuth();
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleLogout = async () => {
        await logout();
        if (onLogout) {
            onLogout();
        }
    };

    const handleSend = async () => {
        if (input.trim() === '') return;

        const userMessage = { sender: 'user', text: input, timestamp: new Date() };
        setMessages(prevMessages => [...prevMessages, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);
        setError('');

        try {
            if (!idToken && !auth.currentUser) { // Check both context and direct auth state
                setError("Authentication token is missing. Please try logging in again.");
                setIsLoading(false);
                // Optionally, try to refresh token here or prompt re-login
                return;
            }
            
            let currentToken = idToken;
            if (!currentToken && currentUser) { // Fallback if context token is null but user exists
                console.log("Context idToken is null, trying to get a fresh one.");
                currentToken = await currentUser.getIdToken();
            }

            if (!currentToken) {
                setError("Could not retrieve authentication token. Please log out and log in again.");
                setIsLoading(false);
                return;
            }

            try {
                const data = await fetchChatReply(userMessage.text, selectedModel, currentToken);
                const aiMessage = { sender: 'ai', text: data.reply, timestamp: new Date() };
                setMessages(prevMessages => [...prevMessages, aiMessage]);
            } catch (apiError) {
                if (apiError.message.includes("token") || apiError.message.includes("Unauthorized") || apiError.message.includes("Forbidden")) { 
                    console.log("Token might be expired or invalid, attempting refresh...");
                    currentToken = await refreshIdToken();
                    if (currentToken) {
                        console.log("Token refreshed, retrying API call...");
                        const data = await fetchChatReply(userMessage.text, selectedModel, currentToken);
                        const aiMessage = { sender: 'ai', text: data.reply, timestamp: new Date() };
                        setMessages(prevMessages => [...prevMessages, aiMessage]);
                    } else {
                        setError("Failed to refresh authentication token. Please log out and log in again.");
                        setMessages(prev => prev.filter(msg => msg !== userMessage)); // Remove user's message
                        setInput(currentInput); // Restore user's input
                    }
                } else {
                    throw apiError; 
                }
            }
        } catch (err) {
            console.error("Failed to send message:", err);
            setError(err.message || 'Failed to get response from the AI. Please try again.');
            setMessages(prev => prev.filter(msg => msg !== userMessage)); // Remove user's message
            setInput(currentInput); // Restore user's input
        }
        setIsLoading(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="chat-container">
            <header className="chat-header">
                <div className="user-info">
                    {currentUser?.email ? `Logged in as: ${currentUser.email}` : 'Not logged in'}
                </div>
                <div className="model-selector">
                    <label htmlFor="model">AI Model: </label>
                    <select id="model" value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} disabled={isLoading}>
                        <option value="openai">OpenAI (GPT)</option>
                        <option value="anthropic">Anthropic (Claude)</option>
                    </select>
                </div>
                <button onClick={handleLogout} className="logout-button" disabled={isLoading}>Logout</button>
            </header>
            <div className="messages-area">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        <div className="message-bubble">
                            <p>{msg.text}</p>
                            <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                        </div>
                    </div>
                ))}
                {isLoading && messages[messages.length -1]?.sender === 'user' && (
                    <div className="message ai typing-indicator">
                        <div className="message-bubble"><p>AI is thinking...</p></div>
                    </div>
                )}
                {error && 
                    <div className="message system-message error-display">
                        <div className="message-bubble"><p>{error}</p></div>
                    </div>
                }
                <div ref={messagesEndRef} />
            </div>
            <div className="input-area">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message... (Shift+Enter for new line)"
                    rows="3"
                    disabled={isLoading}
                />
                <button onClick={handleSend} disabled={isLoading || input.trim() === ''}>
                    {isLoading ? 'Sending...' : 'Send'}
                </button>
            </div>
        </div>
    );
};

export default Chat; 