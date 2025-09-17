// FIX: Replaced placeholder content with the correct type definitions to resolve module loading errors.

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface DailyChallenge {
  id: number;
  text: string;
  completed: boolean;
  date: string; // YYYY-MM-DD
}

export interface User {
  id: string;
  email: string;
  isAdmin?: boolean;
}

export interface ForumComment {
  id: string;
  content: string;
  authorEmail: string;
  authorId: string;
  createdAt: string;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  authorEmail: string;
  authorId: string;
  createdAt: string;
  comments: ForumComment[];
}

export interface ChatSession {
  sessionId: string;
  userEmail: string;
  userId: string;
  messages: ChatMessage[];
}

export interface ResourceVideo {
  id: string;
  title: string;
  description: string;
  videoId: string;
}

export interface NatureSound {
  id: string;
  name: string;
  videoId: string;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  content: string;
}

export interface TestResult {
    date: string;
    scores: {
        depression: number;
        anxiety: number;
        stress: number;
    };
}