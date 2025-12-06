import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { ChatMessage } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to convert File to Base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        // Remove the Data URL prefix (e.g., "data:application/pdf;base64,")
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Initial Prompt to set the persona
const SYSTEM_INSTRUCTION = `
You are Simulax, an intelligent SOP (Standard Operating Procedure) document analyzer. 
Your goal is to help users understand, translate, and improve their technical documents.
Be precise, professional, yet helpful. 
When analyzing a document, focus on safety checks, procedure steps, and technical specifications.
Format your responses using Markdown for readability.
Use bold text for key terms and document titles.
`;

export class GeminiAgent {
  private chatSession: Chat | null = null;
  private modelName = 'gemini-2.5-flash';

  /**
   * Initializes the chat session with the document context.
   * Returns the initial greeting/analysis from the model.
   */
  async initializeSession(base64Data: string, filename: string): Promise<string> {
    try {
      this.chatSession = ai.chats.create({
        model: this.modelName,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      // Strict format prompt to match the desired persona
      const prompt = `Analyze the uploaded document named "${filename}". 
      
      Respond with this exact structure:
      "Hello! I have analyzed **${filename}**. I am ready to assist you with any procedures, safety checks, or technical details contained within this SOP."
      
      Do not add any other introductory text.`;
      
      const response: GenerateContentResponse = await this.chatSession.sendMessage({
        message: [
          {
            inlineData: {
              mimeType: 'application/pdf',
              data: base64Data
            }
          },
          { text: prompt }
        ]
      });

      return response.text || `Hello! I have analyzed **${filename}**. I am ready to assist.`;
    } catch (error) {
      console.error("Error initializing Gemini session:", error);
      throw error;
    }
  }

  /**
   * Sends a user message to the active session.
   */
  async sendMessage(message: string): Promise<string> {
    if (!this.chatSession) {
      throw new Error("Chat session not initialized");
    }

    try {
      const response: GenerateContentResponse = await this.chatSession.sendMessage({
        message: message
      });
      return response.text || "I apologize, I could not generate a response.";
    } catch (error) {
      console.error("Error sending message:", error);
      return "An error occurred while communicating with the AI.";
    }
  }
}

export const geminiAgent = new GeminiAgent();