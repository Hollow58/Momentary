import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

import {
  type FriendRequestView,
  type Message,
  type Post,
  type RelationshipState,
  type User,
  getConversation,
  getUserById,
  getUserPosts,
  resolveImageUrl,
  sendMessage,
  uploadImage,
} from '@/lib/api';
import { GRADIENT_COLORS, GRADIENT_LOCATIONS } from '@/styles/global';
import { styles as profileStyles } from '@/styles/tabs/profile';

import { ImageViewer } from '../ImageViewer';
import { ChatConversationModal } from '../messaging/ChatConversationModal';
import { DiaryPostCard } from './DiaryPostCard';
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

function BackIcon({ size = 22, color = '#33261F' }: { size?: number; color?: string }) {
  return (
    <Svg width={size * (73 / 119)} height={size} viewBox="0 0 73 119">
      <Path
        d="M2.55635 53.7867C-0.852116 56.9421 -0.852116 62.058 2.55635 65.2133L58.1004 116.633C61.509 119.789 67.0352 119.789 70.4436 116.633C73.8521 113.478 73.8521 108.362 70.4436 105.207L21.0711 59.5L70.4436 13.7933C73.8521 10.6378 73.8521 5.52194 70.4436 2.36655C67.0352 -0.78885 61.509 -0.78885 58.1004 2.36655L2.55635 53.7867Z"
        fill={color}
      />
    </Svg>
  );
}

// Unfriend icon – taken from assets/buttons/unfriend.svg
function UnfriendIcon({ size = 24, color = '#40312B' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Circle cx={29.22} cy={16.28} r={11.14} stroke={color} strokeWidth={4.5} />
      <Path
        d="M41.32,35.69c-2.69-1.95-8.34-3.25-12.1-3.25h0A22.55,22.55,0,0,0,6.67,55h29.9"
        stroke={color}
        strokeWidth={4.5}
      />
      <Circle cx={45.38} cy={46.92} r={11.94} stroke={color} strokeWidth={4.5} />
      <Line x1={38.98} y1={46.8} x2={52.98} y2={46.8} stroke={color} strokeWidth={4.5} />
    </Svg>
  );
}

function ForwardIcon({ size = 14, color = '#33261F' }: { size?: number; color?: string }) {
  return (
    <Svg width={size * (73 / 119)} height={size} viewBox="0 0 73 119">
      <Path
        d="M70.4437 53.7867C73.8521 56.9421 73.8521 62.058 70.4437 65.2133L14.8996 116.634C11.491 119.789 5.96481 119.789 2.55641 116.634C-0.852133 113.478 -0.852133 108.362 2.55641 105.207L51.9289 59.5L2.55641 13.7933C-0.852133 10.6378 -0.852133 5.52194 2.55641 2.36655C5.96481 -0.78885 11.491 -0.78885 14.8996 2.36655L70.4437 53.7867Z"
        fill={color}
      />
    </Svg>
  );
}

// Chat bubble icon for the "Message" button
function ChatIcon({ size = 18, color = '#F8F2EC' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"
        fill={color}
      />
    </Svg>
  );
}

function PolaroidCard({ post, onPress, rotation }: { post: Post; onPress?: () => void; rotation?: number }) {
  const imageUrl = resolveImageUrl(post.image_uri);
  return (
    <TouchableOpacity style={[profileStyles.polaroid, { transform: [{ rotate: `${rotation ?? 0}deg` }] }]} onPress={onPress} activeOpacity={0.85}>
      <View style={profileStyles.polaroidImageBox}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={profileStyles.polaroidImage} />
        ) : (
          <View style={profileStyles.polaroidPlaceholder}>
            <Text style={profileStyles.polaroidPlaceholderX}>×</Text>
          </View>
        )}
      </View>
      <Text style={profileStyles.polaroidCaption} numberOfLines={1}>{post.caption || ' '}</Text>
    </TouchableOpacity>
  );
}

