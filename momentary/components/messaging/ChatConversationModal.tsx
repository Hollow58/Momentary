import React, { useRef } from 'react';
import { KeyboardAvoidingView, Modal, NativeScrollEvent, NativeSyntheticEvent, Platform, ScrollView, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { type Message, type User } from '@/lib/api';

import { UserAvatar } from '../social/UserAvatar';
import { formatTimeLabel } from './ChatThreadCard';
import { styles } from '@/styles/components/ChatConversationModal';

type ChatConversationModalProps = {
  currentUser: User | null;
  activeFriend: User | null;
  messages: Message[];
  draft: string;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  onClose: () => void;
};

// Chat conversation modal
export function ChatConversationModal({
  currentUser,
  activeFriend,
  messages,
  draft,
  onDraftChange,
  onSend,
  onClose,
}: ChatConversationModalProps) {
  const scrollRef = useRef<ScrollView>(null);
  // Track if user is scrolled to the bottom
  const isAtBottomRef = useRef(true);
  // Previous message count
  const prevLengthRef = useRef(0);
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();

  // Check if user is near the bottom of the scroll view
  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const distanceFromBottom = contentSize.height - (contentOffset.y + layoutMeasurement.height);
    isAtBottomRef.current = distanceFromBottom < 60;
  };

  // Auto scroll on new messages
  const handleContentSizeChange = () => {
    if (messages.length > prevLengthRef.current && isAtBottomRef.current) {
      scrollRef.current?.scrollToEnd({ animated: true });
    }
    prevLengthRef.current = messages.length;
  };

  return (
    // Slide up modal
    <Modal visible={activeFriend !== null} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          {/* Push content up when keyboard opens */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.shell}
            keyboardVerticalOffset={Platform.OS === 'ios' ? Math.round(screenHeight * 0.1) : 0}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose} style={styles.backButton} activeOpacity={0.8}>
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
              <View style={styles.friendBlock}>
                {activeFriend ? (
                  <UserAvatar user={activeFriend} size={44} style={styles.avatar} letterStyle={styles.avatarLetter} />
                ) : null}
                <View>
                  <Text style={styles.name}>{activeFriend?.display_name}</Text>
                  <Text style={styles.username}>@{activeFriend?.username}</Text>
                </View>
              </View>
            </View>

            {/* Messages */}
            <ScrollView
              ref={scrollRef}
              style={styles.messageList}
              contentContainerStyle={styles.messageStack}
              showsVerticalScrollIndicator={false}
              onScroll={handleScroll}
              onContentSizeChange={handleContentSizeChange}
              scrollEventThrottle={100}
            >
              {messages.map((message) => {
                // Check if this message was sent by the current user
                const isMine = Boolean(currentUser && message.sender_id === currentUser.id);

                return (
                  <View key={message.id} style={[styles.messageRow, isMine ? styles.messageRowMine : styles.messageRowTheirs]}>
                    {/* Message bubble */}
                    <View style={[styles.messageBubble, isMine ? styles.messageBubbleMine : styles.messageBubbleTheirs]}>
                      <Text style={[styles.messageText, isMine ? styles.messageTextMine : styles.messageTextTheirs]}>
                        {message.body}
                      </Text>
                      {/* Time + status */}
                      <View style={styles.messageFooter}>
                        <Text style={[styles.messageTime, isMine ? styles.messageTimeMine : styles.messageTimeTheirs]}>
                          {formatTimeLabel(message.created_at)}
                        </Text>
                        {isMine ? <Text style={styles.messageStatus}>{message.status === 'read' ? 'Read' : 'Delivered'}</Text> : null}
                      </View>
                    </View>
                  </View>
                );
              })}
            </ScrollView>

            {/* Message input */}
            <View style={[styles.composer, { paddingBottom: Math.max(insets.bottom, 18) }]}>
              <TextInput
                value={draft}
                onChangeText={onDraftChange}
                placeholder="Write a message"
                placeholderTextColor="#9B8E80"
                style={styles.input}
                multiline
              />
              <TouchableOpacity style={styles.sendButton} onPress={onSend} activeOpacity={0.85}>
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
    </Modal>
  );
}

