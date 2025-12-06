export enum AppPhase {
  UPLOAD = 'UPLOAD',
  PROCESSING = 'PROCESSING',
  VIEWER = 'VIEWER'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface ProcessingStep {
  id: number;
  label: string;
  status: 'waiting' | 'active' | 'completed';
}

export interface DocumentContext {
  file: File;
  url: string; // Object URL for display
  base64: string; // For API usage
}