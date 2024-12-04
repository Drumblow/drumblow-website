export interface TelegramMessage {
    id: string;
    text: string;
    timestamp: Date;
    from: 'user' | 'admin';
    attachments?: string[];
  }
  
  export interface TelegramSession {
    chatId: string;
    userId: string;
    userName: string;
    startTime: Date;
    lastActivity: Date;
  }