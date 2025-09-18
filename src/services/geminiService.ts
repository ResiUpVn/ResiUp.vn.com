// FIX: Align with @google/genai SDK guidelines.
import { GoogleGenAI, Chat, Content } from "@google/genai";
import type { ChatMessage, KnowledgeDocument } from '../types';

let chat: Chat | null = null;

// FIX: Initialize GoogleGenAI with a named apiKey parameter from process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const baseSystemInstruction = 'You are Resi, a supportive and friendly AI assistant for mental wellness. Keep your responses concise, empathetic, and encouraging. Focus on providing a safe and non-judgmental space for users to express themselves. Do not give medical advice.';

function mapHistoryToGenAI(history: ChatMessage[]): Content[] {
    return history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }],
    }));
}

export const sendMessageStream = async (message: string, history: ChatMessage[]) => {
    // FIX: Re-initialize chat when it's not created or when a new conversation starts (history is empty).
    // This prevents state from a previous chat session from persisting across page navigations.
    
    // Load knowledge base from local storage to provide context to the model.
    const knowledgeDocs: KnowledgeDocument[] = JSON.parse(localStorage.getItem('chatbotKnowledge') || '[]');
    
    let contextualSystemInstruction = baseSystemInstruction;
    if (knowledgeDocs.length > 0) {
        const context = knowledgeDocs.map(doc => `--- Document: ${doc.title} ---\n${doc.content}`).join('\n\n');
        contextualSystemInstruction += `\n\nUse the following documents to help answer the user's questions if relevant. Do not mention that you are using these documents. Just use the information naturally in your response.\n\n${context}`;
    }


    if (!chat || history.length === 0) {
        // FIX: Use 'gemini-2.5-flash' model for chat.
        chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            history: mapHistoryToGenAI(history),
            config: {
                systemInstruction: contextualSystemInstruction,
            },
        });
    }

    // FIX: The sendMessageStream method returns a promise that resolves to an async iterable object.
    return chat.sendMessageStream({ message });
};
