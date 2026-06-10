import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { useAuth } from './AuthContext';
import { getChatThreads, getFriendRequests } from '@/lib/api';

interface NotificationContextType {
  unreadMessages: number;
  pendingFriendRequests: number;
}

const NotificationContext = createContext<NotificationContextType>({
  unreadMessages: 0,
  pendingFriendRequests: 0,
});

export function useNotifications() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [pendingFriendRequests, setPendingFriendRequests] = useState(0);

  const refresh = useCallback(async () => {
    if (!user) {
      setUnreadMessages(0);
      setPendingFriendRequests(0);
      return;
    }
    try {
      const threads = await getChatThreads(user.id);
      const total = threads.reduce((sum, t) => sum + (t.unread_count ?? 0), 0);
      setUnreadMessages(total);
    } catch {}
    try {
      const { incoming } = await getFriendRequests(user.id);
      setPendingFriendRequests(incoming.length);
    } catch {}
  }, [user]);

  useEffect(() => {
    void refresh();
    const interval = setInterval(() => void refresh(), 5000);
    return () => clearInterval(interval);
  }, [refresh]);

  return (
    <NotificationContext.Provider value={{ unreadMessages, pendingFriendRequests }}>
      {children}
    </NotificationContext.Provider>
  );
}
