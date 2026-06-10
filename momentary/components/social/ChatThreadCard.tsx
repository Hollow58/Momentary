import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { type ChatThread, type User } from '@/lib/api';

import { UserAvatar } from '../social/UserAvatar';
import { styles } from '@/styles/components/ChatThreadCard';

type ChatThreadCardProps = {
  thread: ChatThread;
  currentUserId: number;
  onPress: (friend: User) => void;
};

// Chat thread row
export function ChatThreadCard({ thread, currentUserId, onPress }: ChatThreadCardProps) {
  const lastMessage = thread.last_message;
  // Unread messages
  const hasUnread = (thread.unread_count ?? 0) > 0;

  // Preview text
  function getPreviewText() {
    if (!lastMessage) return 'Start the conversation';
    if (lastMessage.sender_id !== currentUserId) return lastMessage.body;
    return lastMessage.status === 'read' ? 'Read' : 'Delivered';
  }
  const previewText = getPreviewText();

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(thread.friend)} activeOpacity={0.88}>
      {/* Avatar */}
      <UserAvatar user={thread.friend} size={54} style={styles.avatar} letterStyle={styles.avatarLetter} />

      <View style={styles.meta}>
        {/* Name + time */}
        <View style={styles.topRow}>
          <Text style={[styles.name, hasUnread && styles.nameUnread]}>{thread.friend.display_name}</Text>
          <Text style={[styles.time, hasUnread && styles.timeUnread]}>{formatTimeLabel(lastMessage?.created_at)}</Text>
        </View>
        {/* Last message */}
        <Text style={[styles.preview, hasUnread && styles.previewUnread]} numberOfLines={1}>
          {previewText}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// Format time label
export function formatTimeLabel(dateValue?: string | null) {
  if (!dateValue) return '';

  const created = new Date(dateValue);
  if (Number.isNaN(created.getTime())) return '';

  const diffMs = Date.now() - created.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}
