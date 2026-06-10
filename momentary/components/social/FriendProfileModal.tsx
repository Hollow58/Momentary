import React from 'react';
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';

import { type FriendRequestView, type RelationshipState, type User } from '@/lib/api';

import { RelationshipBadge } from './RelationshipBadge';
// Spotify Widget
import { SpotifyPlayer } from './SpotifyPlayer';
import { UserAvatar } from './UserAvatar';
import { styles } from '@/styles/components/FriendProfileModal';

type FriendProfileModalProps = {
  currentUser: User | null;
  selectedUser: User | null;
  relationship: RelationshipState;
  incomingRequests: FriendRequestView[];
  outgoingRequests: FriendRequestView[];
  onClose: () => void;
  onSendRequest: (targetUserId: number) => void;
  onAcceptRequest: (requestId: number) => void;
  onDeclineRequest: (requestId: number) => void;
  onCancelRequest: (requestId: number) => void;
};

// Profile modal
export function FriendProfileModal({
  currentUser,
  selectedUser,
  relationship,
  incomingRequests,
  outgoingRequests,
  onClose,
  onSendRequest,
  onAcceptRequest,
  onDeclineRequest,
  onCancelRequest,
}: FriendProfileModalProps) {

  return (
    // Fade in modal overlay
    <Modal visible={selectedUser !== null} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        {/* Close on outside tap */}
        <Pressable style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} onPress={onClose} />
        {selectedUser ? (
          <View style={styles.card}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Profile</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.8}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>

            {/* Info */}
            <View style={styles.profileRow}>
              <UserAvatar user={selectedUser} size={72} style={styles.avatar} letterStyle={styles.avatarLetter} />
              <View style={styles.profileTextBlock}>
                <Text style={styles.name}>{selectedUser.display_name}</Text>
                <Text style={styles.username}>@{selectedUser.username}</Text>
                <Text style={styles.email}>{selectedUser.email}</Text>
              </View>
            </View>

            {/* Relationship status */}
            <View style={styles.body}>
              <RelationshipBadge state={relationship} />
            </View>

            {/* Spotify widget */}
            <SpotifyPlayer userId={selectedUser.id} />

            {/* Action buttons */}
            <View style={styles.actions}>
              <TouchableOpacity style={styles.secondaryButton} onPress={onClose} activeOpacity={0.85}>
                <Text style={styles.secondaryButtonText}>Dismiss</Text>
              </TouchableOpacity>
              {renderPrimaryAction({
                relationship,
                currentUser,
                selectedUser,
                incomingRequests,
                outgoingRequests,
                onSendRequest,
                onAcceptRequest,
                onDeclineRequest,
                onCancelRequest,
              })}
            </View>
          </View>
        ) : null}
      </View>
    </Modal>
  );
}

// Primary action button
function renderPrimaryAction({
  relationship,
  currentUser,
  selectedUser,
  incomingRequests,
  outgoingRequests,
  onSendRequest,
  onAcceptRequest,
  onDeclineRequest,
  onCancelRequest,
}: {
  relationship: RelationshipState;
  currentUser: User | null;
  selectedUser: User;
  incomingRequests: FriendRequestView[];
  outgoingRequests: FriendRequestView[];
  onSendRequest: (targetUserId: number) => void;
  onAcceptRequest: (requestId: number) => void;
  onDeclineRequest: (requestId: number) => void;
  onCancelRequest: (requestId: number) => void;
}) {
  if (!currentUser) return null;

  if (relationship === 'friends') {
    return (
      <View style={styles.primaryButtonLocked}>
        <Text style={styles.primaryButtonText}>Already friends</Text>
      </View>
    );
  }

  if (relationship === 'incoming') {
    const incoming = incomingRequests.find((request) => request.from_user_id === selectedUser.id);
    return (
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => {
          if (incoming) {
            onAcceptRequest(incoming.id);
          }
        }}
        activeOpacity={0.85}
      >
        <Text style={styles.primaryButtonText}>Accept request</Text>
      </TouchableOpacity>
    );
  }

  if (relationship === 'outgoing') {
    const outgoing = outgoingRequests.find((request) => request.to_user_id === selectedUser.id);
    return (
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => {
          if (outgoing) {
            onCancelRequest(outgoing.id);
          }
        }}
        activeOpacity={0.85}
      >
        <Text style={styles.primaryButtonText}>Cancel request</Text>
      </TouchableOpacity>
    );
  }

  if (relationship === 'self') return null;

  return (
    <TouchableOpacity style={styles.primaryButton} onPress={() => onSendRequest(selectedUser.id)} activeOpacity={0.85}>
      <Text style={styles.primaryButtonText}>Send request</Text>
    </TouchableOpacity>
  );
}

