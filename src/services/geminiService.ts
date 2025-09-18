import { GoogleGenAI, Chat, Content } from "@google/genai";
import type { ChatMessage, KnowledgeDocument } from '../types';

let chat: Chat | null = null;
let ai: GoogleGenAI | null = null;

const initializeAi = () => {
    if (ai) return;

    if (!process.env.API_KEY || process.env.API_KEY === 'undefined') {
        // Throw a specific error that the UI can catch and interpret.
        throw new Error('API_KEY_MISSING');
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const baseSystemInstruction = 'You are Resi, a supportive and friendly AI assistant for mental wellness. Keep your responses concise, empathetic, and encouraging. Focus on providing a safe and non-judgmental space for users to express themselves. Do not give medical advice.';

function mapHistoryToGenAI(history: ChatMessage[]): Content[] {
    return history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }],
    }));
}

export const sendMessageStream = async (message: string, history: ChatMessage[]) => {
    // This will throw a specific error if the key is missing, which can be caught by the caller.
    initializeAi();
    
    // Load knowledge base from local storage to provide context to the model.
    const knowledgeDocs: KnowledgeDocument[] = JSON.parse(localStorage.getItem('chatbotKnowledge') || '[]');
    
    let contextualSystemInstruction = baseSystemInstruction;
    if (knowledgeDocs.length > 0) {
        const context = knowledgeDocs.map(doc => `--- Document: ${doc.title} ---\n${doc.content}`).join('\n\n');
        contextualSystemInstruction += `\n\nUse the following documents to help answer the user's questions if relevant. Do not mention that you are using these documents. Just use the information naturally in your response.\n\n${context}`;
    }


    if (!chat || history.length === 0) {
        // Use non-null assertion because initializeAi() would have thrown an error if ai was null.
        chat = ai!.chats.create({
            model: 'gemini-2.5-flash',
            history: mapHistoryToGenAI(history),
            config: {
                systemInstruction: contextualSystemInstruction,
            },
        });
    }

    return chat.sendMessageStream({ message });
};