function EmptyPolaroid({ rotation }: { rotation?: number }) {
  return (
    <View style={[profileStyles.polaroid, profileStyles.polaroidEmpty, { transform: [{ rotate: `${rotation ?? 0}deg` }] }]}>
      <View style={profileStyles.polaroidImageBox}>
        <View style={profileStyles.polaroidPlaceholder}>
          <Text style={profileStyles.polaroidPlaceholderX}>×</Text>
        </View>
      </View>
      <Text style={profileStyles.polaroidCaption}> </Text>
    </View>
  );
}

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
  const [fullUser, setFullUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [diaryOpen, setDiaryOpen] = useState(false);
  const [tilts, setTilts] = useState<number[]>([]);

  // Chat states
  const [chatFriend, setChatFriend] = useState<User | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatDraft, setChatDraft] = useState('');

  // Image viewer state (diary)
  const [focusedImageUri, setFocusedImageUri] = useState<string | null>(null);

  useEffect(() => {
    if (selectedUser?.id) {
      getUserById(selectedUser.id).then((u) => { if (u) setFullUser(u); }).catch(() => {});
      setPostsLoading(true);
      getUserPosts(selectedUser.id)
        .then(setPosts)
        .catch(() => setPosts([]))
        .finally(() => setPostsLoading(false));
    } else {
      setFullUser(null);
      setPosts([]);
    }
  }, [selectedUser?.id]);

  useEffect(() => {
    if (selectedUser) {
      setTilts(Array.from({ length: 3 }, () => (Math.random() - 0.5) * 10));
    }
  }, [selectedUser, posts]);

  // Load + poll conversation while chat modal is open
  useEffect(() => {
    if (!chatFriend?.id || !currentUser?.id) return;

    getConversation(currentUser.id, chatFriend.id).then(setChatMessages).catch(() => {});

    const interval = setInterval(() => {
      getConversation(currentUser.id!, chatFriend!.id).then(setChatMessages).catch(() => {});
    }, 3000);

    return () => clearInterval(interval);
  }, [chatFriend?.id, currentUser?.id]);

  const displayUser = fullUser ?? selectedUser;

  const handleUnfriendPress = () => {
    if (!selectedUser) return;
    Alert.alert('Unfriend', 'Are you sure you want to unfriend this person?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Unfriend', style: 'destructive', onPress: () => onUnfriend(selectedUser.id) },
    ]);
  };

  const openChat = () => {
    if (displayUser) setChatFriend(displayUser);
  };

  const closeChat = () => {
    setChatFriend(null);
    setChatMessages([]);
    setChatDraft('');
  };

  const handleChatSend = async () => {
    if (!currentUser || !chatFriend) return;
    const trimmed = chatDraft.trim();
    if (!trimmed) return;
    setChatDraft('');
    await sendMessage(currentUser.id, chatFriend.id, trimmed);
    const msgs = await getConversation(currentUser.id, chatFriend.id);
    setChatMessages(msgs);
  };

  const handleChatSendImage = async (localUri: string) => {
    if (!currentUser || !chatFriend) return;
    const url = await uploadImage(localUri);
    await sendMessage(currentUser.id, chatFriend.id, `[img]${url}`);
    const msgs = await getConversation(currentUser.id, chatFriend.id);
    setChatMessages(msgs);
  };

  let primaryAction: React.ReactNode = null;
  if (currentUser && selectedUser) {
    if (relationship === 'incoming') {
      const req = incomingRequests.find((r) => r.from_user_id === selectedUser.id);
      primaryAction = (
        <TouchableOpacity style={modalStyles.primaryBtn} onPress={() => req && onAcceptRequest(req.id)} activeOpacity={0.85}>
          <Text style={modalStyles.primaryBtnText}>Accept request</Text>
        </TouchableOpacity>
      );
    } else if (relationship === 'outgoing') {
      const req = outgoingRequests.find((r) => r.to_user_id === selectedUser.id);
      primaryAction = (
        <TouchableOpacity style={modalStyles.primaryBtn} onPress={() => req && onCancelRequest(req.id)} activeOpacity={0.85}>
          <Text style={modalStyles.primaryBtnText}>Cancel request</Text>
        </TouchableOpacity>
      );
    } else if (relationship === 'none') {
      primaryAction = (
        <TouchableOpacity style={modalStyles.primaryBtn} onPress={() => onSendRequest(selectedUser.id)} activeOpacity={0.85}>
          <Text style={modalStyles.primaryBtnText}>Send request</Text>
        </TouchableOpacity>
      );
    }
  }

  const avatarUri = displayUser?.avatar_url ? resolveImageUrl(displayUser.avatar_url) : null;
  const bannerUri = displayUser?.banner_url ? resolveImageUrl(displayUser.banner_url) : null;
  const diaryPreview = posts.slice(0, 3);
  const emptySlots = Math.max(0, 3 - diaryPreview.length);

  return (
    <Modal visible={selectedUser !== null} animationType="slide" onRequestClose={onClose}>
      <LinearGradient colors={[...GRADIENT_COLORS]} locations={[...GRADIENT_LOCATIONS]} style={{ flex: 1 }}>
        {selectedUser && (
          <ScrollView contentContainerStyle={profileStyles.scrollContent} showsVerticalScrollIndicator={false}>

            <View style={profileStyles.bannerSection}>
              <View style={profileStyles.bannerTouchable}>
                {bannerUri ? (
                  <Image source={{ uri: bannerUri }} style={profileStyles.bannerImage} />
                ) : (
                  <View style={profileStyles.bannerPlaceholder}>
                    <Text style={profileStyles.bannerPlaceholderText}>no cover photo</Text>
                  </View>
                )}
              </View>
              <View style={profileStyles.topBar}>
                <TouchableOpacity style={[profileStyles.editBtn, bannerUri && profileStyles.iconBtnOverBanner]} onPress={onClose} activeOpacity={0.7}>
                  <BackIcon size={22} color={bannerUri ? '#fff' : '#40312B'} />
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
              </View>
            </View>

            <View style={profileStyles.avatarWrap}>
              {avatarUri
                ? <Image source={{ uri: avatarUri }} style={profileStyles.avatarImage} />
                : <UserAvatar user={displayUser!} size={100} letterStyle={profileStyles.avatarLetter} />}
            </View>

            <Text style={profileStyles.displayName}>{displayUser?.display_name ?? ''}</Text>
            <Text style={profileStyles.username}>@{displayUser?.username}</Text>

            {displayUser?.bio ? (
              <View style={[profileStyles.bioPill, { marginHorizontal: 24 }]}>
                <Text style={profileStyles.bioPillText}>{displayUser.bio}</Text>
              </View>
            ) : (
              <View style={{ marginBottom: 14 }} />
            )}

            {relationship === 'friends' && (
              <View style={modalStyles.actionRow}>
                <TouchableOpacity style={modalStyles.chatBtn} onPress={openChat} activeOpacity={0.85}>
                  <ChatIcon size={18} color="#F8F2EC" />
                  <Text style={modalStyles.chatBtnText}>Message</Text>
                </TouchableOpacity>
                <TouchableOpacity style={modalStyles.iconPill} onPress={handleUnfriendPress} activeOpacity={0.85}>
                  <UnfriendIcon color="#F8F2EC" />
                </TouchableOpacity>
              </View>
            )}

            <View style={profileStyles.sectionRow}>
              <View style={profileStyles.sectionLine} />
              <TouchableOpacity style={profileStyles.sectionTitleRow} onPress={() => posts.length > 0 && setDiaryOpen(true)} activeOpacity={posts.length > 0 ? 0.7 : 1}>
                <Text style={profileStyles.sectionTitle}>DIARY</Text>
                {posts.length > 0 && <ForwardIcon size={13} color="#33261F" />}
              </TouchableOpacity>
              <View style={profileStyles.sectionLine} />
            </View>

            {postsLoading ? (
              <ActivityIndicator color="#888" style={{ marginVertical: 20 }} />
            ) : posts.length === 0 ? (
              <Text style={profileStyles.noMemoriesText}>has not made memories</Text>
            ) : (
              <View style={profileStyles.polaroidRow}>
                {diaryPreview.map((post, i) => (
                  <PolaroidCard key={post.id} post={post} onPress={() => setDiaryOpen(true)} rotation={tilts[i]} />
                ))}
                {Array.from({ length: emptySlots }).map((_, i) => (
                  <EmptyPolaroid key={`empty-${i}`} rotation={tilts[diaryPreview.length + i]} />
                ))}
              </View>
            )}

            {displayUser?.status ? (
              <>
                <View style={[profileStyles.sectionRow, { marginTop: 22 }]}>
                  <View style={profileStyles.sectionLine} />
                  <Text style={profileStyles.sectionTitle}>STATUS</Text>
                  <View style={profileStyles.sectionLine} />
                </View>

                <View style={profileStyles.statusCard}>
                  <Text style={profileStyles.statusCardText}>{displayUser.status}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={profileStyles.feelingChip}>
                      <Text style={profileStyles.feelingChipLabel}>feeling:</Text>
                      <Text style={[profileStyles.feelingChipEmoji, !displayUser?.feeling && { color: '#88888886' }]}>{displayUser?.feeling || '?'}</Text>
                    </View>
                    <View style={profileStyles.statusCardUser}>
                      <Text style={profileStyles.statusCardName}>{displayUser?.display_name}</Text>
                      {avatarUri
                        ? <Image source={{ uri: avatarUri }} style={profileStyles.statusCardAvatar} />
                        : <UserAvatar user={displayUser!} size={32} />}
                    </View>
                  </View>
                </View>
              </>
            ) : null}

            <View style={profileStyles.spotifyWrap}>
              {selectedUser?.id ? <SpotifyPlayer userId={selectedUser.id} /> : null}
            </View>

            {primaryAction && (
              <View style={{ marginTop: 20, marginHorizontal: 16 }}>
                {primaryAction}
              </View>
            )}

            <View style={{ height: 40 }} />

          </ScrollView>
        )}

        {/* Diary modal */}
        <Modal
          visible={diaryOpen}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => focusedImageUri ? setFocusedImageUri(null) : setDiaryOpen(false)}
        >
          <LinearGradient colors={[...GRADIENT_COLORS]} locations={[...GRADIENT_LOCATIONS]} style={{ flex: 1 }}>
            <View style={profileStyles.modalHeader}>
              <TouchableOpacity
                onPress={() => focusedImageUri ? setFocusedImageUri(null) : setDiaryOpen(false)}
                style={profileStyles.modalCloseBtn}
                hitSlop={12}
              >
                <BackIcon size={22} color="#33261F" />
              </TouchableOpacity>
              <View style={{ flex: 1 }} />
              <Text style={profileStyles.modalTitle}>DIARY</Text>
            </View>
            {postsLoading ? (
              <ActivityIndicator color="#888" style={{ marginTop: 40 }} />
            ) : (
              <FlatList
                data={posts}
                keyExtractor={p => String(p.id)}
                contentContainerStyle={modalStyles.diaryList}
                renderItem={({ item: post }) => (
                  <DiaryPostCard post={post} onImagePress={(uri) => setFocusedImageUri(uri)} />
                )}
              />
            )}

            {focusedImageUri && (
              <ImageViewer uri={focusedImageUri} onClose={() => setFocusedImageUri(null)} />
            )}
          </LinearGradient>
        </Modal>

        {/* Chat conversation modal */}
        <ChatConversationModal
          currentUser={currentUser}
          activeFriend={chatFriend}
          messages={chatMessages}
          draft={chatDraft}
          onDraftChange={setChatDraft}
          onSend={handleChatSend}
          onSendImage={handleChatSendImage}
          onClose={closeChat}
        />

      </LinearGradient>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  chatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#40312B',
    borderRadius: 22,
    paddingVertical: 11,
    paddingHorizontal: 28,
  },
  chatBtnText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: '#F8F2EC',
  },
  iconPill: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#40312B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtn: {
    backgroundColor: '#40312B',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryBtnText: {
    fontFamily: 'Nunito_700Bold',
    color: '#F8F2EC',
    fontSize: 16,
  },
  diaryList: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 16,
  },
});