import React, { useCallback, useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

import {
  getAllUsers,
  getRelationshipState,
  type FriendRequestView,
  type RelationshipState,
  type User,
} from '@/lib/api';
import * as g from '@/styles/global';
import { FriendSearchCard } from './FriendSearchCard';

type Props = {
  visible: boolean;
  currentUser: User;
  incomingRequests: FriendRequestView[];
  onClose: () => void;
  onOpenProfile: (user: User) => void;
  onSendRequest: (userId: number) => Promise<void>;
  onAcceptRequest: (requestId: number) => void;
};

// bottom sheet for searching users
export function FriendSearchModal({
  visible,
  currentUser,
  incomingRequests,
  onClose,
  onOpenProfile,
  onSendRequest,
  onAcceptRequest,
}: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [relMap, setRelMap] = useState<Record<number, RelationshipState>>({});

  // search on each keystroke, skip if empty
  const doSearch = useCallback(
    async (q: string) => {
      const norm = q.trim().toLowerCase();
      if (!norm) {
        setResults([]);
        setRelMap({});
        return;
      }

      const users = await getAllUsers();
      const filtered = users.filter(
        (u) =>
          u.id !== currentUser.id &&
          (u.username.toLowerCase().includes(norm) ||
            u.display_name.toLowerCase().includes(norm) ||
            u.email.toLowerCase().includes(norm)),
      );
      setResults(filtered);

      const map: Record<number, RelationshipState> = {};
      await Promise.all(
        filtered.map(async (u) => {
          map[u.id] = await getRelationshipState(currentUser.id, u.id);
        }),
      );
      setRelMap(map);
    },
    [currentUser.id],
  );

  useEffect(() => {
    if (visible) void doSearch(query);
  }, [query, visible, doSearch]);

  // Reset state when modal is dismissed
  useEffect(() => {
    if (!visible) {
      setQuery('');
      setResults([]);
      setRelMap({});
    }
  }, [visible]);

  const getLabel = (u: User) => {
    const rel = relMap[u.id] ?? 'none';
    if (rel === 'friends') return 'Friends';
    if (rel === 'incoming') return 'Accept';
    if (rel === 'outgoing') return 'Request sent';
    return 'Send request';
  };

  const handleAction = (candidate: User, rel: RelationshipState) => {
    if (rel === 'incoming') {
      const req = incomingRequests.find((r) => r.from_user_id === candidate.id);
      if (req) {
        setRelMap((prev) => ({ ...prev, [candidate.id]: 'friends' }));
        onAcceptRequest(req.id);
      }
      return;
    }
    if (rel === 'none') {
      setRelMap((prev) => ({ ...prev, [candidate.id]: 'outgoing' }));
      void onSendRequest(candidate.id);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.backdrop}
      >
        {/* tap outside to close */}
        <TouchableOpacity
          style={styles.dismissArea}
          onPress={onClose}
          activeOpacity={1}
        />

        <View style={styles.sheet}>
          {/* Nameplate header */}
          <View style={styles.nameplate}>
            <View style={styles.inputWrap}>
              {/* Magnifier icon */}
              <Svg width={18} height={18} viewBox="0 0 24 24">
                <Path
                  d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                  fill="#9B8E80"
                />
              </Svg>
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search by name or username"
                placeholderTextColor="#9B8E80"
                style={styles.input}
                autoFocus
                returnKeyType="search"
              />
              {/* Clear button */}
              {query.length > 0 && (
                <TouchableOpacity
                  onPress={() => setQuery('')}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Svg width={18} height={18} viewBox="0 0 24 24">
                    <Path
                      d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                      fill="#9B8E80"
                    />
                  </Svg>
                </TouchableOpacity>
              )}
            </View>

            {/* Cancel button */}
            <TouchableOpacity onPress={onClose} style={styles.cancelBtn} activeOpacity={0.7}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          {/* Results list */}
          <ScrollView
            contentContainerStyle={styles.resultsList}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {query.trim() === '' ? (
              <Text style={styles.hint}>Start typing to find people</Text>
            ) : results.length === 0 ? (
              <Text style={styles.hint}>No users found</Text>
            ) : (
              results.map((u) => {
                const rel = relMap[u.id] ?? 'none';
                return (
                  <FriendSearchCard
                    key={u.id}
                    user={u}
                    relationship={rel}
                    primaryLabel={getLabel(u)}
                    disabled={rel === 'friends' || rel === 'outgoing'}
                    onOpenProfile={(candidate) => {
                      onClose();
                      onOpenProfile(candidate);
                    }}
                    onPrimaryAction={() => handleAction(u, rel)}
                  />
                );
              })
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
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
    height: '82%',
  },
  nameplate: {
    ...g.modalNameplate,
    gap: 10,
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: g.CONTROL_TINT,
    borderRadius: g.CONTROL_RADIUS,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 11 : 8,
    gap: 8,
  },
  input: {
    flex: 1,
    fontFamily: 'Nunito_400Regular',
    fontSize: 15,
    color: g.TEXT_PRIMARY,
    padding: 0,
  },
  cancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 2,
  },
  cancelText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 15,
    color: g.PRIMARY_ACTION,
  },
  resultsList: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 48,
    gap: 12,
  },
  hint: {
    fontFamily: 'Nunito_400Regular',
    color: g.TEXT_SECONDARY,
    textAlign: 'center',
    marginTop: 36,
    fontSize: 15,
  },
});
