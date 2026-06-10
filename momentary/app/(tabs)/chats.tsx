import { useAuth } from '@/contexts/AuthContext';
import {
  getChatThreads,
  getConversation,
  sendMessage,
  type ChatThread,
  type Message,
  type User,
} from '@/lib/api';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { styles } from '@/styles/tabs/chats';
import { GRADIENT_COLORS, GRADIENT_LOCATIONS } from '@/styles/global';

import { ChatConversationModal } from '@/components/messaging/ChatConversationModal';
import { ChatThreadCard } from '@/components/messaging/ChatThreadCard';

// Chats screen
export default function ChatsScreen() {
  const { user } = useAuth();
  // All chat threads
  const [threads, setThreads] = useState<ChatThread[]>([]);
  // Open conversation (null = no conversation open)
  const [activeFriend, setActiveFriend] = useState<User | null>(null);
  // Messages in the open conversation
  const [messages, setMessages] = useState<Message[]>([]);
  // Text being typed
  const [draft, setDraft] = useState('');

  // Load all chat threads from server
  const refreshThreads = useCallback(async () => {
    if (!user) return;
    const t = await getChatThreads(user.id);
    setThreads(t);
  }, [user]);

  // Fetch messages for a specific conversation
  const refreshConversation = useCallback(
    async (friendId: number) => {
      if (!user) return;
      const msgs = await getConversation(user.id, friendId);
      setMessages(msgs);
    },
    [user],
  );

  // Load threads on mount
  useEffect(() => {
    void refreshThreads();
  }, [refreshThreads]);

  // Refresh when screen is opened
  useFocusEffect(
    useCallback(() => {
      void refreshThreads();
      if (activeFriend) {
        void refreshConversation(activeFriend.id);
      }
    }, [activeFriend, refreshConversation, refreshThreads]),
  );

  // Refresh every 3 seconds
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      void refreshThreads();
      if (activeFriend) {
        void refreshConversation(activeFriend.id);
      }
    }, 3000);

    // Stop refreshing when leaving
    return () => clearInterval(interval);
  }, [activeFriend, refreshConversation, refreshThreads, user]);

  // Open a conversation
  const openThread = (friend: User) => {
    setActiveFriend(friend);
    void refreshConversation(friend.id);
  };

  // Close conversation
  const closeThread = () => {
    setActiveFriend(null);
    setMessages([]);
    setDraft('');
  };

  // Send message
  const handleSend = async () => {
    if (!user || !activeFriend) return;

    const trimmed = draft.trim();
    if (!trimmed) return;

    // Clear input
    setDraft('');
    // Send and refresh
    await sendMessage(user.id, activeFriend.id, trimmed);
    await refreshConversation(activeFriend.id);
    await refreshThreads();
  };

  // Not logged in
  if (!user) {
    return (
      <LinearGradient
        colors={[...GRADIENT_COLORS]}
        locations={[...GRADIENT_LOCATIONS]}
        style={styles.container}
      >
        <Text style={styles.title}>Chats</Text>
        <Text style={styles.placeholder}>Sign in to see message threads.</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[...GRADIENT_COLORS]}
      locations={[...GRADIENT_LOCATIONS]}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Chats</Text>
        <Text style={styles.subtitle}>Accepted friends appear here automatically.</Text>

        {/* Active chats count */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active chats</Text>
          <Text style={styles.sectionCount}>{threads.length}</Text>
        </View>

        {/* Chat threads or empty message */}
        {threads.length > 0 ? (
          <View style={styles.threadStack}>
            {threads.map((thread) => (
              <ChatThreadCard key={thread.friend.id} thread={thread} currentUserId={user.id} onPress={openThread} />
            ))}
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No chats yet</Text>
            <Text style={styles.emptyText}>Accept a friend request in Friends to start messaging.</Text>
          </View>
        )}
      </ScrollView>

      {/* Conversation modal */}
      <ChatConversationModal
        currentUser={user}
        activeFriend={activeFriend}
        messages={messages}
        draft={draft}
        onDraftChange={setDraft}
        onSend={handleSend}
        onClose={closeThread}
      />
    </LinearGradient>
  );
}


