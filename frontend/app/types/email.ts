// app/types/email.ts
export interface Email {
  id: string;
  subject: string;
  sender: string;
  recipient?: string;
  content?: string;
  timestamp: number;
  folder?: string;
  read?: boolean;
}

export interface EmailResponse {
  date: number;
  from: string;
  id: string;
  subject: string;
}