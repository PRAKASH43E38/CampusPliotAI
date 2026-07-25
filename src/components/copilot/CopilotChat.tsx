import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, Bot, User, Compass, Zap, HelpCircle, ArrowUpRight } from 'lucide-react';
import { AIMessage, AICardData } from '../../types';
import { AICardRenderer } from './AICardRenderer';
import { FirstDayPlanner } from './FirstDayPlanner';
import { ClubMatcher } from './ClubMatcher';
import { SmartQA } from './SmartQA';
import { timetableSlots, campusBuildings, facultyMembers, campusEvents, samplePrompts } from '../../data/mockData';

export const CopilotChat: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'planner' | 'matcher' | 'qa'>('chat');
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'msg_1',
      sender: 'ai',
      text: "Hello Alex! I'm CampusPilot AI — your autonomous digital campus copilot. I can guide you to your next lecture hall, generate your first-day itinerary, match you with tech clubs, or explain campus administrative procedures.",
      timestamp: 'Just now',
      suggestedActions: [
        'Where is my next class right now?',
        'Plan my first day on campus with map and faculty list',
        'Find me technical clubs & hackathons',
        'How do I book a private library study pod?'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
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

    setTimeout(() => {
      let aiText = '';
      let cards: AICardData[] = [];
      const lower = text.toLowerCase();

      if (lower.includes('class') || lower.includes('next') || lower.includes('schedule') || lower.includes('timetable')) {
        const nextSlot = timetableSlots[0];
        aiText = `Your next lecture is **${nextSlot.subjectName} (${nextSlot.subjectCode})** at **${nextSlot.time}** in **${nextSlot.building} (${nextSlot.room})**. Here is your interactive class card:`;
        cards = [{ type: 'timetable', data: nextSlot }];
      } else if (lower.includes('map') || lower.includes('where is') || lower.includes('location') || lower.includes('building') || lower.includes('turing')) {
        const bldg = campusBuildings[0];
        aiText = `The **${bldg.name} (${bldg.code})** is located in the central academic zone. It houses smart lecture halls and AI research labs:`;
        cards = [{ type: 'map', data: bldg }];
      } else if (lower.includes('faculty') || lower.includes('professor') || lower.includes('sharma') || lower.includes('hod')) {
        const fac = facultyMembers[0];
        aiText = `Here are the details for **${fac.name}**, Head of Computer Science Department:`;
        cards = [{ type: 'faculty', data: fac }];
      } else if (lower.includes('first day') || lower.includes('plan') || lower.includes('itinerary')) {
        aiText = `I have generated your customized first-day itinerary for CSE 3rd Year! Check out your schedule below:`;
        cards = [
          {
            type: 'first_day_plan',
            data: {
              department: 'Computer Science',
              year: '3rd Year',
              schedule: [
                { time: '09:00 AM', task: 'AI & Neural Networks Lecture', location: 'AB-1 Hall 302' },
                { time: '11:30 AM', task: 'DBMS Research Lab Session', location: 'Tech Center Lab 204' },
                { time: '02:00 PM', task: 'ACM Student Chapter Meeting', location: 'Innovation Hub Lounge' }
              ]
            }
          }
        ];
      } else if (lower.includes('club') || lower.includes('hackathon') || lower.includes('event')) {
        const evt = campusEvents[0];
        aiText = `Great news! **${evt.title}** registration is live. Plus, here is your top matched student club:`;
        cards = [
          { type: 'event', data: evt },
          {
            type: 'club_recommendation',
            data: {
              name: 'ACM Student Chapter & AI Collective',
              matchPercentage: 98,
              membersCount: 450,
              description: 'Top technical community hosting HackCampus 2026 and agentic AI workshops.'
            }
          }
        ];
      } else {
        aiText = `I searched our campus database for "${text}". Here is the relevant academic and location overview:`;
        cards = [
          { type: 'map', data: campusBuildings[2] },
          { type: 'faculty', data: facultyMembers[1] }
        ];
      }

      const aiMsg: AIMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        cards: cards
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Top Header Banner */}
      <div className="p-6 rounded-3xl bg-emerald-950 border border-emerald-800 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
              CampusPilot AI Copilot
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                GPT-4o & Antigravity Powered
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200 mt-0.5 font-medium">
              Natural language intelligence for maps, timetables, clubs, and official procedures.
            </p>
          </div>
        </div>

        {/* Feature Tabs */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'chat'
                ? 'bg-emerald-600 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> AI Chat
          </button>
          <button
            onClick={() => setActiveTab('planner')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'planner'
                ? 'bg-emerald-600 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" /> First Day Planner
          </button>
          <button
            onClick={() => setActiveTab('matcher')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'matcher'
                ? 'bg-emerald-600 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" /> Club Matcher
          </button>
          <button
            onClick={() => setActiveTab('qa')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'qa'
                ? 'bg-emerald-600 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
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
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col h-[640px]">
          
          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-2xl ${msg.sender === 'user' ? 'order-1' : 'order-2'}`}>
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-emerald-600 text-white font-medium rounded-tr-none'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/80 rounded-tl-none font-medium'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    
                    {/* Render Structured AI Cards */}
                    {msg.cards && <AICardRenderer cards={msg.cards} />}
                  </div>

                  <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400 px-1 font-medium">
                    <span>{msg.timestamp}</span>
                    {msg.sender === 'ai' && (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                        <Sparkles className="w-3 h-3" /> Campus AI Synthesized
                      </span>
                    )}
                  </div>

                  {msg.suggestedActions && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {msg.suggestedActions.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(action)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20 flex items-center gap-1 transition-all"
                        >
                          {action} <ArrowUpRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-emerald-400" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 flex items-center gap-2 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-emerald-600 dark:text-emerald-400 ml-1">Analyzing campus database...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-500" /> Quick Prompts:
            </span>
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p)}
                className="px-3 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:border-emerald-500 shrink-0 transition-all"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
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
                placeholder="Ask CampusPilot AI (e.g. 'Where is my next class?' or 'Show me notes')..."
                className="flex-1 pl-4 pr-12 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="absolute right-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm disabled:opacity-50 transition-all flex items-center gap-1"
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
