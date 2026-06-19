// Friend components
import { FriendCard } from '@/components/social/FriendCard';
import { FriendProfileModal } from '@/components/social/FriendProfileModal';
import { FriendRequestsSection } from '@/components/social/FriendRequestsSection';
import { FriendSearchModal } from '@/components/social/FriendSearchModal';
import { useAuth } from '@/contexts/AuthContext';
// Friend API functions
import {
  acceptFriendRequest,
  cancelFriendRequest,
  declineFriendRequest,
  getFriendRequests,
  getFriends,
  sendFriendRequest,
  unfriendUser,
  type FriendRequestView,
  type RelationshipState,
  type User,
} from '@/lib/api';
import { GRADIENT_COLORS, GRADIENT_LOCATIONS } from '@/styles/global';
import { styles } from '@/styles/tabs/friends';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

// Friends screen
export default function FriendsScreen() {
  const { user } = useAuth();
  // Responsive cube size for 2-column grid
  const { width: screenWidth } = useWindowDimensions();
  const cubeSize = Math.floor((screenWidth - 32 - 12) / 2); // 32 = 2×16 padding, 12 = gap
  // Incoming friend requests
  const [incomingRequests, setIncomingRequests] = useState<FriendRequestView[]>([]);
  // Outgoing friend requests
  const [outgoingRequests, setOutgoingRequests] = useState<FriendRequestView[]>([]);
  // Open profile (null = closed)
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  // Relationship status for currently selected user
  const [selectedRelationship, setSelectedRelationship] = useState<RelationshipState>('none');
  // Show requests modal
  const [requestsModalVisible, setRequestsModalVisible] = useState(false);
  // Show search modal
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  // Accepted friends list
  const [friends, setFriends] = useState<User[]>([]);

  // Load accepted friends and requests
  const refreshData = useCallback(async () => {
    if (!user) return;

    const [friendsList, requests] = await Promise.all([
      getFriends(user.id),
      getFriendRequests(user.id),
    ]);
    setFriends(friendsList);
    setIncomingRequests(requests.incoming);
    setOutgoingRequests(requests.outgoing);
  }, [user]);

  // Refresh data when the search text changes
  useEffect(() => {
    void refreshData();
  }, [refreshData]);

  // Refresh when screen opens
  useFocusEffect(
    useCallback(() => {
      void refreshData();
    }, [refreshData]),
  );

  // Open profile
  const openProfile = async (candidate: User) => {
    if (user) {
      const { getRelationshipState } = await import('@/lib/api');
      const rel = await getRelationshipState(user.id, candidate.id);
      setSelectedRelationship(rel);
    }
    setSelectedUser(candidate);
  };

  // Close profile
  const closeProfile = () => {
    setSelectedUser(null);
    setSelectedRelationship('none');
  };

  // Send friend request
  const handleSendRequest = async (targetUserId: number) => {
    if (!user) return;
    try {
      await sendFriendRequest(user.id, targetUserId);
      void refreshData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send friend request';
      Alert.alert('Friend Request', message);
    }
  };

  // Accept request
  const handleAcceptRequest = async (requestId: number) => {
    await acceptFriendRequest(requestId);
    void refreshData();
  };

  // Decline request
  const handleDeclineRequest = async (requestId: number) => {
    await declineFriendRequest(requestId);
    void refreshData();
  };

  // Cancel request
  const handleCancelRequest = async (requestId: number) => {
    await cancelFriendRequest(requestId);
    void refreshData();
  };

  // Unfriend
  const handleUnfriend = async (targetUserId: number) => {
    if (!user) return;
    await unfriendUser(user.id, targetUserId);
    closeProfile();
    void refreshData();
  };

  // Not logged in
  if (!user) {
    return (
      <LinearGradient
        colors={[...GRADIENT_COLORS]}
        locations={[...GRADIENT_LOCATIONS]}
        style={styles.container}
      >
        <Text style={styles.title}>Friends</Text>
        <Text style={styles.placeholder}>Sign in to search users and manage requests.</Text>
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
        {/* Title, search button, requests button */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>Friends</Text>
          <View style={styles.headerActions}>
            {/* Open search modal */}
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => setSearchModalVisible(true)}
              activeOpacity={0.8}
            >
              <Svg width={22} height={22} viewBox="0 0 24 24">
                <Path
                  d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                  fill="#40312B"
                />
              </Svg>
            </TouchableOpacity>
            {/* Open requests modal */}
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => setRequestsModalVisible(true)}
              activeOpacity={0.8}
            >
              {incomingRequests.length > 0 && <View style={styles.requestsDot} />}
              <Svg width={22} height={22} viewBox="0 0 24 24">
                <Path
                  d="M9 12C11.21 12 13 10.21 13 8C13 5.79 11.21 4 9 4C6.79 4 5 5.79 5 8C5 10.21 6.79 12 9 12ZM9 14C6.33 14 1 15.34 1 18V20H17V18C17 15.34 11.67 14 9 14Z"
                  fill="#40312B"
                />
                <Path d="M20 7V9.5H22.5V11.5H20V14H18V11.5H15.5V9.5H18V7H20Z" fill="#40312B" />
              </Svg>
            </TouchableOpacity>
          </View>
        </View>

        {/* Friends grid */}
        {friends.length > 0 ? (
          <View style={styles.friendsGrid}>
            {friends.map((friend) => (
              <FriendCard
                key={friend.id}
                user={friend}
                cubeSize={cubeSize}
                onPress={openProfile}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No friends yet</Text>
            <Text style={styles.emptyText}>Tap the search button above to find people and send friend requests.</Text>
          </View>
        )}
      </ScrollView>

      {/* Search modal */}
      <FriendSearchModal
        visible={searchModalVisible}
        currentUser={user}
        incomingRequests={incomingRequests}
        onClose={() => { setSearchModalVisible(false); void refreshData(); }}
        onOpenProfile={openProfile}
        onSendRequest={handleSendRequest}
        onAcceptRequest={(requestId) => { void handleAcceptRequest(requestId); }}
      />

      {/* Profile modal */}
      <FriendProfileModal
        currentUser={user}
        selectedUser={selectedUser}
        relationship={selectedRelationship}
        incomingRequests={incomingRequests}
        outgoingRequests={outgoingRequests}
        onClose={closeProfile}
        onSendRequest={handleSendRequest}
        onAcceptRequest={(requestId) => {
          void handleAcceptRequest(requestId);
          closeProfile();
        }}
        onCancelRequest={handleCancelRequest}
        onUnfriend={handleUnfriend}
      />

      {/* Friend requests modal */}
      <Modal
        visible={requestsModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setRequestsModalVisible(false)}
      >
        <View style={styles.requestsModalBackdrop}>
          <View style={styles.requestsModalSheet}>
            <View style={styles.requestsModalHeader}>
              <Text style={styles.requestsModalTitle}>Friend Requests</Text>
              <TouchableOpacity
                onPress={() => setRequestsModalVisible(false)}
                style={styles.requestsModalDoneBtn}
                activeOpacity={0.8}
              >
                <Text style={styles.requestsModalDoneText}>Done</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              contentContainerStyle={styles.requestsModalContent}
              showsVerticalScrollIndicator={false}
            >
              <FriendRequestsSection
                incomingRequests={incomingRequests}
                outgoingRequests={outgoingRequests}
                onAccept={handleAcceptRequest}
                onDecline={handleDeclineRequest}
                onCancel={handleCancelRequest}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

