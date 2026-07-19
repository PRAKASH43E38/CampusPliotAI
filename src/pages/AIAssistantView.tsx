/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, Mic, Image, User, Bot, RefreshCw, Plus, Check } from 'lucide-react';
import { getAISmartResponse } from '../data/mockData';
import { ChatMessage } from '../types';

interface AIAssistantViewProps {
  isDark?: boolean;
}

export default function AIAssistantView({ isDark = false }: AIAssistantViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: `### **Welcome to CampusPilot AI Assistant! 🏛️**\n\nHello Devashish! I am your intelligent university assistant. I am pre-configured with complete, real-time campus data, building directories, syllabus files, and administrative guidelines.\n\n**Here are a few quick topics you can ask me about:**\n\n*   *"Where is Block A administrative center?"*\n*   *"Show my academic schedule for today."*\n*   *"What is on the hostel mess menu today?"*\n*   *"Find upcoming core CSE placement drives."*`,
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setAttachedImage(null);
    setIsTyping(true);

    fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Student-Id': 'st-0982'
      },
      body: JSON.stringify({ message: textToSend })
    })
    .then(res => {
      if (!res.ok) throw new Error("AI engine unavailable");
      return res.json();
    })
    .then(data => {
      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    })
    .catch(err => {
      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: "⚠️ **System Offline:** The institutional AI assistant is temporarily unreachable. Please check your backend server logs.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    });
  };

  const handleChipClick = (query: string) => {
    handleSend(query);
  };

  const triggerVoiceSimulation = () => {
    if (isRecording) return;
    setIsRecording(true);
    setInput('Listening to speech query...');
    
    setTimeout(() => {
      setInput('Where is Block A administrative wing?');
      setIsRecording(false);
    }, 1800);
  };

  const triggerImageUploadMock = () => {
    // Mock upload of a syllabus snapshot or campus flyer
    setAttachedImage('https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=300');
    setInput('Summarize the exam dates from this attached campus circular.');
  };

  const clearChat = () => {
    setMessages([
      {
        id: `wel-${Date.now()}`,
        sender: 'assistant',
        text: 'Session restarted. How can I assist you with academic directories, classroom navigation, or resources today, Devashish?',
        timestamp: 'Just now'
      }
    ]);
  };

  const preBuiltSuggestions = [
    'Where is Block A?',
    'Show my timetable today',
    'Find Machine Learning faculty',
    'What is on the dinner menu?',
    'Adobe placement registration',
    'Download CSE Sem 5 PYQs'
  ];

  return (
    <div className={`h-[calc(100vh-12rem)] flex flex-col border rounded-3xl shadow-sm overflow-hidden font-sans transition-colors duration-300 ${
      isDark ? 'bg-[#0d0e11] border-slate-800' : 'bg-white border-slate-200/80'
    }`}>
      {/* AI Chat Header */}
      <div className={`px-6 py-4 flex items-center justify-between border-b shrink-0 ${
        isDark ? 'bg-[#0d0e11] border-slate-850' : 'bg-slate-900 text-white border-slate-800'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Bot className="w-5 h-5 text-slate-100" />
          </div>
          <div>
            <h2 className={`text-sm font-extrabold tracking-tight ${isDark ? 'text-slate-100' : 'text-white'}`}>Institutional Gemini AI Assistant</h2>
            <p className="text-[10px] text-blue-400 font-mono uppercase tracking-widest font-bold">Grounded on Official University Database</p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className={`text-xs font-semibold py-1.5 px-3 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
            isDark 
              ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-100 border border-slate-700' 
              : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
          }`}
          id="ai-clear-session"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Clear Chat
        </button>
      </div>

      {/* Messages Scrolling Container */}
      <div className={`flex-1 overflow-y-auto p-6 space-y-6 transition-colors duration-300 ${
        isDark ? 'bg-[#090a0c]' : 'bg-slate-50/50'
      }`}>
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs shrink-0 shadow-sm border ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-900 text-white border-slate-800'
                }`}>
                  <Bot className="w-4 h-4 text-blue-400" />
                </div>
              )}

              <div className={`max-w-[85%] space-y-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`p-4 rounded-2xl border text-sm font-medium leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 border-blue-500 text-white rounded-br-none'
                    : isDark 
                      ? 'bg-[#121318] border-slate-800 text-slate-100 rounded-bl-none' 
                      : 'bg-white border-slate-200 text-slate-800 rounded-bl-none'
                }`}>
                  {/* Basic markdown parsing simulator */}
                  <div className="space-y-2">
                    {msg.text.split('\n\n').map((para, pIdx) => {
                      if (para.startsWith('###')) {
                        return <h3 key={pIdx} className={`text-sm font-bold mt-2 mb-1 ${isDark ? 'text-blue-400' : 'text-slate-950'}`}>{para.replace(/###\s*/g, '')}</h3>;
                      }
                      if (para.startsWith('*')) {
                        return (
                          <ul key={pIdx} className="list-disc pl-5 space-y-1 mt-1 text-xs">
                            {para.split('\n').map((li, lIdx) => (
                              <li key={lIdx} className={isDark ? 'text-slate-300 font-medium' : 'text-slate-600 font-medium'}>
                                {li.replace(/^\*\s*/g, '').replace(/\*\*([^*]+)\*\*/g, '$1')}
                              </li>
                            ))}
                          </ul>
                        );
                      }
                      // Replace bold markup **text** -> bold elements
                      const formattedText = para.split(/\*\*([^*]+)\*\*/).map((part, i) => {
                        if (i % 2 === 1) {
                          return <strong key={i} className={`font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-950'}`}>{part}</strong>;
                        }
                        return part;
                      });
                      return <p key={pIdx} className="text-xs sm:text-sm">{formattedText}</p>;
                    })}
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 font-medium block px-1">{msg.timestamp}</span>
              </div>

              {msg.sender === 'user' && (
                <div className="w-9 h-9 rounded-xl bg-blue-100/10 text-blue-400 flex items-center justify-center text-xs font-bold shrink-0 border border-blue-900/30">
                  <User className="w-4 h-4" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <div className="flex gap-4 justify-start">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs shrink-0 shadow-sm border ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-900 text-white border-slate-800'
            }`}>
              <Bot className="w-4 h-4 text-blue-400" />
            </div>
            <div className="space-y-1">
              <div className={`border p-4 rounded-2xl rounded-bl-none flex items-center gap-1.5 shadow-sm ${
                isDark ? 'bg-[#121318] border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips Panel */}
      <div className={`px-6 py-2 border-t overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2 shrink-0 ${
        isDark ? 'bg-[#0d0e11] border-slate-850' : 'bg-slate-50 border-slate-200'
      }`}>
        {preBuiltSuggestions.map((q) => (
          <button
            key={q}
            onClick={() => handleChipClick(q)}
            className={`inline-block text-xs font-semibold py-1.5 px-3.5 rounded-full transition-all shrink-0 shadow-sm cursor-pointer ${
              isDark 
                ? 'bg-[#121318] hover:bg-blue-950/20 border-slate-800 hover:border-blue-900 text-slate-300 hover:text-blue-400' 
                : 'bg-white hover:bg-blue-50 border-slate-200 hover:border-blue-200 text-slate-700 hover:text-blue-700'
            }`}
            id={`ai-suggestion-chip-${q.replace(/\s+/g, '-').toLowerCase()}`}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Interactive Input Form */}
      <div className={`p-4 border-t shrink-0 space-y-3 ${
        isDark ? 'bg-[#0d0e11] border-slate-850' : 'bg-white border-slate-200'
      }`}>
        {attachedImage && (
          <div className={`relative inline-block border p-1.5 rounded-xl ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <img src={attachedImage} className="w-14 h-14 rounded-lg object-cover" alt="Attached preview" />
            <button
              onClick={() => setAttachedImage(null)}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-[9px] font-bold border border-white"
            >
              ×
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Mock image upload trigger */}
          <button
            onClick={triggerImageUploadMock}
            className={`p-3 rounded-xl border transition-all active:scale-95 shrink-0 cursor-pointer ${
              isDark 
                ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-slate-200' 
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-700'
            }`}
            title="Attach Document Circular"
            id="ai-attach-file-button"
          >
            <Image className="w-5 h-5" />
          </button>

          {/* Prompt field */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder={isRecording ? 'Listening...' : 'Ask about cabins, mess menus, exam schedules...'}
            className={`flex-1 py-3 px-4 border rounded-xl text-sm transition-all outline-none font-medium ${
              isDark 
                ? 'bg-slate-900/40 border-slate-800 focus:border-blue-500 focus:bg-[#121318] text-slate-100 placeholder-slate-550' 
                : 'bg-slate-50/50 border-slate-200 focus:border-blue-500 focus:bg-white text-slate-800 placeholder-slate-400'
            }`}
            disabled={isRecording}
          />

          {/* Simulated Mic button */}
          <button
            onClick={triggerVoiceSimulation}
            className={`p-3 rounded-xl border transition-all active:scale-95 shrink-0 cursor-pointer ${
              isRecording 
                ? 'bg-red-500/10 border-red-500/30 text-red-400 animate-pulse' 
                : isDark 
                  ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-slate-200' 
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-700'
            }`}
            title="Voice input simulation"
            id="ai-speech-rec-button"
          >
            <Mic className="w-5 h-5" />
          </button>

          {/* Send Action */}
          <button
            onClick={() => handleSend(input)}
            className="p-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 active:scale-95 shrink-0 cursor-pointer"
            id="ai-send-message-button"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
