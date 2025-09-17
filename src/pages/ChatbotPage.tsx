import React, { useState, useRef, useEffect, useCallback } from 'react';
import PageTitle from '../components/PageTitle';
import { sendMessageStream } from '../services/geminiService';
import { BotIcon, UserIcon, SendIcon } from '../components/icons/Icons';
import type { ChatMessage, ChatSession } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import useLocalStorage from '../hooks/useLocalStorage';
import { useAuth } from '../context/AuthContext';

const ChatbotPage: React.FC = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [, setChatSessions] = useLocalStorage<ChatSession[]>('chatSessions', []);

    useEffect(() => {
        // This effect runs when the component is unmounted.
        // It saves the chat history if it's not empty.
        return () => {
            if (messages.length > 1 && user) { // Only save non-trivial conversations
                const newSession: ChatSession = {
                    sessionId: new Date().toISOString(),
                    userEmail: user.email,
                    userId: user.id,
                    messages: messages,
                };
                // We read the latest sessions from storage, add the new one, and write back.
                const allSessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
                allSessions.push(newSession);
                localStorage.setItem('chatSessions', JSON.stringify(allSessions));
            }
        };
    }, [messages, user, setChatSessions]);


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    
    const handleSend = useCallback(async () => {
        if (input.trim() === '' || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const stream = await sendMessageStream(input, messages);
            let modelResponse = '';
            setMessages(prev => [...prev, { role: 'model', text: '' }]);
            
            for await (const chunk of stream) {
                modelResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text = modelResponse;
                    return newMessages;
                });
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => [
                ...prev,
                { role: 'model', text: 'Sorry, something went wrong. Please try again.' },
            ]);
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading, messages]);

    return (
        <div className="flex flex-col h-full">
            <PageTitle title="Chat with Resi" subtitle="Your personal AI assistant for guidance and support." />
            
            <div className="flex-1 bg-white rounded-lg shadow-sm p-4 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                            {msg.role === 'model' && (
                                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                                    <BotIcon className="w-5 h-5 text-teal-600"/>
                                </div>
                            )}
                            <div className={`max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                            </div>
                            {msg.role === 'user' && (
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                    <UserIcon className="w-5 h-5 text-gray-600"/>
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
                         <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                                <BotIcon className="w-5 h-5 text-teal-600"/>
                            </div>
                             <div className="max-w-md p-3 rounded-lg bg-gray-200 text-gray-800">
                                 <LoadingSpinner />
                             </div>
                         </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                
                <div className="mt-4 border-t pt-4">
                    <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type your message here..."
                            className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                            disabled={isLoading}
                        />
                        <button onClick={handleSend} disabled={isLoading} className="absolute inset-y-0 right-0 flex items-center justify-center w-12 text-gray-500 hover:text-teal-600 disabled:text-gray-300 transition-colors">
                            <SendIcon className="w-6 h-6"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatbotPage;
