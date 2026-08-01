import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, Bot, User, Compass, Zap, HelpCircle, ArrowUpRight, Cpu } from 'lucide-react';
import { AIMessage, AICardData } from '../../types';
import { AICardRenderer } from './AICardRenderer';
import { FirstDayPlanner } from './FirstDayPlanner';
import { ClubMatcher } from './ClubMatcher';
import { SmartQA } from './SmartQA';
import { timetableSlots, facultyScheduleSlots, samplePrompts } from '../../data/staticData';
import apiService from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';

export const CopilotChat: React.FC = () => {
  const { user, role } = useAuth();
  const [activeTab, setActiveTab] = useState<'chat' | 'planner' | 'matcher' | 'qa'>('chat');
  const [selectedModel, setSelectedModel] = useState<'gemini' | 'glm'>('gemini');
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const list = await apiService.listConversations();
      setConversations(list);
      if (list.length > 0 && !activeConversation) {
        setActiveConversation(list[0].conversation_id);
        loadMessages(list[0].conversation_id);
      } else if (list.length === 0) {
        startNewChat();
      }
    } catch (err) {
      console.error("Error loading conversations:", err);
    }
  };

  const loadMessages = async (convId: string) => {
    try {
      const msgs = await apiService.getConversationMessages(convId);
      const formattedMsgs = msgs.map((m: any) => ({
        id: m.message_id,
        sender: m.sender,
        text: m.content,
        timestamp: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
      setMessages(formattedMsgs.length > 0 ? formattedMsgs : [getInitialMessage()]);
    } catch (err) {
      console.error("Error loading messages:", err);
      setMessages([getInitialMessage()]);
    }
  };

  const startNewChat = async () => {
    try {
      const { conversation_id } = await apiService.createConversation();
      setActiveConversation(conversation_id);
      setMessages([getInitialMessage()]);
      const list = await apiService.listConversations();
      setConversations(list);
    } catch (err) {
      console.error("Error starting new chat:", err);
    }
  };

  const deleteChat = async (convId: string) => {
    try {
      await apiService.deleteConversation(convId);
      setConversations(prev => prev.filter(c => c.conversation_id !== convId));
      if (activeConversation === convId) {
        startNewChat();
      }
    } catch (err) {
      console.error("Error deleting chat:", err);
    }
  };


  useEffect(() => {
    loadConversations();
  }, []);

  const getInitialMessage = (): AIMessage => {
    if (role === 'faculty') {
      return {
        id: 'msg_1',
        sender: 'ai',
        text: `Welcome ${user?.name || 'Faculty Member'}! I am your dedicated Faculty AI Assistant. Ask me about your teaching timetable, today's schedule, handled subjects, or next classroom assignments.`,
        timestamp: 'Just now',
        suggestedActions: [
          "Which classes do I have today?",
          "What is my timetable?",
          "Which hour is DSA today?",
          "Which classroom should I teach next?",
          "What subjects am I handling?",
          "Show today's schedule."
        ]
      };
    } else if (role === 'admin') {
      return {
        id: 'msg_1',
        sender: 'ai',
        text: `Greetings ${user?.name || 'Administrator'}! I am CampusPilot Admin AI. I can assist with platform data management, student database queries, faculty rosters, resource hub auditing, and system broadcasts.`,
        timestamp: 'Just now',
        suggestedActions: [
          "Summarize total student database statistics",
          "Show department-wise student intake",
          "List active announcements and emergency broadcasts",
          "Auditing uploaded academic resources count"
        ]
      };
    } else {
      return {
        id: 'msg_1',
        sender: 'ai',
        text: "Hello! I'm CampusPilot AI for Students. Ask me about campus navigation, timetables, course notes, events, or digital library!",
        timestamp: 'Just now',
        suggestedActions: [
          "Where is my next class right now?",
          "Show upcoming campus placement drives",
          "Where is the CSE department block?",
          "Find PYQs for Data Structures"
        ]
      };
    }
  };

  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation);
    }
  }, [activeConversation]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMsg: AIMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    try {
      const lower = text.toLowerCase();
      let responseText = '';
      let cards: AICardData[] = [];

      const result = await apiService.sendCopilotMessage(text, selectedModel, role, activeConversation || undefined);
      responseText = result.response || "Here is the information from CampusPilot AI.";

      if (cards.length === 0) {
        if (lower.includes('class') || lower.includes('next') || lower.includes('schedule') || lower.includes('timetable')) {
          cards = [{ type: 'timetable', data: timetableSlots[0] }];
        } else if (lower.includes('map') || lower.includes('where is') || lower.includes('location') || lower.includes('building')) {
          try {
            const buildings = await apiService.getCampusBuildings();
            if (buildings && buildings.length > 0) {
              const b = buildings[0];
              cards = [{
                type: 'map',
                data: {
                  id: `bldg_${b.building_id}`,
                  name: b.building_name,
                  code: `BLDG-${b.building_id}`,
                  category: b.building_type.toLowerCase() as any,
                  description: b.description || 'Campus building',
                  floors: 3,
                  image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800',
                  coordinates: { x: 50, y: 50 },
                  departments: [b.location || 'All Departments'],
                  facilities: ['WiFi Enabled'],
                  openingHours: '08:30 AM - 05:30 PM',
                  status: 'Open'
                }
              }];
            }
          } catch (err) {
            console.error(err);
          }
        }
      }

      const aiMsg: AIMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        cards: cards.length > 0 ? cards : undefined
      };

      setMessages((prev) => [...prev, aiMsg]);
      
      // Refresh conversation list to update titles
      loadConversations();
    } catch (err: any) {
      console.error("Chat error:", err);
      const errorMsg: AIMessage = {
        id: `ai_err_${Date.now()}`,
        sender: 'ai',
        text: `⚠️ Unable to process query: ${err?.message || 'Server connection timeout. Please try again.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };


  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Top Header Banner */}
      <div className="p-6 rounded-2xl bg-[#F8FAF8] dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] text-[#1F2937] dark:text-[#F8FAFC] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#2E7D32] dark:bg-[#4CAF50] flex items-center justify-center text-white shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#1F2937] dark:text-[#F8FAFC] flex flex-wrap items-center gap-2">
              CampusPilot AI
              <div className="flex items-center gap-1 p-0.5 rounded-xl bg-[#F4F8F4] dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] text-xs font-semibold">
                <button
                  onClick={() => setSelectedModel('gemini')}
                  className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer border-none ${
                    selectedModel === 'gemini' ? 'bg-[#2E7D32] dark:bg-[#4CAF50] text-white font-bold' : 'text-[#6B7280] dark:text-[#CBD5E1] hover:text-[#1F2937] dark:hover:text-white'
                  }`}
                >
                  <Cpu className="w-3 h-3" />
                  Gemini 1.5
                </button>
                <button
                  onClick={() => setSelectedModel('glm')}
                  className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer border-none ${
                    selectedModel === 'glm' ? 'bg-[#2E7D32] dark:bg-[#4CAF50] text-white font-bold' : 'text-[#6B7280] dark:text-[#CBD5E1] hover:text-[#1F2937] dark:hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  GLM 4.7
                </button>
              </div>
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280] dark:text-[#CBD5E1] mt-0.5 font-medium">
              Official intelligent university assistant. Ask about courses, faculty, events, timetables, or campus directions.
            </p>
          </div>
        </div>

        {/* Feature Tabs */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-[#F4F8F4] dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer border-none ${
              activeTab === 'chat'
                ? 'bg-[#2E7D32] dark:bg-[#4CAF50] text-white font-bold'
                : 'text-[#6B7280] dark:text-[#CBD5E1] hover:text-[#1F2937] dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> AI Chat
          </button>
          <button
            onClick={() => setActiveTab('planner')}
            className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer border-none ${
              activeTab === 'planner'
                ? 'bg-[#2E7D32] dark:bg-[#4CAF50] text-white font-bold'
                : 'text-[#6B7280] dark:text-[#CBD5E1] hover:text-[#1F2937] dark:hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" /> First Day Planner
          </button>
          <button
            onClick={() => setActiveTab('matcher')}
            className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer border-none ${
              activeTab === 'matcher'
                ? 'bg-[#2E7D32] dark:bg-[#4CAF50] text-white font-bold'
                : 'text-[#6B7280] dark:text-[#CBD5E1] hover:text-[#1F2937] dark:hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" /> Club Matcher
          </button>
          <button
            onClick={() => setActiveTab('qa')}
            className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer border-none ${
              activeTab === 'qa'
                ? 'bg-[#2E7D32] dark:bg-[#4CAF50] text-white font-bold'
                : 'text-[#6B7280] dark:text-[#CBD5E1] hover:text-[#1F2937] dark:hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" /> Smart Q&A
          </button>
        </div>
      </div>

      {/* Main Feature View */}
      {activeTab === 'planner' && <FirstDayPlanner />}
      {activeTab === 'matcher' && <ClubMatcher />}
      {activeTab === 'qa' && <SmartQA />}

      {activeTab === 'chat' && (
        <div className="rounded-2xl bg-white dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] shadow-sm overflow-hidden flex flex-col h-[640px]">
          
      {/* Messages List */}
           <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
             {messages.map((msg) => (
               <div
                 key={msg.id}
                 className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
               >
                 {msg.sender === 'ai' && (
                   <div className="w-8 h-8 rounded-xl bg-[#2E7D32] dark:bg-[#4CAF50] flex items-center justify-center text-white shrink-0">
                     <Bot className="w-4 h-4" />
                   </div>
                 )}
 
                 <div className={`max-w-2xl ${msg.sender === 'user' ? 'order-1' : 'order-2'}`}>
                   <div
                     className={`p-4 rounded-xl text-xs sm:text-sm leading-relaxed ${
                       msg.sender === 'user'
                         ? 'bg-[#2E7D32] dark:bg-[#4CAF50] text-white font-medium'
                         : 'bg-[#F4F8F4] dark:bg-[#162033] text-[#1F2937] dark:text-[#F8FAFC] border border-[#DDE5DD] dark:border-[#334155] font-medium'
                     }`}
                   >
                     <p className="whitespace-pre-line">{msg.text}</p>
                     
                     {/* Render Structured AI Cards */}
                     {msg.cards && <AICardRenderer cards={msg.cards} />}
                   </div>
 
                   <div className="mt-1 flex items-center justify-between text-[10px] text-[#6B7280] dark:text-[#CBD5E1] px-1 font-medium">
                     <span>{msg.timestamp}</span>
                     {msg.sender === 'ai' && (
                       <span className="flex items-center gap-1 text-[#2E7D32] dark:text-[#4CAF50] font-bold">
                         <Sparkles className="w-3 h-3" /> AI Response
                       </span>
                     )}
                   </div>
 
                   {msg.suggestedActions && (
                     <div className="mt-3 flex flex-wrap gap-2">
                       {msg.suggestedActions.map((action, idx) => (
                         <button
                           key={idx}
                           onClick={() => handleSendMessage(action)}
                           className="px-3 py-1.5 rounded-xl bg-[#E8F5E9] dark:bg-[#162033] hover:bg-[#2E7D32] hover:text-white dark:hover:bg-[#4CAF50] text-[#2E7D32] dark:text-[#81C784] text-xs font-semibold border border-[#DDE5DD] dark:border-[#334155] flex items-center gap-1 transition-colors cursor-pointer"
                         >
                           {action} <ArrowUpRight className="w-3 h-3" />
                         </button>
                       ))}
                     </div>
                   )}
                 </div>
 
                 {msg.sender === 'user' && (
                   <div className="w-8 h-8 rounded-xl bg-[#1F2937] dark:bg-[#273449] text-white flex items-center justify-center shrink-0">
                     <User className="w-4 h-4 text-white" />
                   </div>
                 )}
               </div>
             ))}
 
             {isTyping && (
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-xl bg-[#2E7D32] dark:bg-[#4CAF50] flex items-center justify-center text-white shrink-0">
                   <Bot className="w-4 h-4" />
                 </div>
                 <div className="p-3 rounded-xl bg-[#F4F8F4] dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] text-xs text-[#6B7280] dark:text-[#CBD5E1] flex items-center gap-2 font-semibold">
                   <span className="w-2 h-2 rounded-full bg-[#2E7D32] dark:bg-[#4CAF50]" />
                   <span>Thinking...</span>
                 </div>
               </div>
             )}
             <div ref={chatEndRef} />
           </div>


          {/* Quick Prompts Bar */}
          <div className="px-4 py-2 border-t border-[#E5E7EB] dark:border-[#475569] bg-[#F8FAF8] dark:bg-[#162033] flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] font-bold text-[#6B7280] dark:text-[#CBD5E1] uppercase shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#2E7D32] dark:text-[#4CAF50]" /> Suggested:
            </span>
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p)}
                className="px-3 py-1 rounded-xl bg-white dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] text-[11px] font-medium text-[#1F2937] dark:text-[#F8FAFC] hover:border-[#2E7D32] dark:hover:border-[#4CAF50] shrink-0 transition-colors cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-4 border-t border-[#DDE5DD] dark:border-[#334155] bg-white dark:bg-[#1E293B]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2 relative"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask CampusPilot AI (e.g. 'Where is my next class?' or 'Show faculty directory')..."
                className="flex-1 pl-4 pr-24 py-3 bg-[#F4F8F4] dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] rounded-xl text-xs sm:text-sm text-[#1F2937] dark:text-[#F8FAFC] placeholder-[#6B7280] focus:outline-none focus:border-[#2E7D32] dark:focus:border-[#4CAF50]"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="absolute right-2 px-4 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] dark:bg-[#4CAF50] dark:hover:bg-[#43A047] text-white font-bold text-xs disabled:opacity-50 transition-colors flex items-center gap-1 border-none cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Send
              </button>
            </form>
          </div>

        </div>
      )}
    </div>
  );
};
