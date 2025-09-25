import { GoogleGenAI, Chat, Content } from "@google/genai";
import type { ChatMessage, KnowledgeDocument } from '../types';

let chat: Chat | null = null;
let ai: GoogleGenAI | null = null;

// Thêm key mặc định vĩnh viễn
const DEFAULT_API_KEY = "AIzaSyA4-Il78cTr1lhrGVe2GurX_FvZ-dLRi8g";

const initializeAi = () => {
    if (ai) return;

    // 1. Ưu tiên lấy API key từ localStorage (do admin set).
    // 2. Fallback qua biến môi trường (dùng cho Vercel/dev).
    // 3. Nếu không có, dùng key mặc định.
    const getApiKey = (): string | null => {
        const storedKey = localStorage.getItem('geminiApiKey');
        if (storedKey && storedKey !== 'undefined' && storedKey.trim() !== '') {
            return storedKey;
        }
        const envKey = process.env.API_KEY;
        if (envKey && envKey !== 'undefined' && envKey.trim() !== '') {
            return envKey;
        }
        // Nếu không tìm thấy, dùng key mặc định
        return DEFAULT_API_KEY;
    };
    
    const apiKey = getApiKey();

    if (!apiKey) {
        // Throw a specific error that the UI can catch and interpret.
        throw new Error('API_KEY_MISSING');
    }
    ai = new GoogleGenAI({ apiKey });
};

const baseSystemInstruction = 'You are Resi, a supportive and friendly AI assistant for mental wellness. Keep your responses concise, empathetic, and encouraging. Focus on providing a safe and non-judgmental space.';

function mapHistoryToGenAI(history: ChatMessage[]): Content[] {
    return history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }],
    }));
}

export const sendMessageStream = async (message: string, history: ChatMessage[]) => {
    initializeAi();
    
    // Load knowledge base from local storage to provide context to the model.
    const knowledgeDocs: KnowledgeDocument[] = JSON.parse(localStorage.getItem('chatbotKnowledge') || '[]');
    
    let contextualSystemInstruction = baseSystemInstruction;
    if (knowledgeDocs.length > 0) {
        const context = knowledgeDocs.map(doc => `--- Document: ${doc.title} ---\n${doc.content}`).join('\n\n');
        contextualSystemInstruction += `\n\nUse the following documents to help answer the user's questions if relevant. Do not mention that you are using these documents. Just use the information naturally. If the documents are not relevant, answer normally.:\n${context}`;
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
