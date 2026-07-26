import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CampusNotification {
  id: string;
  title: string;
  message: string;
  category: 'Academic' | 'Exam' | 'Placement' | 'Emergency' | 'General';
  timestamp: string;
  isNew: boolean;
}

interface NotificationContextType {
  notifications: CampusNotification[];
  unreadCount: number;
  addNotification: (title: string, message: string, category?: CampusNotification['category']) => void;
  markAllAsRead: () => void;
  toastMessage: CampusNotification | null;
  clearToast: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const BROADCAST_EVENT_NAME = 'CAMPUS_DB_UPDATE_EVENT';

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<CampusNotification[]>([
    {
      id: 'notif_init_1',
      title: 'Welcome to CampusPilot AI',
      message: 'SQLite Central Database is active & connected for live updates!',
      category: 'General',
      timestamp: 'Just Now',
      isNew: true
    }
  ]);
  const [toastMessage, setToastMessage] = useState<CampusNotification | null>(null);

  const addNotification = (title: string, message: string, category: CampusNotification['category'] = 'General') => {
    const newNotif: CampusNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title,
      message,
      category,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isNew: true
    };

    setNotifications((prev) => [newNotif, ...prev]);
    setToastMessage(newNotif);

    // Auto clear toast after 5s
    setTimeout(() => {
      setToastMessage((current) => (current?.id === newNotif.id ? null : current));
    }, 5000);

    // Broadcast across windows/tabs
    if (typeof window !== 'undefined') {
      const event = new CustomEvent(BROADCAST_EVENT_NAME, { detail: newNotif });
      window.dispatchEvent(event);
    }
  };

  useEffect(() => {
    const handleBroadcast = (event: Event) => {
      const customEvt = event as CustomEvent<CampusNotification>;
      if (customEvt.detail) {
        setNotifications((prev) => [customEvt.detail, ...prev.filter(n => n.id !== customEvt.detail.id)]);
        setToastMessage(customEvt.detail);
      }
    };

    window.addEventListener(BROADCAST_EVENT_NAME, handleBroadcast);
    return () => window.removeEventListener(BROADCAST_EVENT_NAME, handleBroadcast);
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isNew: false })));
  };

  const clearToast = () => {
    setToastMessage(null);
  };

  const unreadCount = notifications.filter((n) => n.isNew).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAllAsRead,
        toastMessage,
        clearToast
      }}
    >
      {children}

      {/* Global Live Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md w-full bg-slate-900 text-white border border-emerald-500/40 rounded-2xl shadow-2xl p-4 flex items-start justify-between gap-4 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black shrink-0">
              🔔
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold uppercase">
                  {toastMessage.category}
                </span>
                <span className="text-[10px] text-slate-400">{toastMessage.timestamp}</span>
              </div>
              <h4 className="font-bold text-sm text-white mt-1">{toastMessage.title}</h4>
              <p className="text-xs text-slate-300 mt-0.5 line-clamp-2">{toastMessage.message}</p>
            </div>
          </div>
          <button
            onClick={clearToast}
            className="text-slate-400 hover:text-white text-xs font-bold p-1 shrink-0"
          >
            ✕
          </button>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};
