import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { Post, deletePost, resolveImageUrl } from '@/lib/api';
import { timeAgo } from '@/lib/time';
import { UserAvatar } from '@/components/social/UserAvatar';
import { styles } from '@/styles/components/PostCard';

interface PostCardProps {
  post: Post;
  currentUserId: number;
  onDeleted: () => void;
  onPress?: () => void;
}

// Post card in the feed
export function PostCard({ post, currentUserId, onDeleted, onPress }: PostCardProps) {
  // Card width
  const { width } = useWindowDimensions();
  const cardMaxWidth = Math.min(width - 32, 680);
  const isLarge = width >= 600;

  // Post image
  const imageUrl = resolveImageUrl(post.image_uri);
  // Check if current user owns this post
  const isOwner = Number(post.user_id) === Number(currentUserId);
  const imageSource = imageUrl ? { uri: imageUrl } : undefined;

  // Delete post
  const handleDelete = () => {
    const doDelete = async () => {
      try {
        await deletePost(post.id, currentUserId);
        onDeleted();
      } catch (e) {
        console.error(e);
        Alert.alert('Delete failed', e instanceof Error ? e.message : 'Could not delete this post');
      }
    };

    // Confirm before deleting
    if (Platform.OS === 'web') {
      if (window.confirm('Delete this post?')) doDelete();
    } else {
      Alert.alert('Delete Post', 'Are you sure?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: doDelete },
      ]);
    }
  };

  return (
    <View style={styles.cardWrapper}>
      <TouchableOpacity
        onPress={onPress}
        disabled={!onPress}
        activeOpacity={0.85}
        style={[styles.card, { maxWidth: cardMaxWidth }]}
      >
        {/* Delete button */}
        {isOwner && (
          <TouchableOpacity
            onPress={handleDelete}
            style={styles.deleteBtn}
            hitSlop={16}
            activeOpacity={0.5}
          >
            <Text style={styles.deleteText}>×</Text>
          </TouchableOpacity>
        )}

        {/* User info */}
        <View style={styles.userRow}>
          <UserAvatar
            user={{ avatar_url: post.avatar_url, display_name: post.display_name || post.username || '?' }}
            size={52}
            style={styles.avatarSpacing}
            letterStyle={styles.avatarLetter}
          />
          <View style={styles.userInfo}>
            <Text style={[styles.userName, isLarge && styles.userNameLarge]}>{post.display_name}</Text>
            <Text style={styles.timestamp}>{timeAgo(post.created_at)}</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Post content */}
        <View style={[styles.body, !imageSource && styles.bodyWithoutImage]}>
          {post.caption ? <Text style={[styles.caption, isLarge && styles.captionLarge]} numberOfLines={2}>{post.caption}</Text> : null}
          {imageSource ? (
            <View style={styles.imageContainer}>
              <Image source={imageSource} style={styles.postImage} resizeMode="cover" />
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    </View>
  );
}


