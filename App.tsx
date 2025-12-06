import React, { useState, useEffect } from 'react';
import { AppPhase, ChatMessage, DocumentContext } from './types';
import UploadScreen from './components/UploadScreen';
import ProcessingScreen from './components/ProcessingScreen';
import PdfViewer from './components/PdfViewer';
import ChatInterface from './components/ChatInterface';
import { geminiAgent, fileToGenerativePart } from './services/geminiService';
import { ArrowLeft, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [phase, setPhase] = useState<AppPhase>(AppPhase.UPLOAD);
  const [docContext, setDocContext] = useState<DocumentContext | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [initialAnalysisComplete, setInitialAnalysisComplete] = useState(false);

  // Clean up object URL on unmount
  useEffect(() => {
    return () => {
      if (docContext?.url) {
        URL.revokeObjectURL(docContext.url);
      }
    };
  }, [docContext]);

  const handleFileSelect = async (file: File) => {
    try {
      const url = URL.createObjectURL(file);
      const base64 = await fileToGenerativePart(file);
      
      setDocContext({
        file,
        url,
        base64
      });
      setPhase(AppPhase.PROCESSING);
    } catch (error) {
      console.error("File processing error:", error);
      alert("Error reading file.");
    }
  };

  const handleProcessingComplete = async () => {
    // Animation finished, now actually trigger AI
    if (!docContext) return;

    try {
      // This is where we call the API
      const introText = await geminiAgent.initializeSession(docContext.base64, docContext.file.name);
      
      setMessages([
        {
          id: 'init-1',
          role: 'model',
          text: introText,
          timestamp: Date.now()
        }
      ]);
      setInitialAnalysisComplete(true);
      setPhase(AppPhase.VIEWER);
    } catch (error) {
      console.error("Gemini init error:", error);
      alert("Failed to initialize AI agent. Please check your API key.");
      setPhase(AppPhase.UPLOAD); // Reset on error
    }
  };

  const handleSendMessage = async (text: string) => {
    // Add user message immediately
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsAiProcessing(true);

    try {
      const responseText = await geminiAgent.sendMessage(text);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiProcessing(false);
    }
  };

  const resetApp = () => {
    if (confirm("Are you sure? This will clear the current session.")) {
        setDocContext(null);
        setMessages([]);
        setPhase(AppPhase.UPLOAD);
        setInitialAnalysisComplete(false);
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-background text-white font-sans">
      
      {phase === AppPhase.UPLOAD && (
        <UploadScreen onFileSelect={handleFileSelect} />
      )}

      {phase === AppPhase.PROCESSING && (
        <ProcessingScreen onComplete={handleProcessingComplete} />
      )}

      {phase === AppPhase.VIEWER && docContext && (
        <div className="flex flex-col h-full relative">
          {/* Top Bar */}
          <header className="h-14 bg-surface border-b border-slate-800 flex items-center justify-between px-6 z-20">
             <div className="flex items-center gap-4">
                <div className="bg-teal-500/10 p-1.5 rounded-lg border border-teal-500/20">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
                </div>
                <div>
                   <h1 className="text-sm font-semibold text-white leading-tight">{docContext.file.name}</h1>
                   <p className="text-[10px] text-primary tracking-wide font-medium">SIMULAX VIEWER</p>
                </div>
             </div>
             <button 
                onClick={resetApp}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
             >
                <RefreshCw className="w-3.5 h-3.5" />
                New Upload
             </button>
          </header>

          {/* Main Content Area */}
          <div className="flex-1 relative overflow-hidden">
             {/* PDF Viewer takes full space */}
             <PdfViewer url={docContext.url} />
             
             {/* Chat Interface floats on top */}
             <ChatInterface 
                messages={messages} 
                onSendMessage={handleSendMessage}
                isProcessing={isAiProcessing}
                filename={docContext.file.name}
             />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;