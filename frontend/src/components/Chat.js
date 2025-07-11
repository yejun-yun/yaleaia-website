import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchChatReply } from '../utils/api';
import { auth } from '../firebaseConfig';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './Chat.css';

const Chat = ({ onLogout }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedModel, setSelectedModel] = useState('claude-3.5-sonnet');
    const [temperature, setTemperature] = useState(0.7);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [abortController, setAbortController] = useState(null);
    const { currentUser, logout, idToken, refreshIdToken } = useAuth();
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const fileInputRef = useRef(null);

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

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            // You could add a toast notification here
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const cancelProcessing = () => {
        if (abortController) {
            abortController.abort();
            setAbortController(null);
        }
        setIsLoading(false);
        setError('');
    };

    const regenerateResponse = async (messageIndex) => {
        const userMessage = messages[messageIndex - 1];
        if (!userMessage || userMessage.sender !== 'user') return;

        // The history is all messages up to and including the user message
        const historyToResend = messages.slice(0, messageIndex);

        // Remove the old AI response and any subsequent messages
        setMessages(historyToResend);
        
        // Regenerate
        setIsLoading(true);
        setError('');

        try {
            let currentToken = idToken;
            if (!currentToken && currentUser) {
                currentToken = await currentUser.getIdToken();
            }

            if (!currentToken) {
                setError("Authentication token is missing. Please try logging in again.");
                setIsLoading(false);
                return;
            }

            const apiMessages = historyToResend.map(msg => ({
                role: msg.sender === 'ai' ? 'assistant' : 'user',
                content: msg.text
            }));


            const data = await fetchChatReply(apiMessages, selectedModel, currentToken, null, temperature);
            const aiMessage = { 
                sender: 'ai', 
                text: data.reply, 
                timestamp: new Date(),
                id: Date.now()
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (err) {
            console.error("Failed to regenerate response:", err);
            setError(err.message || 'Failed to regenerate response. Please try again.');
        }
        setIsLoading(false);
    };

    const editMessage = (messageIndex) => {
        const message = messages[messageIndex];
        if (message.sender === 'user') {
            setInput(message.text);
            // Remove all messages from this point forward
            setMessages(prev => prev.slice(0, messageIndex));
            inputRef.current?.focus();
        }
    };

    const clearChat = () => {
        if (window.confirm('Are you sure you want to clear the entire chat history?')) {
            setMessages([]);
            setError('');
            setUploadedFiles([]);
        }
    };

    const exportChat = () => {
        const chatText = messages.map(msg => {
            const timestamp = new Date(msg.timestamp).toLocaleString();
            return `[${timestamp}] ${msg.sender.toUpperCase()}: ${msg.text}`;
        }).join('\n\n');
        
        const blob = new Blob([chatText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-export-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        const validFiles = files.filter(file => {
            const maxSize = 10 * 1024 * 1024; // 10MB limit
            if (file.size > maxSize) {
                alert(`File ${file.name} is too large. Maximum size is 10MB.`);
                return false;
            }
            return true;
        });

        setUploadedFiles(prev => [...prev, ...validFiles]);
        event.target.value = ''; // Reset file input
    };

    const removeFile = (index) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const filteredMessages = messages.filter(msg => 
        !searchQuery || 
        msg.text.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSend = async () => {
        if (input.trim() === '' && uploadedFiles.length === 0) return;

        const userMessage = { 
            sender: 'user', 
            text: input, 
            timestamp: new Date(),
            id: Date.now(),
            files: uploadedFiles.length > 0 ? [...uploadedFiles] : undefined
        };

        const newMessages = [...messages, userMessage];
        setMessages(newMessages);

        const currentInput = input;
        const currentFiles = [...uploadedFiles];
        setInput('');
        setUploadedFiles([]);
        setIsLoading(true);
        setError('');

        // Create abort controller for cancellation
        const controller = new AbortController();
        setAbortController(controller);

        // Prepare message with file information
        let messageContent = currentInput;
        if (currentFiles.length > 0) {
            const fileInfo = currentFiles.map(file => 
                `[File: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)]`
            ).join('\n');
            messageContent = `${messageContent}\n\n${fileInfo}`;
        }
        
        const apiMessages = newMessages.map(msg => {
            let content = msg.text;
            if (msg.sender === 'user' && msg.id === userMessage.id) {
                content = messageContent;
            }
            return {
                role: msg.sender === 'ai' ? 'assistant' : 'user',
                content: content
            };
        });

        try {
            if (!idToken && !auth.currentUser) {
                setError("Authentication token is missing. Please try logging in again.");
                setIsLoading(false);
                return;
            }
            
            let currentToken = idToken;
            if (!currentToken && currentUser) {
                console.log("Context idToken is null, trying to get a fresh one.");
                currentToken = await currentUser.getIdToken();
            }

            if (!currentToken) {
                setError("Could not retrieve authentication token. Please log out and log in again.");
                setIsLoading(false);
                return;
            }

            try {
                const data = await fetchChatReply(apiMessages, selectedModel, currentToken, controller.signal, temperature);
                const aiMessage = { 
                    sender: 'ai', 
                    text: data.reply, 
                    timestamp: new Date(),
                    id: Date.now()
                };
                setMessages(prevMessages => [...prevMessages, aiMessage]);
            } catch (apiError) {
                if (apiError.name === 'AbortError') {
                    console.log('Request was cancelled');
                    return;
                }
                
                if (apiError.message.includes("token") || apiError.message.includes("Unauthorized") || apiError.message.includes("Forbidden")) { 
                    console.log("Token might be expired or invalid, attempting refresh...");
                    currentToken = await refreshIdToken();
                    if (currentToken) {
                        console.log("Token refreshed, retrying API call...");
                        const data = await fetchChatReply(apiMessages, selectedModel, currentToken, controller.signal, temperature);
                        const aiMessage = { 
                            sender: 'ai', 
                            text: data.reply, 
                            timestamp: new Date(),
                            id: Date.now()
                        };
                        setMessages(prevMessages => [...prevMessages, aiMessage]);
                    } else {
                        setError("Failed to refresh authentication token. Please log out and log in again.");
                        setMessages(prev => prev.filter(msg => msg !== userMessage));
                        setInput(currentInput);
                        setUploadedFiles(currentFiles);
                    }
                } else {
                    throw apiError; 
                }
            }
        } catch (err) {
            if (err.name === 'AbortError') {
                console.log('Request was cancelled');
                return;
            }
            console.error("Failed to send message:", err);
            setError(err.message || 'Failed to get response from the AI. Please try again.');
            setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
            setInput(currentInput);
            setUploadedFiles(currentFiles);
        }
        setIsLoading(false);
        setAbortController(null);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const MessageActions = ({ message, index }) => (
        <div className="message-actions">
            <button 
                onClick={() => copyToClipboard(message.text)}
                title="Copy message"
                className="action-btn"
            >
                Copy
            </button>
            {message.sender === 'ai' && (
                <button 
                    onClick={() => regenerateResponse(index)}
                    title="Regenerate response"
                    className="action-btn"
                    disabled={isLoading}
                >
                    Regenerate
                </button>
            )}
            {message.sender === 'user' && (
                <button 
                    onClick={() => editMessage(index)}
                    title="Edit message and continue from here"
                    className="action-btn"
                >
                    Edit
                </button>
            )}
        </div>
    );

    const MessageContent = ({ text, files }) => (
        <div>
            <ReactMarkdown
                components={{
                    code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            <SyntaxHighlighter
                                style={tomorrow}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    }
                }}
            >
                {text}
            </ReactMarkdown>
            {files && files.length > 0 && (
                <div className="message-files">
                    <h4>Attached Files:</h4>
                    <div className="file-list">
                        {files.map((file, index) => (
                            <div key={index} className="file-item">
                                <span className="file-name">{file.name}</span>
                                <span className="file-size">({(file.size / 1024 / 1024).toFixed(2)}MB)</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="chat-container">
            <header className="chat-header">
                <div className="model-selector">
                    <select value={selectedModel} onChange={e => setSelectedModel(e.target.value)}>
                        <optgroup label="OpenAI">
                            <option value="gpt-4o">GPT-4o</option>
                            <option value="o1">o1 (Reasoning)</option>
                            <option value="o3">o3 (Latest Reasoning)</option>
                            <option value="o3-mini">o3-mini (Compact Reasoning)</option>
                            <option value="o4-mini">o4-mini (Latest Multimodal)</option>
                            <option value="gpt-4.5">GPT-4.5 (Enhanced)</option>
                        </optgroup>
                        <optgroup label="Anthropic">
                            <option value="claude-3-opus">Claude 3 Opus</option>
                            <option value="claude-3.5-sonnet">Claude 3.5 Sonnet</option>
                            <option value="claude-4-sonnet">Claude 4 Sonnet</option>
                        </optgroup>
                    </select>
                </div>
                <div className="temperature-slider">
                    <label htmlFor="temperature">Temp: {temperature.toFixed(1)}</label>
                    <input
                        type="range"
                        id="temperature"
                        min="0"
                        max="2"
                        step="0.1"
                        value={temperature}
                        onChange={e => setTemperature(parseFloat(e.target.value))}
                    />
                </div>
                <div className="header-actions">
                    <button onClick={exportChat} title="Export Chat" className="icon-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                    </button>
                    <button onClick={clearChat} title="Clear Chat" className="icon-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </button>
                    <button onClick={handleLogout} title="Logout" className="icon-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                        </svg>
                    </button>
                </div>
            </header>

            {showSearch && (
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search messages..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    {searchQuery && (
                        <button 
                            onClick={() => setSearchQuery('')}
                            className="clear-search-btn"
                        >
                            Clear
                        </button>
                    )}
                </div>
            )}

            <div className="messages-area">
                {filteredMessages.length === 0 && !isLoading && !searchQuery && (
                    <div className="empty-state">
                        <h3>Start a conversation</h3>
                        <p>Choose a model and begin chatting</p>
                    </div>
                )}

                {filteredMessages.map((msg, index) => (
                    <div key={msg.id || index} className={`message ${msg.sender}`}>
                        <div className="message-bubble">
                            <div className="message-content">
                                <MessageContent text={msg.text} files={msg.files} />
                            </div>
                            <div className="message-footer">
                                <span className="timestamp">
                                    {new Date(msg.timestamp).toLocaleString()}
                                </span>
                                <MessageActions message={msg} index={index} />
                            </div>
                        </div>
                    </div>
                ))}
                
                {isLoading && messages[messages.length -1]?.sender === 'user' && (
                    <div className="message ai typing-indicator">
                        <div className="message-bubble">
                            <div className="typing-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <p>Thinking...</p>
                        </div>
                    </div>
                )}
                
                {error && 
                    <div className="message system-message error-display">
                        <div className="message-bubble">
                            <p>Error: {error}</p>
                        </div>
                    </div>
                }
                <div ref={messagesEndRef} />
            </div>
            
            <div className="input-area">
                {uploadedFiles.length > 0 && (
                    <div className="file-upload-area">
                        <h4>Attached Files:</h4>
                        <div className="file-list">
                            {uploadedFiles.map((file, index) => (
                                <div key={index} className="file-item">
                                    <span className="file-name">{file.name}</span>
                                    <span className="file-size">({(file.size / 1024 / 1024).toFixed(2)}MB)</span>
                                    <button 
                                        onClick={() => removeFile(index)}
                                        className="remove-file-btn"
                                        title="Remove file"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                <div className="input-container">
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message... (Shift+Enter for new line)"
                        rows="3"
                        disabled={isLoading}
                        className="message-input"
                    />
                    <div className="input-actions">
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="file-upload-btn"
                            title="Upload files"
                            disabled={isLoading}
                        >
                            📎
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            style={{ display: 'none' }}
                            accept="*/*"
                        />
                        {isLoading ? (
                            <button 
                                onClick={cancelProcessing}
                                className="cancel-button"
                                title="Cancel processing"
                            >
                                Cancel
                            </button>
                        ) : (
                            <button 
                                onClick={handleSend} 
                                disabled={(input.trim() === '' && uploadedFiles.length === 0)}
                                className="send-button"
                                title="Send message"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat; 