import React from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { type FriendRequestView, type RelationshipState, type User } from '@/lib/api';
import * as g from '@/styles/global';

import { RelationshipBadge } from './RelationshipBadge';
import { SpotifyPlayer } from './SpotifyPlayer';
import { UserAvatar } from './UserAvatar';

type Props = {
  currentUser: User | null;
  selectedUser: User | null;
  relationship: RelationshipState;
  incomingRequests: FriendRequestView[];
  outgoingRequests: FriendRequestView[];
  onClose: () => void;
  onSendRequest: (targetUserId: number) => void;
  onAcceptRequest: (requestId: number) => void;
  onCancelRequest: (requestId: number) => void;
  onUnfriend: (targetUserId: number) => void;
};

export function FriendProfileModal({
  currentUser,
  selectedUser,
  relationship,
  incomingRequests,
  outgoingRequests,
  onClose,
  onSendRequest,
  onAcceptRequest,
  onCancelRequest,
  onUnfriend,
}: Props) {
  // Derive the primary action button from the current relationship state
  let primaryAction: React.ReactNode = null;
  if (currentUser && selectedUser) {
    if (relationship === 'friends') {
      primaryAction = (
        <TouchableOpacity style={styles.unfriendBtn} onPress={() => onUnfriend(selectedUser.id)} activeOpacity={0.85}>
          <Text style={styles.unfriendBtnText}>Unfriend</Text>
        </TouchableOpacity>
      );
    } else if (relationship === 'incoming') {
      const req = incomingRequests.find((r) => r.from_user_id === selectedUser.id);
      primaryAction = (
        <TouchableOpacity style={styles.primaryBtn} onPress={() => req && onAcceptRequest(req.id)} activeOpacity={0.85}>
          <Text style={styles.primaryBtnText}>Accept request</Text>
        </TouchableOpacity>
      );
    } else if (relationship === 'outgoing') {
      const req = outgoingRequests.find((r) => r.to_user_id === selectedUser.id);
      primaryAction = (
        <TouchableOpacity style={styles.primaryBtn} onPress={() => req && onCancelRequest(req.id)} activeOpacity={0.85}>
          <Text style={styles.primaryBtnText}>Cancel request</Text>
        </TouchableOpacity>
      );
    } else if (relationship === 'none') {
      primaryAction = (
        <TouchableOpacity style={styles.primaryBtn} onPress={() => onSendRequest(selectedUser.id)} activeOpacity={0.85}>
          <Text style={styles.primaryBtnText}>Send request</Text>
        </TouchableOpacity>
      );
    }
  }

  return (
    <Modal visible={selectedUser !== null} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <TouchableOpacity style={styles.dismissArea} onPress={onClose} activeOpacity={1} />

        {selectedUser && (
          <View style={styles.sheet}>
            {/* Header: avatar + name, close button */}
            <View style={styles.nameplate}>
              <View style={styles.identity}>
                <UserAvatar user={selectedUser} size={40} />
                <View>
                  <Text style={styles.displayName}>{selectedUser.display_name}</Text>
                  <Text style={styles.username}>@{selectedUser.username}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>

            {/* Scrollable content */}
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
              <View style={styles.section}>
                <RelationshipBadge state={relationship} />
              </View>

              <SpotifyPlayer userId={selectedUser.id} />

              {primaryAction && <View style={styles.actions}>{primaryAction}</View>}
            </ScrollView>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: g.modalBackdrop,
  dismissArea: {
    flex: 1,
  },
  sheet: {
    ...g.modalSheetBase,
    maxHeight: '90%',
  },
  nameplate: {
    ...g.modalNameplate,
    justifyContent: 'space-between',
  },
  identity: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  displayName: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 17,
    color: g.TEXT_PRIMARY,
  },
  username: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: g.TEXT_SECONDARY,
  },
  closeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 2,
  },
  closeText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 15,
    color: g.PRIMARY_ACTION,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 48,
  },
  section: {
    backgroundColor: 'rgba(64, 49, 43, 0.04)',
    borderRadius: g.CARD_RADIUS,
    marginBottom: 12,
  },
  actions: {
    marginTop: 12,
  },
  primaryBtn: {
    backgroundColor: g.PRIMARY_ACTION,
    borderRadius: g.CONTROL_RADIUS,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryBtnText: {
    fontFamily: 'Nunito_700Bold',
    color: g.PRIMARY_ACTION_TEXT,
  },
  unfriendBtn: {
    backgroundColor: '#C0392B',
    borderRadius: g.CONTROL_RADIUS,
    paddingVertical: 12,
    alignItems: 'center',
  },
  unfriendBtnText: {
    fontFamily: 'Nunito_700Bold',
    color: '#FFFFFF',
  },
});

