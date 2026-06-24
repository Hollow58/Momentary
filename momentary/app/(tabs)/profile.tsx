import { ImageViewer } from '@/components/ImageViewer';
import { DiaryPostCard } from '@/components/social/DiaryPostCard';
import { SpotifyPlayer } from '@/components/social/SpotifyPlayer';
import { UserAvatar } from '@/components/social/UserAvatar';
import { useAuth } from '@/contexts/AuthContext';
import { getUserPosts, Post, resolveImageUrl } from '@/lib/api';
import { GRADIENT_COLORS, GRADIENT_LOCATIONS } from '@/styles/global';
import { styles } from '@/styles/tabs/profile';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

const SPOTIFY_BASE = process.env.EXPO_PUBLIC_SPOTIFY_BASE;



function SettingsIcon({ size = 24, color = '#40312B' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M9.2502 22L8.8502 18.8C8.63353 18.7167 8.42936 18.6167 8.2377 18.5C8.04603 18.3833 7.85853 18.2583 7.6752 18.125L4.7002 19.375L1.9502 14.625L4.5252 12.675C4.50853 12.5583 4.5002 12.4458 4.5002 12.3375V11.6625C4.5002 11.5542 4.50853 11.4417 4.5252 11.325L1.9502 9.375L4.7002 4.625L7.6752 5.875C7.85853 5.74167 8.0502 5.61667 8.2502 5.5C8.4502 5.38333 8.6502 5.28333 8.8502 5.2L9.2502 2H14.7502L15.1502 5.2C15.3669 5.28333 15.571 5.38333 15.7627 5.5C15.9544 5.61667 16.1419 5.74167 16.3252 5.875L19.3002 4.625L22.0502 9.375L19.4752 11.325C19.4919 11.4417 19.5002 11.5542 19.5002 11.6625V12.3375C19.5002 12.4458 19.4835 12.5583 19.4502 12.675L22.0252 14.625L19.2752 19.375L16.3252 18.125C16.1419 18.2583 15.9502 18.3833 15.7502 18.5C15.5502 18.6167 15.3502 18.7167 15.1502 18.8L14.7502 22H9.2502ZM12.0502 15.5C13.0169 15.5 13.8419 15.1583 14.5252 14.475C15.2085 13.7917 15.5502 12.9667 15.5502 12C15.5502 11.0333 15.2085 10.2083 14.5252 9.525C13.8419 8.84167 13.0169 8.5 12.0502 8.5C11.0669 8.5 10.2377 8.84167 9.5627 9.525C8.8877 10.2083 8.5502 11.0333 8.5502 12C8.5502 12.9667 8.8877 13.7917 9.5627 14.475C10.2377 15.1583 11.0669 15.5 12.0502 15.5Z"
        fill={color}
      />
    </Svg>
  );
}

function EditIcon({ size = 24, color = '#40312B' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M5 19H6.425L16.2 9.225L14.775 7.8L5 17.575V19ZM3 21V16.75L16.2 3.575C16.4 3.39167 16.6208 3.25 16.8625 3.15C17.1042 3.05 17.3583 3 17.625 3C17.8917 3 18.15 3.05 18.4 3.15C18.65 3.25 18.8667 3.4 19.05 3.6L20.425 5C20.625 5.18333 20.7708 5.4 20.8625 5.65C20.9542 5.9 21 6.15 21 6.4C21 6.66667 20.9542 6.92083 20.8625 7.1625C20.7708 7.40417 20.625 7.625 20.425 7.825L7.25 21H3ZM15.475 8.525L14.775 7.8L16.2 9.225L15.475 8.525Z"
        fill={color}
      />
    </Svg>
  );
}

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

// Single polaroid card
function PolaroidCard({ post, onPress, rotation }: { post: Post; onPress?: () => void; rotation?: number }) {
  const imageUrl = resolveImageUrl(post.image_uri);
  return (
    <TouchableOpacity style={[styles.polaroid, { transform: [{ rotate: `${rotation ?? 0}deg` }] }]} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.polaroidImageBox}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.polaroidImage} />
        ) : (
          <View style={styles.polaroidPlaceholder}>
            <Text style={styles.polaroidPlaceholderX}>×</Text>
          </View>
        )}
      </View>
      <Text style={styles.polaroidCaption} numberOfLines={1}>{post.caption || ' '}</Text>
    </TouchableOpacity>
  );
}

