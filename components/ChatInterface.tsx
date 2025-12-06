import React, { useState, useRef, useEffect } from 'react';
import { Send, Minimize2, Bot } from 'lucide-react';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isProcessing: boolean;
  filename: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages, 
  onSendMessage, 
  isProcessing,
  filename 
}) => {
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isExpanded]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      onSendMessage(input);
      setInput('');
    }
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-surface border border-slate-700 p-4 rounded-full shadow-2xl hover:bg-slate-800 transition-all group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors" />
          <Bot className="w-8 h-8 text-primary relative z-10" />
          {/* Status Dot */}
          <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-primary rounded-full border-2 border-surface animate-pulse" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-24 right-6 bottom-6 w-[400px] flex flex-col z-40 bg-[#0b1120] border border-slate-700 shadow-2xl rounded-2xl overflow-hidden animate-in slide-in-from-right-10 duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#0f172a]">
        <div className="flex items-center gap-3">
          {/* Pulsing Status Dot */}
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm tracking-wide">Simulax Agent</h3>
            <p className="text-[10px] text-slate-400 font-medium">ONLINE</p>
          </div>
        </div>
        <button 
          onClick={() => setIsExpanded(false)}
          className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
        >
          <Minimize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-5 space-y-6 bg-[#0b1120] scrollbar-hide"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[90%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
                msg.role === 'user'
                  ? 'bg-slate-800 text-white rounded-br-sm'
                  : 'bg-[#151e2e] text-slate-200 border border-slate-800 rounded-bl-sm'
              }`}
            >
               {msg.role === 'model' ? (
                 <ReactMarkdown 
                    className="prose prose-invert prose-sm max-w-none 
                      prose-p:my-2 prose-p:leading-relaxed 
                      prose-headings:text-teal-400 prose-headings:font-bold
                      prose-strong:text-teal-400 prose-strong:font-bold
                      prose-ul:my-2 prose-ul:list-disc prose-ul:pl-4
                      prose-li:my-1 prose-li:text-slate-300"
                  >
                    {msg.text}
                 </ReactMarkdown>
               ) : (
                 msg.text
               )}
            </div>
          </div>
        ))}
        {isProcessing && (
           <div className="flex justify-start">
             <div className="bg-[#151e2e] border border-slate-800 rounded-2xl rounded-bl-sm p-4 flex gap-2 items-center">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
             </div>
           </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-[#0f172a] border-t border-slate-800">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            className="w-full bg-[#1e293b] border border-slate-700 rounded-xl pl-4 pr-12 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={!input.trim() || isProcessing}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;