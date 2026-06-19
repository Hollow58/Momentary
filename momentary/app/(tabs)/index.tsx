import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Platform,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated,
  Dimensions,
  Image,
  DeviceEventEmitter,
  PanResponder,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { PostCard } from '@/components/PostCard';
import { UserAvatar } from '@/components/social/UserAvatar';
import { useAuth } from '@/contexts/AuthContext';
import { getFeedPosts, Post, resolveImageUrl } from '@/lib/api';
import { timeAgo } from '@/lib/time';
import { styles } from '@/styles/tabs/feed';
import { GRADIENT_COLORS, GRADIENT_LOCATIONS } from '@/styles/global';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function FeedScreen() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const [focusedImageUri, setFocusedImageUri] = useState<string | null>(null);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_evt, gestureState) =>
        gestureState.dx > 15 && Math.abs(gestureState.dy) < Math.abs(gestureState.dx),
      onPanResponderMove: (_evt, gestureState) => {
        if (gestureState.dx > 0) slideAnim.setValue(gestureState.dx);
      },
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

  const loadPosts = useCallback(async () => {
    try {
      const data = await getFeedPosts();
      setPosts(data);
    } catch (e) {
      console.error('Failed to load posts:', e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPosts();
      return () => {
        setSelectedPost(null);
        setFocusedImageUri(null);
        slideAnim.setValue(SCREEN_WIDTH);
      };
    }, [loadPosts, slideAnim]),
  );

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener('scrollFeedToTop', () => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    });
    return () => sub.remove();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  }, [loadPosts]);

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

  const closePost = () => {
    setFocusedImageUri(null);
    Animated.timing(slideAnim, {
      toValue: SCREEN_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setSelectedPost(null));
  };

  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const renderHeader = () => (
    <View>
      <Text style={styles.title}>Feed</Text>
    </View>
  );

  return (
    <LinearGradient
      colors={[...GRADIENT_COLORS]}
      locations={[...GRADIENT_LOCATIONS]}
      style={styles.screen}
    >
      <FlatList
        ref={flatListRef}
        data={posts}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            currentUserId={user?.id ?? 0}
            onDeleted={() => setPosts((prev) => prev.filter((p) => p.id !== item.id))}
            onPress={() => openPost(item)}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No posts yet</Text>
            <Text style={styles.emptySubText}>
              Pull down to refresh or create a post!
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        refreshControl={
          Platform.OS === 'web' ? undefined : (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#444"
              colors={['#444']}
              progressBackgroundColor="#f1ede9"
              progressViewOffset={20}
            />
          )
        }
        showsVerticalScrollIndicator={false}
      />

      <Modal
        visible={selectedPost !== null}
        transparent
        animationType="none"
        onRequestClose={focusedImageUri ? () => setFocusedImageUri(null) : closePost}
      >
        <View style={{ flex: 1 }}>
          <Animated.View
            {...panResponder.panHandlers}
            style={[styles.detailOverlay, { transform: [{ translateX: slideAnim }] }]}
          >
            <LinearGradient
              colors={[...GRADIENT_COLORS]}
              locations={[...GRADIENT_LOCATIONS]}
              style={styles.detailGradient}
            >
              <View style={styles.detailHeader}>
                <TouchableOpacity onPress={closePost} style={styles.detailBackBtn} activeOpacity={0.7}>
                  <Svg width={12} height={20} viewBox="0 0 12 20" fill="none">
                    <Path d="M10 2L2 10L10 18" stroke="#444444" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                </TouchableOpacity>
              </View>

              {selectedPost && (
                <ScrollView
                  style={styles.detailScroll}
                  contentContainerStyle={styles.detailScrollContent}
                  showsVerticalScrollIndicator={false}
                >
                  <View style={styles.detailUserRow}>
                    <UserAvatar
                      user={{
                        avatar_url: selectedPost.avatar_url,
                        display_name: String(selectedPost.display_name || selectedPost.username || '?'),
                      }}
                      size={52}
                      style={styles.detailAvatarSpacing}
                      letterStyle={styles.detailAvatarLetter}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.detailUserName}>
                        {String(selectedPost.display_name ?? '')}
                      </Text>
                      <Text style={styles.detailTimestamp}>
                        {String(timeAgo(selectedPost.created_at ?? ''))}
                      </Text>
                    </View>
                  </View>

                  {!!selectedPost.caption?.trim() && (
                    <Text style={styles.detailCaption}>
                      {String(selectedPost.caption)}
                    </Text>
                  )}

                  {!!selectedPost.image_uri && (
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => {
                        const uri = resolveImageUrl(selectedPost.image_uri);
                        if (uri) setFocusedImageUri(uri);
                      }}
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

          {!!focusedImageUri && (
            <View style={[StyleSheet.absoluteFill, styles.imageViewerOverlay]}>
              <TouchableOpacity
                style={styles.imageViewerClose}
                onPress={() => setFocusedImageUri(null)}
                activeOpacity={0.7}
              >
                <Text style={styles.imageViewerCloseText}>✕</Text>
              </TouchableOpacity>
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