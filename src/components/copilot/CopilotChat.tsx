import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Bot,
  ChevronRight,
  Clock3,
  Copy,
  Cpu,
  Edit3,
  MessageSquareText,
  Pin,
  PinOff,
  Plus,
  RotateCcw,
  Search,
  Send,
  Sparkles,
  Square,
  Trash2,
  User,
  Zap,
} from 'lucide-react';
import { AIMessage, Conversation } from '../../types';
import { AICardRenderer } from './AICardRenderer';
import { FirstDayPlanner } from './FirstDayPlanner';
import { ClubMatcher } from './ClubMatcher';
import { SmartQA } from './SmartQA';
import { samplePrompts } from '../../data/staticData';
import apiService from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import { MarkdownContent } from './MarkdownContent';

type ChatProvider = 'auto' | 'grok' | 'gemini' | 'glm';
type FeatureTab = 'chat' | 'planner' | 'matcher' | 'qa';

function formatConversationDate(timestamp?: string) {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function timeGroupLabel(timestamp?: string) {
  if (!timestamp) return 'Earlier';
  const date = new Date(timestamp);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.floor((startOfToday.getTime() - startOfDay.getTime()) / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays <= 7) return 'Last 7 Days';
  return 'Earlier';
}

function formatClock(timestamp?: string) {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export const CopilotChat: React.FC = () => {
  const { user, role } = useAuth();
  const [activeTab, setActiveTab] = useState<FeatureTab>('chat');
  const [providerMode, setProviderMode] = useState<ChatProvider>(() => {
    const stored = localStorage.getItem('cp_aiModel') as ChatProvider | null;
    return stored || 'auto';
  });
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [statusNote, setStatusNote] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const activeConversationRef = useRef<string | null>(null);

  useEffect(() => {
    localStorage.setItem('cp_aiModel', providerMode);
  }, [providerMode]);

  useEffect(() => {
    activeConversationRef.current = activeConversation;
  }, [activeConversation]);

  useEffect(() => {
    if (activeConversation) {
      void loadMessages(activeConversation);
    }
  }, [activeConversation]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  const filteredConversations = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return conversations;
    return conversations.filter((conversation) => {
      const title = conversation.title?.toLowerCase() || '';
      const preview = conversation.last_message_preview?.toLowerCase() || '';
      return title.includes(term) || preview.includes(term);
    });
  }, [conversations, searchTerm]);

  const groupedConversations = useMemo(() => {
    const groups = new Map<string, Conversation[]>();
    filteredConversations.forEach((conversation) => {
      const key = timeGroupLabel(conversation.last_message_at || conversation.updated_at || conversation.created_at);
      const current = groups.get(key) || [];
      current.push(conversation);
      groups.set(key, current);
    });

    return ['Today', 'Yesterday', 'Last 7 Days', 'Earlier']
      .map((label) => ({
        label,
        items: (groups.get(label) || []).sort((a, b) => {
          if (a.is_pinned !== b.is_pinned) return Number(b.is_pinned) - Number(a.is_pinned);
          const left = new Date(a.last_message_at || a.updated_at || a.created_at).getTime();
          const right = new Date(b.last_message_at || b.updated_at || b.created_at).getTime();
          return right - left;
        }),
      }))
      .filter((group) => group.items.length > 0);
  }, [filteredConversations]);

  const refreshConversationList = useCallback(async (preferredId?: string) => {
    try {
      const list = await apiService.listConversations(searchTerm);
      setConversations(list);
      if (preferredId) {
        const selected = list.find((item) => item.conversation_id === preferredId);
        if (selected) setActiveConversation(selected.conversation_id);
      }
      return list;
    } catch (err) {
      console.error('Error refreshing conversations:', err);
      return [];
    }
  }, [searchTerm]);

  const createNewChat = useCallback(async (silent = false) => {
    try {
      const { conversation_id } = await apiService.createConversation();
      activeConversationRef.current = conversation_id;
      setActiveConversation(conversation_id);
      setMessages([]);
      if (!silent) {
        setStatusNote('New conversation created.');
      }
      await refreshConversationList(conversation_id);
    } catch (err) {
      console.error('Error starting new chat:', err);
      setStatusNote('Unable to create a new conversation.');
    }
  }, [refreshConversationList]);

  const bootstrapConversations = useCallback(async () => {
    setLoadingConversations(true);
    try {
      const list = await apiService.listConversations();
      setConversations(list);

      if (list.length > 0) {
        const desiredId = activeConversationRef.current;
        const selected = (desiredId && list.find((item) => item.conversation_id === desiredId)) || list[0];
        setActiveConversation(selected.conversation_id);
      } else {
        await createNewChat(true);
      }
    } catch (err) {
      console.error('Error loading conversations:', err);
      setStatusNote('Unable to load saved conversations.');
    } finally {
      setLoadingConversations(false);
    }
  }, [createNewChat]);

  useEffect(() => {
    if (!user) return;
    void bootstrapConversations();
  }, [bootstrapConversations, user, role]);

  const loadMessages = async (convId: string) => {
    setLoadingMessages(true);
    try {
      const msgs = await apiService.getConversationMessages(convId);
      const formattedMsgs: AIMessage[] = msgs.map((msg: any) => ({
        id: msg.message_id,
        sender: msg.sender,
        text: msg.content,
        timestamp: formatClock(msg.timestamp),
        modelUsed: msg.model_used,
        status: 'sent',
      }));
      setMessages(formattedMsgs);
      setStatusNote(null);
    } catch (err) {
      console.error('Error loading messages:', err);
      setMessages([]);
      setStatusNote('Unable to load conversation history.');
    } finally {
      setLoadingMessages(false);
    }
  };

  const openConversation = async (convId: string) => {
    setActiveConversation(convId);
    await loadMessages(convId);
  };

  const deleteConversation = async (convId: string) => {
    const confirmed = window.confirm('Delete this conversation? This cannot be undone.');
    if (!confirmed) return;

    try {
      await apiService.deleteConversation(convId);
      const remaining = conversations.filter((conversation) => conversation.conversation_id !== convId);
      setConversations(remaining);

      if (activeConversationRef.current === convId) {
        if (remaining.length > 0) {
          setActiveConversation(remaining[0].conversation_id);
        } else {
          await createNewChat(true);
        }
      }
    } catch (err) {
      console.error('Error deleting chat:', err);
      setStatusNote('Unable to delete this conversation.');
    }
  };

  const renameConversation = async (convId: string) => {
    const current = conversations.find((conversation) => conversation.conversation_id === convId);
    const nextTitle = window.prompt('Rename conversation', current?.title || 'New Chat');
    if (nextTitle === null) return;

    try {
      await apiService.updateConversation(convId, { title: nextTitle.trim() || 'New Chat' });
      await refreshConversationList(convId);
    } catch (err) {
      console.error('Error renaming conversation:', err);
      setStatusNote('Unable to rename conversation.');
    }
  };

  const togglePinConversation = async (convId: string, isPinned: boolean) => {
    try {
      await apiService.updateConversation(convId, { is_pinned: !isPinned });
      await refreshConversationList(convId);
    } catch (err) {
      console.error('Error pinning conversation:', err);
      setStatusNote('Unable to update pin state.');
    }
  };

  const copyMessage = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setStatusNote('Response copied to clipboard.');
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  };

  const stopGeneration = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsGenerating(false);
    setStatusNote('Generation stopped.');
  };

  const sendPrompt = async (promptText: string) => {
    const trimmed = promptText.trim();
    if (!trimmed || isGenerating) return;

    setStatusNote(null);
    let conversationId = activeConversationRef.current;
    if (!conversationId) {
      const created = await apiService.createConversation();
      conversationId = created.conversation_id;
      setActiveConversation(conversationId);
      await refreshConversationList(conversationId);
    }

    const userMessage: AIMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: formatClock(new Date().toISOString()),
      status: 'sent',
    };

    const assistantId = `ai_${Date.now()}`;
    const assistantPlaceholder: AIMessage = {
      id: assistantId,
      sender: 'ai',
      text: 'Thinking...',
      timestamp: formatClock(new Date().toISOString()),
      status: 'sending',
    };

    setMessages((prev) => [...prev, userMessage, assistantPlaceholder]);
    if (!promptText) setInputValue('');
    setIsGenerating(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const result = await apiService.sendCopilotMessage(trimmed, providerMode, role, conversationId, controller.signal);
      const responseText = (result.response || '').trim() || 'No response returned.';

      setMessages((prev) =>
        prev.map((message) =>
          message.id === assistantId
            ? {
                ...message,
                text: responseText,
                status: 'sent',
                modelUsed: result.model_used,
              }
            : message
        )
      );

      await refreshConversationList(conversationId);
    } catch (err: any) {
      const isCanceled = err?.name === 'CanceledError' || err?.code === 'ERR_CANCELED';
      if (isCanceled) {
        setMessages((prev) =>
          prev.map((message) =>
            message.id === assistantId
              ? {
                  ...message,
                  text: 'Generation stopped.',
                  status: 'stopped',
                }
              : message
          )
        );
        return;
      }

      const backendMessage =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        'Unable to reach the AI provider.';

      setMessages((prev) =>
        prev.map((message) =>
          message.id === assistantId
            ? {
                ...message,
                text: `AI request failed: ${backendMessage}`,
                status: 'error',
              }
            : message
        )
      );
      setStatusNote('AI provider request failed. Check backend logs for provider errors.');
    } finally {
      abortRef.current = null;
      setIsGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    const lastUser = [...messages].reverse().find((message) => message.sender === 'user');
    if (!lastUser) return;
    await sendPrompt(lastUser.text);
  };

  const handleContinue = async () => {
    const lastAssistant = [...messages].reverse().find((message) => message.sender === 'ai' && message.status === 'sent');
    if (!lastAssistant) return;
    await sendPrompt('Continue the previous answer from where it stopped. Do not repeat earlier content.');
  };

  const getInitialMessage = (): AIMessage => {
    if (role === 'faculty') {
      return {
        id: 'msg_seed',
        sender: 'ai',
        text: `Welcome ${user?.name || 'Faculty Member'}. Ask me about your timetable, classes today, or subject assignments.`,
        timestamp: formatClock(new Date().toISOString()),
        status: 'sent',
        suggestedActions: [
          'Which classes do I have today?',
          'What is my timetable?',
          'Which hour is DSA today?',
          'Which classroom should I teach next?'
        ]
      };
    }

    if (role === 'admin') {
      return {
        id: 'msg_seed',
        sender: 'ai',
        text: `Welcome ${user?.name || 'Administrator'}. I can help with platform data, student summaries, faculty records, and system broadcasts.`,
        timestamp: formatClock(new Date().toISOString()),
        status: 'sent',
        suggestedActions: [
          'Summarize student database statistics',
          'Show department-wise intake',
          'List active announcements',
          'Audit uploaded resources'
        ]
      };
    }

    return {
      id: 'msg_seed',
      sender: 'ai',
      text: "Hello. I'm CampusPilot AI. Ask me about campus navigation, timetables, course notes, events, or college services.",
      timestamp: formatClock(new Date().toISOString()),
      status: 'sent',
      suggestedActions: [
        'Where is my next class right now?',
        'Show upcoming placement drives',
        'Where is the CSE department block?',
        'Find PYQs for Data Structures'
      ]
    };
  };

  const renderMessage = (message: AIMessage) => {
    const isUser = message.sender === 'user';
    return (
      <div key={message.id} className={`group flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
        {!isUser && (
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center text-white shrink-0 shadow-sm">
            <Bot className="w-4 h-4" />
          </div>
        )}

        <div className={`max-w-3xl ${isUser ? 'order-1' : 'order-2'}`}>
          <div
            className={`relative rounded-2xl px-4 py-3 text-sm leading-7 shadow-sm ${
              isUser
                ? 'bg-slate-900 text-white ml-auto'
                : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {message.status === 'sending' ? (
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Generating response...
              </div>
            ) : (
              <MarkdownContent content={message.text} />
            )}

            {message.cards && <AICardRenderer cards={message.cards} />}

            {!isUser && (
              <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-1">
                  {message.modelUsed || 'AI response'}
                </span>
              </div>
            )}
          </div>

          <div className="mt-1 flex items-center justify-between px-1 text-[11px] text-slate-500 dark:text-slate-400">
            <span>{message.timestamp}</span>
            {!isUser && message.status === 'sent' && (
              <button
                type="button"
                onClick={() => copyMessage(message.text)}
                className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity inline-flex items-center gap-1 hover:text-emerald-600"
              >
                <Copy className="w-3 h-3" />
                Copy
              </button>
            )}
          </div>

          {!isUser && message.suggestedActions && message.suggestedActions.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {message.suggestedActions.map((action) => (
                <button
                  key={action}
                  type="button"
                  onClick={() => void sendPrompt(action)}
                  className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-900 hover:bg-emerald-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  {action}
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              ))}
            </div>
          )}
        </div>

        {isUser && (
          <div className="w-9 h-9 rounded-2xl bg-slate-900 dark:bg-slate-700 text-white flex items-center justify-center shrink-0">
            <User className="w-4 h-4" />
          </div>
        )}
      </div>
    );
  };

  const currentConversation = conversations.find((item) => item.conversation_id === activeConversation);
  const welcomeMessage = getInitialMessage();

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 shadow-sm">
        <div className="p-5 sm:p-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                CampusPilot AI
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                ChatGPT-style campus assistant with persistent memory, multi-chat history, and provider fallback.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200">
              <Cpu className="w-3.5 h-3.5" />
              <span>Provider</span>
              <select
                value={providerMode}
                onChange={(e) => setProviderMode(e.target.value as ChatProvider)}
                className="border-0 bg-transparent p-0 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="auto">Auto</option>
                <option value="grok">Grok first</option>
                <option value="gemini">Gemini first</option>
                <option value="glm">GLM fallback</option>
              </select>
            </label>

            <button
              type="button"
              onClick={() => void createNewChat()}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              <Plus className="w-4 h-4" />
              New Chat
            </button>
          </div>
        </div>

        <div className="px-5 pb-5 sm:px-6 flex flex-wrap gap-2">
          {[
            { key: 'chat', label: 'AI Chat', icon: Sparkles },
            { key: 'planner', label: 'First Day Planner', icon: ChevronRight },
            { key: 'matcher', label: 'Club Matcher', icon: Zap },
            { key: 'qa', label: 'Smart Q&A', icon: MessageSquareText },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as FeatureTab)}
                className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white/80 text-slate-700 border border-slate-200 hover:bg-slate-50 dark:bg-slate-900/80 dark:text-slate-200 dark:border-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === 'planner' && <FirstDayPlanner />}
      {activeTab === 'matcher' && <ClubMatcher />}
      {activeTab === 'qa' && <SmartQA />}

      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-4 min-h-[700px]">
          <aside className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Conversations</h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {conversations.length} stored conversations
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void createNewChat()}
                  className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New
                </button>
              </div>

              <label className="flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2">
                <Search className="w-4 h-4 text-slate-500" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search chats"
                  className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                />
              </label>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loadingConversations ? (
                <div className="p-4 text-sm text-slate-500 dark:text-slate-400">Loading conversations...</div>
              ) : groupedConversations.length === 0 ? (
                <div className="p-4 text-sm text-slate-500 dark:text-slate-400">
                  No conversations match this search.
                </div>
              ) : (
                groupedConversations.map((group) => (
                  <div key={group.label} className="p-3">
                    <div className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {group.label}
                    </div>
                    <div className="space-y-2">
                      {group.items.map((conversation) => {
                        const active = conversation.conversation_id === activeConversation;
                        return (
                          <div
                            key={conversation.conversation_id}
                            className={`group rounded-2xl border px-3 py-3 transition-colors ${
                              active
                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
                                : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => void openConversation(conversation.conversation_id)}
                              className="w-full text-left"
                            >
                              <div className="flex items-start gap-2">
                                <div className="mt-0.5 w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                                  <MessageSquareText className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2">
                                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                                      {conversation.title || 'New Chat'}
                                    </p>
                                    {conversation.is_pinned && <Pin className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                                  </div>
                                  <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                                    {conversation.last_message_preview || 'No messages yet'}
                                  </p>
                                  <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                                    <Clock3 className="w-3 h-3" />
                                    <span>{formatConversationDate(conversation.last_message_at || conversation.updated_at)}</span>
                                    <span>·</span>
                                    <span>{conversation.message_count || 0} messages</span>
                                  </div>
                                </div>
                              </div>
                            </button>

                            <div className="mt-3 flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => void renameConversation(conversation.conversation_id)}
                                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                              >
                                <Edit3 className="w-3 h-3" />
                                Rename
                              </button>
                              <button
                                type="button"
                                onClick={() => void togglePinConversation(conversation.conversation_id, Boolean(conversation.is_pinned))}
                                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                              >
                                {conversation.is_pinned ? <PinOff className="w-3 h-3" /> : <Pin className="w-3 h-3" />}
                                {conversation.is_pinned ? 'Unpin' : 'Pin'}
                              </button>
                              <button
                                type="button"
                                onClick={() => void deleteConversation(conversation.conversation_id)}
                                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                              >
                                <Trash2 className="w-3 h-3" />
                                Delete
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>

          <section className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 shadow-sm overflow-hidden flex flex-col min-h-[700px]">
            <div className="border-b border-slate-200 dark:border-slate-700 px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                    {currentConversation?.title || 'New Chat'}
                  </h2>
                  {currentConversation?.is_pinned ? <Pin className="w-3.5 h-3.5 text-amber-500" /> : null}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {statusNote || 'Persistent memory is enabled for this conversation.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => void handleRegenerate()}
                  disabled={isGenerating || messages.length === 0}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Regenerate
                </button>
                <button
                  type="button"
                  onClick={stopGeneration}
                  disabled={!isGenerating}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <Square className="w-3.5 h-3.5" />
                  Stop
                </button>
                <button
                  type="button"
                  onClick={() => void handleContinue()}
                  disabled={isGenerating || messages.length === 0}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  Continue
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-950">
              {loadingMessages ? (
                <div className="text-sm text-slate-500 dark:text-slate-400">Loading conversation history...</div>
              ) : messages.length === 0 ? (
                <div className="flex min-h-[420px] items-center justify-center">
                  <div className="max-w-xl text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-600 text-white shadow-lg">
                      <Sparkles className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Start a new conversation</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                      {welcomeMessage.text}
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                      {welcomeMessage.suggestedActions?.map((action) => (
                        <button
                          key={action}
                          type="button"
                          onClick={() => void sendPrompt(action)}
                          className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                        >
                          {action}
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                messages.map((message) => renderMessage(message))
              )}

              {isGenerating && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center text-white">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                    Generating response...
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-950/95 p-4 sm:p-5">
              <div className="mb-3 flex flex-wrap gap-2">
                {samplePrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => void sendPrompt(prompt)}
                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void sendPrompt(inputValue);
                  setInputValue('');
                }}
                className="flex items-end gap-3"
              >
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      void sendPrompt(inputValue);
                      setInputValue('');
                    }
                  }}
                  rows={2}
                  placeholder="Ask CampusPilot AI..."
                  className="min-h-[56px] flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isGenerating}
                  className="inline-flex h-[56px] items-center gap-2 rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  Send
                </button>
              </form>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
