import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated,
  Dimensions,
  Image,
  DeviceEventEmitter,
  PanResponder,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { PostCard } from '@/components/PostCard';
import { StoryCircle } from '@/components/StoryCircle';
import { UserAvatar } from '@/components/social/UserAvatar';
import { useAuth } from '@/contexts/AuthContext';
import { getFeedPosts, Post, resolveImageUrl } from '@/lib/api';
import { timeAgo } from '@/lib/time';
import { styles } from '@/styles/tabs/feed';
import { GRADIENT_COLORS, GRADIENT_LOCATIONS } from '@/styles/global';

// Screen size
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Stories
const STORIES: Array<{ id: string; name: string }> = [
  { id: 'you', name: 'You' },
  { id: 'sude', name: 'Sude' },
  { id: 'faye', name: 'Faye' },
  { id: 'summer', name: 'Summe..' },
];

// Feed screen
export default function FeedScreen() {
  const { user } = useAuth();
  const router = useRouter();
  // Posts list
  const [posts, setPosts] = useState<Post[]>([]);
  // Refreshing
  const [refreshing, setRefreshing] = useState(false);
  // Reference to scroll to top
  const flatListRef = useRef<FlatList>(null);
  // Open post (null = closed)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  // Slide animation
  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  // Fullscreen image (null = closed)
  const [focusedImageUri, setFocusedImageUri] = useState<string | null>(null);

  // Swipe right to close
  const panResponder = useRef(
    PanResponder.create({
      // Only horizontal swipes
      onMoveShouldSetPanResponder: (_evt, gestureState) =>
        gestureState.dx > 15 && Math.abs(gestureState.dy) < Math.abs(gestureState.dx),
      // Follow finger
      onPanResponderMove: (_evt, gestureState) => {
        if (gestureState.dx > 0) slideAnim.setValue(gestureState.dx);
      },
      // Close or snap back
      onPanResponderRelease: (_evt, gestureState) => {
        if (gestureState.dx > SCREEN_WIDTH * 0.3 || gestureState.vx > 0.5) {
          Animated.timing(slideAnim, {
            toValue: SCREEN_WIDTH,
            duration: 200,
            useNativeDriver: true,
          }).start(() => setSelectedPost(null));
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            tension: 65,
            friction: 11,
          }).start();
        }
      },
    })
  ).current;

  // Load posts
  const loadPosts = useCallback(async () => {
    try {
      const data = await getFeedPosts();
      setPosts(data);
    } catch (e) {
      console.error('Failed to load posts:', e);
    }
  }, []);

  // Load on focus, clean up on leave
  useFocusEffect(
    useCallback(() => {
      loadPosts();
      return () => {
        // Close modals
        setSelectedPost(null);
        setFocusedImageUri(null);
        slideAnim.setValue(SCREEN_WIDTH);
      };
    }, [loadPosts]),
  );

  // Scroll to top when tab tapped again
  useEffect(() => {
    const sub = DeviceEventEmitter.addListener('scrollFeedToTop', () => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    });
    return () => sub.remove();
  }, []);

  // Pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  }, [loadPosts]);

  // Open post detail
  const openPost = (post: Post) => {
    setSelectedPost(post);
    slideAnim.setValue(SCREEN_WIDTH);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  };

  // Close post detail
  const closePost = () => {
    setFocusedImageUri(null);
    Animated.timing(slideAnim, {
      toValue: SCREEN_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setSelectedPost(null));
  };

  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  // Render header
  const renderHeader = () => (
    <View>
      <Text style={styles.title}>Feed</Text>

      {/* Story circles */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storiesContainer}
        style={styles.storiesRow}
      >
        {STORIES.map((s) => (
          <StoryCircle key={s.id} name={s.name} />
        ))}
      </ScrollView>
    </View>
  );

  return (
    <LinearGradient
      colors={[...GRADIENT_COLORS]}
      locations={[...GRADIENT_LOCATIONS]}
      style={styles.screen}
    >
      {/* Posts list */}
      <FlatList
        ref={flatListRef}
        data={posts}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            currentUserId={user?.id ?? 0}
            onDeleted={() => {
              // Remove deleted post
              setPosts((prev) => prev.filter((p) => p.id !== item.id));
            }}
            onPress={() => openPost(item)}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          // No posts
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No posts yet</Text>
            <Text style={styles.emptySubText}>
              Pull down to refresh or create a post!
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#444"
            colors={['#444']}
            progressBackgroundColor="#f1ede9"
            progressViewOffset={20}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Post detail modal */}
      <Modal visible={selectedPost !== null} transparent animationType="none" onRequestClose={focusedImageUri ? () => setFocusedImageUri(null) : closePost}>
        <View style={{ flex: 1 }}>
          {/* Slides in/out */}
          <Animated.View
            {...panResponder.panHandlers}
            style={[styles.detailOverlay, { transform: [{ translateX: slideAnim }] }]}
          >
            <LinearGradient
              colors={[...GRADIENT_COLORS]}
              locations={[...GRADIENT_LOCATIONS]}
              style={styles.detailGradient}
            >
              {/* Back button */}
              <View style={styles.detailHeader}>
                <TouchableOpacity onPress={closePost} style={styles.detailBackBtn} activeOpacity={0.7}>
                  <Svg width={12} height={20} viewBox="0 0 12 20" fill="none">
                    <Path d="M10 2L2 10L10 18" stroke="#444444" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                </TouchableOpacity>
              </View>
              {/* Post details */}
              {selectedPost && (
                <ScrollView style={styles.detailScroll} contentContainerStyle={styles.detailScrollContent} showsVerticalScrollIndicator={false}>
                  {/* Avatar, name, time */}
                  <View style={styles.detailUserRow}>
                    <UserAvatar
                      user={{ avatar_url: selectedPost.avatar_url, display_name: selectedPost.display_name || selectedPost.username || '?' }}
                      size={52}
                      style={styles.detailAvatarSpacing}
                      letterStyle={styles.detailAvatarLetter}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.detailUserName}>{selectedPost.display_name}</Text>
                      <Text style={styles.detailTimestamp}>{timeAgo(selectedPost.created_at)}</Text>
                    </View>
                  </View>

                  {/* Caption */}
                  {selectedPost.caption && (
                    <Text style={styles.detailCaption}>{selectedPost.caption}</Text>
                  )}

                  {/* Image, tap for fullscreen */}
                  {selectedPost.image_uri && (
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => setFocusedImageUri(resolveImageUrl(selectedPost.image_uri)!)}
                    >
                      <View style={styles.detailImageContainer}>
                        <Image
                          source={{ uri: resolveImageUrl(selectedPost.image_uri)! }}
                          style={styles.detailImage}
                          resizeMode="cover"
                        />
                      </View>
                    </TouchableOpacity>
                  )}
                </ScrollView>
              )}
            </LinearGradient>
          </Animated.View>

          {/* Fullscreen image viewer */}
          {focusedImageUri && (
            <View style={[StyleSheet.absoluteFill, styles.imageViewerOverlay]}>
              <StatusBar barStyle="light-content" />
              {/* Close button */}
              <TouchableOpacity
                style={styles.imageViewerClose}
                onPress={() => setFocusedImageUri(null)}
                activeOpacity={0.7}
              >
                <Text style={styles.imageViewerCloseText}>✕</Text>
              </TouchableOpacity>
              {/* Fullscreen image */}
              <Image
                source={{ uri: focusedImageUri }}
                style={{ width: windowWidth, height: windowHeight }}
                resizeMode="contain"
              />
            </View>
          )}
        </View>
      </Modal>
    </LinearGradient>
  );
}

