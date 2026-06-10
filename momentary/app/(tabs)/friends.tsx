// Friend components
import { FriendProfileModal } from '@/components/social/FriendProfileModal';
import { FriendRequestsSection } from '@/components/social/FriendRequestsSection';
import { FriendSearchCard } from '@/components/social/FriendSearchCard';
import { useAuth } from '@/contexts/AuthContext';
// Friend API functions
import {
    acceptFriendRequest,
    cancelFriendRequest,
    declineFriendRequest,
    getAllUsers,
    getFriendRequests,
    getRelationshipState,
    sendFriendRequest,
    type FriendRequestView,
    type RelationshipState,
    type User
} from '@/lib/api';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from '@/styles/tabs/friends';
import { GRADIENT_COLORS, GRADIENT_LOCATIONS } from '@/styles/global';
import Svg, { Path } from 'react-native-svg';

// Friends screen
export default function FriendsScreen() {
  const { user } = useAuth();
  // Search text
  const [query, setQuery] = useState('');
  // Search results
  const [searchResults, setSearchResults] = useState<User[]>([]);
  // Incoming friend requests
  const [incomingRequests, setIncomingRequests] = useState<FriendRequestView[]>([]);
  // Outgoing friend requests
  const [outgoingRequests, setOutgoingRequests] = useState<FriendRequestView[]>([]);
  // Open profile (null = closed)
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  // Relationship status per user
  const [relationshipMap, setRelationshipMap] = useState<Record<number, RelationshipState>>({});
  // Show requests modal
  const [requestsModalVisible, setRequestsModalVisible] = useState(false);

  // Load users and requests
  const refreshData = useCallback(async () => {
    if (!user) return;

    // All users
    const users = await getAllUsers();
    const normalized = query.trim().toLowerCase();
    // Filter by search
    const filtered = users.filter((candidate) => {
      if (candidate.id === user.id) return false;
      if (!normalized) return true;
      return (
        candidate.username.toLowerCase().includes(normalized) ||
        candidate.display_name.toLowerCase().includes(normalized) ||
        candidate.email.toLowerCase().includes(normalized)
      );
    });
    setSearchResults(filtered);

    // Load requests
    const requests = await getFriendRequests(user.id);
    setIncomingRequests(requests.incoming);
    setOutgoingRequests(requests.outgoing);

    // Relationship per user
    const map: Record<number, RelationshipState> = {};
    await Promise.all(
      filtered.map(async (u) => {
        map[u.id] = await getRelationshipState(user.id, u.id);
      }),
    );
    setRelationshipMap(map);
  }, [query, user]);

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
      const rel = await getRelationshipState(user.id, candidate.id);
      setRelationshipMap((prev) => ({ ...prev, [candidate.id]: rel }));
    }
    setSelectedUser(candidate);
  };

  // Close profile
  const closeProfile = () => {
    setSelectedUser(null);
  };

  // Send friend request
  const handleSendRequest = async (targetUserId: number) => {
    if (!user) return;
    await sendFriendRequest(user.id, targetUserId);
    void refreshData();
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

  // Handle action button on a search card
  const handleSearchCardAction = (candidate: User, relationship: RelationshipState) => {
    // Accept incoming request
    if (relationship === 'incoming') {
      const incoming = incomingRequests.find((request) => request.from_user_id === candidate.id);
      if (incoming) handleAcceptRequest(incoming.id);
      return;
    }

    // No relationship -> send request
    if (relationship === 'none') {
      handleSendRequest(candidate.id);
    }
  };

  // Button label based on relationship
  const getActionLabel = (targetUser: User) => {
    if (!user) return 'Open';
    const relationship = relationshipMap[targetUser.id] ?? 'none';

    if (relationship === 'friends') return 'Friends';
    if (relationship === 'incoming') return 'Accept';
    if (relationship === 'outgoing') return 'Request sent';
    return 'Send request';
  };

  // Render a user card
  const renderSearchCard = (candidate: User) => {
    if (!user) return null;

    const relationship = relationshipMap[candidate.id] ?? 'none';
    const primaryLabel = getActionLabel(candidate);
    // Disable if already friends or pending
    const isDisabled = relationship === 'friends' || relationship === 'outgoing';

    return (
      <FriendSearchCard
        key={candidate.id}
        user={candidate}
        relationship={relationship}
        primaryLabel={primaryLabel}
        disabled={isDisabled}
        onOpenProfile={openProfile}
        onPrimaryAction={() => handleSearchCardAction(candidate, relationship)}
      />
    );
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
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Title and requests button */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>Friends</Text>
          {/* Open requests modal */}
          <TouchableOpacity
            style={styles.requestsBtn}
            onPress={() => setRequestsModalVisible(true)}
            activeOpacity={0.8}
          >
            {/* Dot if there are pending requests */}
            {incomingRequests.length > 0 && <View style={styles.requestsDot} />}
            {/* Person + icon */}
            <Svg width={26} height={26} viewBox="0 0 24 24">
              {/* Person body */}
              <Path
                d="M9 12C11.21 12 13 10.21 13 8C13 5.79 11.21 4 9 4C6.79 4 5 5.79 5 8C5 10.21 6.79 12 9 12ZM9 14C6.33 14 1 15.34 1 18V20H17V18C17 15.34 11.67 14 9 14Z"
                fill="#40312B"
              />
              {/* Plus sign */}
              <Path d="M20 7V9.5H22.5V11.5H20V14H18V11.5H15.5V9.5H18V7H20Z" fill="#40312B" />
            </Svg>
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>Search people and manage requests.</Text>

        {/* Search box */}
        <View style={styles.searchBox}>
          <Text style={styles.sectionLabel}>Search users</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search by name, username, or email"
            placeholderTextColor="#9B8E80"
            style={styles.searchInput}
          />
        </View>

        {/* Results */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Results</Text>
          <Text style={styles.sectionCount}>{searchResults.length}</Text>
        </View>

        {/* Search results or empty message */}
        {searchResults.length > 0 ? (
          <View style={styles.sectionStack}>{searchResults.map((candidate) => renderSearchCard(candidate))}</View>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No users found</Text>
            <Text style={styles.emptyText}>Try a different name or username.</Text>
          </View>
        )}

      </ScrollView>

      {/* Profile modal */}
      <FriendProfileModal
        currentUser={user}
        selectedUser={selectedUser}
        relationship={selectedUser ? (relationshipMap[selectedUser.id] ?? 'none') : 'none'}
        incomingRequests={incomingRequests}
        outgoingRequests={outgoingRequests}
        onClose={closeProfile}
        onSendRequest={handleSendRequest}

        onAcceptRequest={(requestId) => {
          handleAcceptRequest(requestId);
          closeProfile();
        }}
        onDeclineRequest={handleDeclineRequest}
        onCancelRequest={handleCancelRequest}
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
            {/* Header with done button */}
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
            {/* Requests list */}
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



