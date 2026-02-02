import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Fab,
    Paper,
    Typography,
    TextField,
    IconButton,
    Collapse,
    Chip,
    Avatar,
    Fade,
    CircularProgress
} from '@mui/material';
import {
    Chat as ChatIcon,
    Close as CloseIcon,
    Send as SendIcon,
    SmartToy as BotIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import { chatbotEngine } from '../utils/chatbotEngine';

const AIChatbot = ({ currentTab, onNavigate }) => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (currentTab) {
            chatbotEngine.setContext('currentTab', currentTab);
        }
    }, [currentTab]);

    useEffect(() => {
        // Welcome message on first open
        if (open && messages.length === 0) {
            setTimeout(() => {
                addBotMessage("👋 Hello! I'm ElectroWizard AI Assistant. I can help you analyze the grid, identify critical zones, and guide restoration decisions. What would you like to know?");
            }, 500);
        }
    }, [open]);

    const addBotMessage = (text, delay = 0) => {
        setTimeout(() => {
            setMessages(prev => [...prev, {
                text,
                sender: 'bot',
                timestamp: new Date()
            }]);
            setIsTyping(false);
        }, delay);
    };

    const addUserMessage = (text) => {
        setMessages(prev => [...prev, {
            text,
            sender: 'user',
            timestamp: new Date()
        }]);
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        addUserMessage(userMessage);
        setInput('');
        setIsTyping(true);

        try {
            const response = await chatbotEngine.getResponse(userMessage);

            // Check if response includes navigation action
            if (typeof response === 'object' && response.action === 'navigate') {
                addBotMessage(response.text, 800);

                // Trigger navigation after a delay
                if (onNavigate && response.target) {
                    setTimeout(() => {
                        onNavigate(response.target);
                    }, 1200);
                }
            } else {
                // Regular text response
                addBotMessage(response, 800);
            }
        } catch (error) {
            console.error('Chatbot error:', error);
            addBotMessage("Sorry, I encountered an error. Please try again.", 500);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const quickQuestions = [
        "What's the grid status?",
        "Show critical zones",
        "Open risk map",
        "Explain this alert"
    ];

    const handleQuickClick = (question) => {
        setInput(question);
        setTimeout(() => handleSend(), 100);
    };

    return (
        <>
            {/* Floating Chat Button */}
            <Fade in={!open}>
                <Fab
                    color="primary"
                    aria-label="chat"
                    onClick={() => setOpen(true)}
                    sx={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #5a67d8 0%, #6b3f8f 100%)',
                            transform: 'scale(1.1)',
                        },
                        transition: 'all 0.3s ease',
                        boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
                        animation: 'pulse 2s infinite',
                        '@keyframes pulse': {
                            '0%': {
                                boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
                            },
                            '50%': {
                                boxShadow: '0 8px 30px rgba(102, 126, 234, 0.6)',
                            },
                            '100%': {
                                boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
                            },
                        },
                    }}
                >
                    <ChatIcon />
                </Fab>
            </Fade>

            {/* Chat Window */}
            <Collapse in={open} timeout={300}>
                <Paper
                    elevation={12}
                    sx={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                        width: 400,
                        height: 600,
                        maxHeight: 'calc(100vh - 100px)',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 4,
                        overflow: 'hidden',
                        background: '#ffffff',
                        zIndex: 1300,
                    }}
                >
                    {/* Header */}
                    <Box
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            p: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
                                <BotIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                                    ElectroWizard AI
                                </Typography>
                                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                    Always here to help
                                </Typography>
                            </Box>
                        </Box>
                        <IconButton onClick={() => setOpen(false)} sx={{ color: 'white' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Messages Container */}
                    <Box
                        sx={{
                            flex: 1,
                            overflowY: 'auto',
                            p: 2,
                            bgcolor: '#f9fafb',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                        }}
                    >
                        {messages.map((msg, idx) => (
                            <Box
                                key={idx}
                                sx={{
                                    display: 'flex',
                                    justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                    alignItems: 'flex-start',
                                    gap: 1,
                                }}
                            >
                                {msg.sender === 'bot' && (
                                    <Avatar sx={{ bgcolor: '#667eea', width: 32, height: 32 }}>
                                        <BotIcon fontSize="small" />
                                    </Avatar>
                                )}
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 1.5,
                                        maxWidth: '75%',
                                        bgcolor: msg.sender === 'user' ? '#667eea' : '#ffffff',
                                        color: msg.sender === 'user' ? 'white' : '#1f2937',
                                        borderRadius: 2,
                                        border: msg.sender === 'bot' ? '1px solid #e5e7eb' : 'none',
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            whiteSpace: 'pre-line',
                                            fontSize: '0.875rem',
                                            lineHeight: 1.6,
                                        }}
                                    >
                                        {msg.text}
                                    </Typography>
                                </Paper>
                                {msg.sender === 'user' && (
                                    <Avatar sx={{ bgcolor: '#3b82f6', width: 32, height: 32 }}>
                                        <PersonIcon fontSize="small" />
                                    </Avatar>
                                )}
                            </Box>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar sx={{ bgcolor: '#667eea', width: 32, height: 32 }}>
                                    <BotIcon fontSize="small" />
                                </Avatar>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 1.5,
                                        bgcolor: '#ffffff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: 2,
                                    }}
                                >
                                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                                        {[0, 1, 2].map((i) => (
                                            <Box
                                                key={i}
                                                sx={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: '50%',
                                                    bgcolor: '#667eea',
                                                    animation: 'typing 1.4s infinite',
                                                    animationDelay: `${i * 0.2}s`,
                                                    '@keyframes typing': {
                                                        '0%, 60%, 100%': { opacity: 0.3 },
                                                        '30%': { opacity: 1 },
                                                    },
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </Paper>
                            </Box>
                        )}

                        <div ref={messagesEndRef} />
                    </Box>

                    {/* Quick Questions (shown when no messages) */}
                    {messages.length === 0 && !isTyping && (
                        <Box sx={{ p: 2, pt: 0, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {quickQuestions.map((q, idx) => (
                                <Chip
                                    key={idx}
                                    label={q}
                                    onClick={() => handleQuickClick(q)}
                                    size="small"
                                    sx={{
                                        cursor: 'pointer',
                                        '&:hover': {
                                            bgcolor: '#e0e7ff',
                                            color: '#667eea',
                                        },
                                    }}
                                />
                            ))}
                        </Box>
                    )}

                    {/* Input Area */}
                    <Box
                        sx={{
                            p: 2,
                            borderTop: '1px solid #e5e7eb',
                            bgcolor: 'white',
                            display: 'flex',
                            gap: 1,
                        }}
                    >
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Ask me anything about the grid..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 3,
                                },
                            }}
                        />
                        <IconButton
                            color="primary"
                            onClick={handleSend}
                            disabled={!input.trim() || isTyping}
                            sx={{
                                bgcolor: '#667eea',
                                color: 'white',
                                '&:hover': {
                                    bgcolor: '#5a67d8',
                                },
                                '&:disabled': {
                                    opacity: 0.5,
                                },
                            }}
                        >
                            <SendIcon />
                        </IconButton>
                    </Box>
                </Paper>
            </Collapse>
        </>
    );
};

export default AIChatbot;