// Empty polaroid slot
function EmptyPolaroid({ rotation }: { rotation?: number }) {
  return (
    <View style={[styles.polaroid, styles.polaroidEmpty, { transform: [{ rotate: `${rotation ?? 0}deg` }] }]}>
      <View style={styles.polaroidImageBox}>
        <View style={styles.polaroidPlaceholder}>
          <Text style={styles.polaroidPlaceholderX}>×</Text>
        </View>
      </View>
      <Text style={styles.polaroidCaption}> </Text>
    </View>
  );
}

export default function ProfileScreen() {
  const { user, logout, updateUser, updateAvatar, removeAvatar, updateBanner, removeBanner } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [spotifyConnected, setSpotifyConnected] = useState<boolean | null>(null);

  // Modal states
  const [editOpen, setEditOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [diaryOpen, setDiaryOpen] = useState(false);
  const [focusedImageUri, setFocusedImageUri] = useState<string | null>(null);

  // Editable fields
  const [displayName, setDisplayName] = useState(user?.display_name ?? '');
  const [bioText, setBioText] = useState(user?.bio ?? '');
  const [statusText, setStatusText] = useState(user?.status ?? '');
  const [feeling, setFeeling] = useState(user?.feeling ?? '');

  useEffect(() => {
    setDisplayName(user?.display_name ?? '');
    setBioText(user?.bio ?? '');
    setStatusText(user?.status ?? '');
    setFeeling(user?.feeling ?? '');
  }, [user]);

  const loadPosts = useCallback(async () => {
    if (!user?.id) return;
    setPostsLoading(true);
    try {
      const data = await getUserPosts(user.id);
      setPosts(data);
    } catch {
      setPosts([]);
    } finally {
      setPostsLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(useCallback(() => { loadPosts(); }, [loadPosts]));

  const checkSpotifyStatus = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${SPOTIFY_BASE}/api.php?action=status&user_id=${user.id}`);
      const data = await res.json();
      setSpotifyConnected(data.authenticated === true);
    } catch {
      setSpotifyConnected(false);
    }
  }, [user?.id]);

  useEffect(() => { checkSpotifyStatus(); }, [checkSpotifyStatus]);

  const handleConnectSpotify = () => {
    if (!user?.id) return;
    Linking.openURL(`${SPOTIFY_BASE}/login.php?user_id=${user.id}`);
  };

  const handleDisconnectSpotify = async () => {
    if (!user?.id) return;
    try { await fetch(`${SPOTIFY_BASE}/api.php?action=logout&user_id=${user.id}`); setSpotifyConnected(false); } catch {}
  };

  const handlePickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled || !result.assets[0]) return;
    setSaving(true);
    try { await updateAvatar(result.assets[0].uri); }
    catch (e: any) { Alert.alert('Error', e.message ?? 'Failed to upload avatar'); }
    finally { setSaving(false); }
  };

  const handlePickBanner = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 5],
      quality: 0.85,
    });
    if (result.canceled || !result.assets[0]) return;
    setSaving(true);
    try { await updateBanner(result.assets[0].uri); }
    catch (e: any) { Alert.alert('Error', e.message ?? 'Failed to upload banner'); }
    finally { setSaving(false); }
  };

  const handleRemoveBanner = async () => {
    const doRemove = async () => {
      setSaving(true);
      try { await removeBanner(); }
      catch (e: any) { Alert.alert('Error', e.message ?? 'Failed to remove banner'); }
      finally { setSaving(false); }
    };
    if (Platform.OS === 'web') {
      if (window.confirm('Remove your cover photo?')) doRemove();
    } else {
      Alert.alert('Remove Cover', 'Remove your cover photo?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: doRemove },
      ]);
    }
  };

  const handleRemoveAvatar = async () => {
    const doRemove = async () => {
      setSaving(true);
      try { await removeAvatar(); }
      catch (e: any) { Alert.alert('Error', e.message ?? 'Failed to remove avatar'); }
      finally { setSaving(false); }
    };
    if (Platform.OS === 'web') {
      if (window.confirm('Remove your profile picture?')) doRemove();
    } else {
      Alert.alert('Remove Avatar', 'Remove your profile picture?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: doRemove },
      ]);
    }
  };

  const handleSaveEdit = async () => {
    if (!displayName.trim()) { Alert.alert('Error', 'Display name cannot be empty'); return; }
    setSaving(true);
    try {
      await updateUser({ display_name: displayName.trim(), bio: bioText.trim() || null });
      setEditOpen(false);
    } catch (e: any) { Alert.alert('Error', e.message ?? 'Failed to save'); }
    finally { setSaving(false); }
  };

  const handleSaveStatus = async () => {
    setSaving(true);
    try { await updateUser({ status: statusText.trim() || null, feeling: feeling.trim() || null }); setStatusOpen(false); }
    catch (e: any) { Alert.alert('Error', e.message ?? 'Failed to save'); }
    finally { setSaving(false); }
  };

  const avatarUri = user?.avatar_url ? resolveImageUrl(user.avatar_url) : null;
  const bannerUri = user?.banner_url ? resolveImageUrl(user.banner_url) : null;
  const diaryPreview = posts.slice(0, 3);
  const emptySlots = Math.max(0, 3 - diaryPreview.length);

  // Random tilts regenerated each time posts load
  const [tilts, setTilts] = useState<number[]>([]);
  useEffect(() => {
    setTilts(Array.from({ length: 3 }, () => (Math.random() - 0.5) * 10));
  }, [posts]);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={[...GRADIENT_COLORS]} locations={[...GRADIENT_LOCATIONS]} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Banner + topBar overlay */}
          <View style={styles.bannerSection}>
            <TouchableOpacity onPress={handlePickBanner} activeOpacity={0.85} style={styles.bannerTouchable} disabled={saving}>
              {bannerUri ? (
                <Image source={{ uri: bannerUri }} style={styles.bannerImage} />
              ) : (
                <View style={styles.bannerPlaceholder}>
                  <Text style={styles.bannerPlaceholderText}>tap to add a cover photo</Text>
                </View>
              )}
            </TouchableOpacity>
            <View style={styles.topBar}>
              <View style={{ flex: 1 }} />
              <TouchableOpacity style={[styles.editBtn, bannerUri && styles.iconBtnOverBanner]} onPress={() => setEditOpen(true)} activeOpacity={0.7}>
                <EditIcon size={22} color={bannerUri ? '#fff' : '#40312B'} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.settingsBtn, bannerUri && styles.iconBtnOverBanner]} onPress={() => setSettingsOpen(true)} activeOpacity={0.7}>
                <SettingsIcon size={22} color={bannerUri ? '#fff' : '#40312B'} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.avatarWrap} onPress={handlePickAvatar} activeOpacity={0.85} disabled={saving}>
            {avatarUri
              ? <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
              : <UserAvatar user={user ?? { avatar_url: null, display_name: '?' }} size={100} letterStyle={styles.avatarLetter} />}
            {saving && <ActivityIndicator style={styles.avatarSaving} color="#40312B" />}
          </TouchableOpacity>

          <Text style={styles.displayName}>{user?.display_name ?? ''}</Text>
          <Text style={styles.username}>@{user?.username}</Text>

          <TouchableOpacity style={styles.bioPill} onPress={() => setEditOpen(true)} activeOpacity={0.8}>
            <Text style={styles.bioPillText}>{user?.bio ? user.bio : 'Tap to add a bio...'}</Text>
          </TouchableOpacity>

          <View style={styles.sectionRow}>
            <View style={styles.sectionLine} />
            <TouchableOpacity style={styles.sectionTitleRow} onPress={() => setDiaryOpen(true)} activeOpacity={0.7}>
              <Text style={styles.sectionTitle}>DIARY</Text>
              <ForwardIcon size={13} color="#33261F" />
            </TouchableOpacity>
            <View style={styles.sectionLine} />
          </View>

          {/* Polaroid grid – centered, max 3 */}
          {postsLoading ? (
            <ActivityIndicator color="#888" style={{ marginVertical: 20 }} />
          ) : posts.length === 0 ? (
            <Text style={styles.noMemoriesText}>has not made memories</Text>
          ) : (
            <View style={styles.polaroidRow}>
              {diaryPreview.map((post, i) => (
                <PolaroidCard key={post.id} post={post} onPress={() => setDiaryOpen(true)} rotation={tilts[i]} />
              ))}
              {Array.from({ length: emptySlots }).map((_, i) => (
                <EmptyPolaroid key={`empty-${i}`} rotation={tilts[diaryPreview.length + i]} />
              ))}
            </View>
          )}

          <View style={[styles.sectionRow, { marginTop: 22 }]}>
            <View style={styles.sectionLine} />
            <Text style={styles.sectionTitle}>STATUS</Text>
            <View style={styles.sectionLine} />
          </View>

          {/* Victorious-style status card */}
          <TouchableOpacity style={styles.statusCard} onPress={() => setStatusOpen(true)} activeOpacity={0.88}>
            <Text style={[styles.statusCardText, !user?.status && styles.statusCardPlaceholder]}>
              {user?.status || "What's on your mind?"}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={styles.feelingChip}>
                <Text style={styles.feelingChipLabel}>feeling:</Text>
                <Text style={[styles.feelingChipEmoji, !user?.feeling && { color: '#88888886' }]}>{user?.feeling || '?'}</Text>
              </View>
              <View style={styles.statusCardUser}>
                <Text style={styles.statusCardName}>{user?.display_name}</Text>
                {avatarUri
                  ? <Image source={{ uri: avatarUri }} style={styles.statusCardAvatar} />
                  : <UserAvatar user={user ?? { avatar_url: null, display_name: '?' }} size={32} />}
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.spotifyWrap}>
            {user?.id ? <SpotifyPlayer userId={user.id} /> : null}
          </View>

        </ScrollView>

        <Modal
          visible={diaryOpen}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => focusedImageUri ? setFocusedImageUri(null) : setDiaryOpen(false)}
        >
          <LinearGradient colors={[...GRADIENT_COLORS]} locations={[...GRADIENT_LOCATIONS]} style={{ flex: 1 }}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => focusedImageUri ? setFocusedImageUri(null) : setDiaryOpen(false)}
                style={styles.modalCloseBtn}
                hitSlop={12}
              >
                <BackIcon size={22} color="#33261F" />
              </TouchableOpacity>
              <View style={{ flex: 1 }} />
              <Text style={styles.modalTitle}>DIARY</Text>
            </View>
            {postsLoading ? (
              <ActivityIndicator color="#888" style={{ marginTop: 40 }} />
            ) : posts.length === 0 ? (
              <Text style={styles.emptyText}>has not made memories</Text>
            ) : (
              <FlatList
                data={posts}
                keyExtractor={p => String(p.id)}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40, gap: 16 }}
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

        <Modal visible={statusOpen} animationType="slide" transparent onRequestClose={() => setStatusOpen(false)}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <View style={styles.sheetOverlay}>
              <View style={styles.sheet}>
                <Text style={styles.sheetTitle}>Status</Text>
                <TextInput
                  style={styles.sheetInput}
                  value={statusText}
                  onChangeText={setStatusText}
                  placeholder="What's on your mind?"
                  placeholderTextColor="#9B8E80"
                  multiline
                  maxLength={200}
                  autoFocus
                />
                <Text style={styles.sheetLabel}>Feeling</Text>
                <TextInput
                  style={[styles.sheetInput, styles.sheetInputSingle]}
                  value={feeling}
                  onChangeText={setFeeling}
                  placeholder="e.g. happy, 😊..."
                  placeholderTextColor="#9B8E80"
                  maxLength={50}
                />
                <View style={styles.sheetActions}>
                  <TouchableOpacity style={styles.cancelButton} onPress={() => { setStatusText(user?.status ?? ''); setFeeling(user?.feeling ?? ''); setStatusOpen(false); }} activeOpacity={0.8}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveButton} onPress={handleSaveStatus} activeOpacity={0.8} disabled={saving}>
                    {saving ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.saveButtonText}>Save</Text>}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        <Modal visible={editOpen} animationType="slide" transparent onRequestClose={() => setEditOpen(false)}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <View style={styles.sheetOverlay}>
              <ScrollView style={styles.settingsSheet} contentContainerStyle={styles.settingsSheetContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                <View style={styles.sheetHeader}>
                  <TouchableOpacity onPress={() => { setDisplayName(user?.display_name ?? ''); setBioText(user?.bio ?? ''); setEditOpen(false); }} style={styles.modalCloseBtn} hitSlop={12}>
                    <BackIcon size={22} color="#33261F" />
                  </TouchableOpacity>
                  <Text style={styles.sheetHeaderTitle}>Edit Profile</Text>
                </View>

                <Text style={styles.sheetLabel}>Profile Picture</Text>
                <View style={styles.settingsAvatarRow}>
                  <TouchableOpacity onPress={handlePickAvatar} activeOpacity={0.8} style={styles.settingsAvatarBtn}>
                    {avatarUri
                      ? <Image source={{ uri: avatarUri }} style={styles.settingsAvatarImg} />
                      : <UserAvatar user={user ?? { avatar_url: null, display_name: '?' }} size={56} />}
                    <View style={styles.settingsAvatarBadge}><Text style={styles.settingsAvatarBadgeText}>edit</Text></View>
                  </TouchableOpacity>
                  {avatarUri ? (
                    <TouchableOpacity style={styles.removeAvatarBtn} onPress={() => { setEditOpen(false); handleRemoveAvatar(); }} activeOpacity={0.8}>
                      <Text style={styles.removeAvatarText}>Remove photo</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>

                <Text style={styles.sheetLabel}>Cover Photo</Text>
                <View style={styles.settingsAvatarRow}>
                  <TouchableOpacity onPress={handlePickBanner} activeOpacity={0.8} style={styles.settingsAvatarBtn}>
                    {bannerUri
                      ? <Image source={{ uri: bannerUri }} style={styles.settingsBannerThumb} />
                      : <View style={styles.settingsBannerThumbEmpty}><Text style={{ fontSize: 20, color: 'rgba(64,49,43,0.35)' }}>+</Text></View>}
                    <View style={styles.settingsAvatarBadge}><Text style={styles.settingsAvatarBadgeText}>edit</Text></View>
                  </TouchableOpacity>
                  {bannerUri ? (
                    <TouchableOpacity style={styles.removeAvatarBtn} onPress={() => { setEditOpen(false); handleRemoveBanner(); }} activeOpacity={0.8}>
                      <Text style={styles.removeAvatarText}>Remove cover</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>

                <Text style={styles.sheetLabel}>Display Name</Text>
                <TextInput
                  style={[styles.sheetInput, styles.sheetInputSingle]}
                  value={displayName}
                  onChangeText={setDisplayName}
                  placeholder="Display name"
                  placeholderTextColor="#9B8E80"
                  autoCapitalize="words"
                />

                <Text style={styles.sheetLabel}>Bio</Text>
                <TextInput
                  style={styles.sheetInput}
                  value={bioText}
                  onChangeText={setBioText}
                  placeholder="Write something about yourself..."
                  placeholderTextColor="#9B8E80"
                  multiline
                  maxLength={160}
                />
                <Text style={styles.charCount}>{bioText.length}/160</Text>

                <View style={styles.sheetActions}>
                  <TouchableOpacity style={styles.saveButton} onPress={handleSaveEdit} activeOpacity={0.8} disabled={saving}>
                    {saving ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.saveButtonText}>Save</Text>}
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        <Modal visible={settingsOpen} animationType="slide" transparent onRequestClose={() => setSettingsOpen(false)}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <View style={styles.sheetOverlay}>
              <ScrollView style={styles.settingsSheet} contentContainerStyle={styles.settingsSheetContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                <View style={styles.sheetHeader}>
                  <TouchableOpacity onPress={() => setSettingsOpen(false)} style={styles.modalCloseBtn} hitSlop={12}>
                    <BackIcon size={22} color="#33261F" />
                  </TouchableOpacity>
                  <Text style={styles.sheetHeaderTitle}>Settings</Text>
                </View>

                <Text style={styles.sheetLabel}>Spotify</Text>
                {spotifyConnected ? (
                  <TouchableOpacity style={styles.spotifyDisconnectButton} onPress={handleDisconnectSpotify} activeOpacity={0.8}>
                    <Text style={styles.spotifyDisconnectText}>Disconnect Spotify</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.spotifyConnectButton} onPress={handleConnectSpotify} activeOpacity={0.8}>
                    <Text style={styles.spotifyConnectText}>Connect Spotify</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.logoutButton} onPress={logout} activeOpacity={0.8}>
                  <Text style={styles.logoutText}>Sign Out</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>

      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
