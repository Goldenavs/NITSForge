// src/components/forge/ForgeChatDrawer.tsx
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Loader2 } from 'lucide-react';
import { supabase } from '../../services/supabase';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface ForgeChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  context?: any;
}

export function ForgeChatDrawer({ isOpen, onClose, context }: ForgeChatDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: context ? "Greetings! I'm Forge, your AI companion. Need a hint on this question?" : "Greetings! I'm Forge, your AI companion. How can I help you conquer PhilNITS?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    // Reset greeting when context changes (e.g. entering/leaving a quiz)
    if (messages.length <= 1) {
      setMessages([
        { role: 'model', text: context ? "Greetings! I'm Forge, your AI companion. Need a hint on this question?" : "Greetings! I'm Forge, your AI companion. How can I help you conquer PhilNITS?" }
      ]);
    }
  }, [context]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user' as const, text: userMessage }];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api/ai';

      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          messages: newMessages,
          context: context ? {
            questionText: context.text || context.question_text,
            options: context.options,
          } : undefined
        })
      });

      if (!response.ok) throw new Error("Failed to connect to Forge.");
      
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let modelText = "";

      if (reader) {
        setMessages(prev => [...prev, { role: 'model', text: '' }]);
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          modelText += chunk;
          
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1].text = modelText;
            return updated;
          });
        }
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, my connection was interrupted. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 w-full max-w-sm h-full bg-surface/95 backdrop-blur-xl border-l border-primary/30 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-borderline/50">
              <div className="flex items-center gap-2">
                <Bot className="w-6 h-6 text-primary" />
                <h2 className="font-orbitron font-bold text-text-main">Forge Companion</h2>
              </div>
              <button onClick={onClose} className="p-2 text-text-muted hover:text-text-main transition-colors rounded-lg hover:bg-surface-2">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-primary/20 text-primary' : 'bg-surface-2 text-accent'}`}>
                    {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`px-4 py-2 rounded-2xl max-w-[75%] text-sm whitespace-pre-wrap ${m.role === 'user' ? 'bg-primary/20 text-primary-light rounded-tr-sm' : 'bg-surface-2 text-text-main rounded-tl-sm'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-2 text-accent flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-surface-2 rounded-tl-sm flex items-center">
                    <Loader2 className="w-4 h-4 animate-spin text-accent" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-borderline/50 bg-surface">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask for a hint..."
                  className="w-full bg-surface-2 border border-borderline rounded-full px-4 py-3 pr-12 text-sm text-text-main focus:outline-none focus:border-primary/50"
                  disabled={isTyping}
                />
                <button
                  onClick={handleSend}
                  disabled={isTyping || !input.trim()}
                  className="absolute right-2 p-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
