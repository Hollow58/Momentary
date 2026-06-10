import { useAuth } from '@/contexts/AuthContext';
import { UserAvatar } from '@/components/social/UserAvatar';
import { SpotifyPlayer } from '@/components/social/SpotifyPlayer';
import { resolveImageUrl } from '@/lib/api';
import { LinearGradient } from 'expo-linear-gradient';
// Pick image from gallery
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { styles } from '@/styles/tabs/profile';
import { GRADIENT_COLORS, GRADIENT_LOCATIONS } from '@/styles/global';

// Spotify base URL
const SPOTIFY_BASE = 'https://102722.stu.sd-lab.nl/spotify';

// Profile screen
export default function ProfileScreen() {
  // User and auth actions
  const { user, logout, updateUser, updateAvatar, removeAvatar } = useAuth();

  // Edit mode
  const [editing, setEditing] = useState(false);
  // Editable fields
  const [displayName, setDisplayName] = useState(user?.display_name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  // Saving in progress
  const [saving, setSaving] = useState(false);
  // Spotify connected (null = checking)
  const [spotifyConnected, setSpotifyConnected] = useState<boolean | null>(null);

  // Check Spotify status
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

  // Check on load
  useEffect(() => {
    checkSpotifyStatus();
  }, [checkSpotifyStatus]);

  // Connect Spotify
  const handleConnectSpotify = () => {
    if (!user?.id) return;
    Linking.openURL(`${SPOTIFY_BASE}/login.php?user_id=${user.id}`);
  };

  // Disconnect Spotify
  const handleDisconnectSpotify = async () => {
    if (!user?.id) return;
    try {
      await fetch(`${SPOTIFY_BASE}/api.php?action=logout&user_id=${user.id}`);
      setSpotifyConnected(false);
    } catch {}
  };

  // Start editing
  const startEditing = () => {
    setDisplayName(user?.display_name ?? '');
    setEmail(user?.email ?? '');
    setEditing(true);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditing(false);
  };

  // Save profile
  const handleSave = async () => {
    if (!displayName.trim()) {
      Alert.alert('Error', 'Display name cannot be empty');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Email cannot be empty');
      return;
    }
    setSaving(true);
    try {
      // Send to server
      await updateUser({ display_name: displayName.trim(), email: email.trim() });
      setEditing(false);
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  // Pick avatar
  const handlePickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    // User cancelled
    if (result.canceled || !result.assets[0]) return;

    setSaving(true);
    try {
      // Upload avatar
      await updateAvatar(result.assets[0].uri);
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Failed to upload avatar');
    } finally {
      setSaving(false);
    }
  };

  // Remove avatar
  const handleRemoveAvatar = async () => {
    const doRemove = async () => {
      setSaving(true);
      try {
        await removeAvatar();
      } catch (e: any) {
        Alert.alert('Error', e.message ?? 'Failed to remove avatar');
      } finally {
        setSaving(false);
      }
    };

    // Confirm removal
    if (Platform.OS === 'web') {
      if (window.confirm('Remove your profile picture?')) doRemove();
    } else {
      Alert.alert('Remove Avatar', 'Remove your profile picture?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: doRemove },
      ]);
    }
  };

  // Avatar URL
  const avatarUri = user?.avatar_url ? resolveImageUrl(user.avatar_url) : null;

  const avatarElement = avatarUri
    ? <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
    : <UserAvatar user={user ?? { avatar_url: null, display_name: '?' }} size={90} style={styles.avatarCircle} letterStyle={styles.avatarLetter} />;

  return (
    // Move screen up when keyboard opens (iOS only)
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Background gradient */}
      <LinearGradient
        colors={[...GRADIENT_COLORS]}
        locations={[...GRADIENT_LOCATIONS]}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Profile</Text>

          {/* Profile card */}
          <View style={styles.card}>
            {/* Avatar */}
            {editing ? (
              <TouchableOpacity onPress={handlePickAvatar} activeOpacity={0.8} disabled={saving}>
                {avatarElement}
                <View style={styles.avatarBadge}>
                  <Text style={styles.avatarBadgeText}>Edit</Text>
                </View>
              </TouchableOpacity>
            ) : (
              avatarElement
            )}
            {/* Remove photo */}
            {editing && avatarUri ? (
              <TouchableOpacity onPress={handleRemoveAvatar} activeOpacity={0.8} disabled={saving} style={styles.removeAvatarBtn}>
                <Text style={styles.removeAvatarText}>Remove photo</Text>
              </TouchableOpacity>
            ) : null}

            {/* Edit mode */}
            {editing ? (
              <>
                <Text style={styles.fieldLabel}>Display Name</Text>
                <TextInput
                  style={styles.input}
                  value={displayName}
                  onChangeText={setDisplayName}
                  placeholder="Display name"
                  placeholderTextColor="#9B8E80"
                  autoCapitalize="words"
                />
                <Text style={styles.fieldLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email"
                  placeholderTextColor="#9B8E80"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                {/* Spotify button */}
                <Text style={styles.fieldLabel}>Spotify</Text>
                {spotifyConnected ? (
                  <TouchableOpacity style={styles.spotifyDisconnectButton} onPress={handleDisconnectSpotify} activeOpacity={0.8}>
                    <Text style={styles.spotifyDisconnectText}>Disconnect Spotify</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.spotifyConnectButton} onPress={handleConnectSpotify} activeOpacity={0.8}>
                    <Text style={styles.spotifyConnectText}>Connect Spotify</Text>
                  </TouchableOpacity>
                )}

                {/* Cancel and Save */}
                <View style={styles.editActions}>
                  <TouchableOpacity style={styles.cancelButton} onPress={cancelEditing} activeOpacity={0.8}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.8} disabled={saving}>
                    {saving ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.saveButtonText}>Save</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              // View mode
              <>
                <Text style={styles.name}>{user?.display_name}</Text>
                <Text style={styles.username}>@{user?.username}</Text>
                <Text style={styles.email}>{user?.email}</Text>
                <TouchableOpacity style={styles.editButton} onPress={startEditing} activeOpacity={0.8}>
                  <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Saving spinner */}
          {saving && (
            <View style={styles.savingOverlay}>
              <ActivityIndicator color="#40312B" size="small" />
              <Text style={styles.savingText}>Saving...</Text>
            </View>
          )}

          {/* Spotify now playing */}
          {user?.id ? <SpotifyPlayer userId={user.id} /> : null}

          {/* Sign out */}
          <TouchableOpacity style={styles.logoutButton} onPress={logout} activeOpacity={0.8}>
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}


