// Tab bar icons
import { ChatsIcon, FeedIcon, FriendsIcon, PlusIcon, ProfileIcon } from '@/components/icons/TabIcons';
import { useNotifications } from '@/contexts/NotificationContext';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { DeviceEventEmitter, TouchableOpacity, View } from 'react-native';
import { styles } from '@/styles/tabs/layout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Custom bottom tab bar
function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  // Safe area padding
  const insets = useSafeAreaInsets();
  const router = useRouter();
  // Notification count
  const { unreadMessages, pendingFriendRequests } = useNotifications();

  const tabRoutes = state.routes;

  // Icons for tabs
  const icons: Record<string, (props: { color: string }) => React.JSX.Element> = {
    index: FeedIcon,
    chats: ChatsIcon,
    friends: FriendsIcon,
    profile: ProfileIcon,
  };

  // Render one tab button
  const renderTab = (route: typeof tabRoutes[0], index: number) => {
    const isFocused = state.index === index;
    const IconComponent = icons[route.name];
    const color = '#444444';

    // Tab press handling
    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });
      if (!isFocused && !event.defaultPrevented) {
        // Switch tab
        navigation.navigate(route.name);
      } else if (isFocused && route.name === 'index') {
        // Tap feed tab again -> scroll to top
        DeviceEventEmitter.emit('scrollFeedToTop');
      }
    };

    // Red dot if notifications
    const showDot =
      (route.name === 'chats' && unreadMessages > 0) ||
      (route.name === 'friends' && pendingFriendRequests > 0);

    return (
      <TouchableOpacity
        key={route.key}
        onPress={onPress}
        style={styles.tabButton}
        activeOpacity={0.7}
      >
        {/* Highlight circle */}
        <View style={[styles.tabIconCircle, isFocused && styles.tabIconCircleActive]}>
          <View style={styles.tabIconWrapper}>
            {IconComponent ? <IconComponent color={color} /> : null}
            {/* Notification dot */}
            {showDot && <View style={styles.tabBadgeDot} />}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Tab layout (left & right)
  const leftTabs = tabRoutes.slice(0, 2);
  const rightTabs = tabRoutes.slice(2);

  return (
    <View style={styles.tabBarOuter}>
      <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        <View style={styles.tabBarInner}>
          {/* Left tabs */}
          {leftTabs.map((route, i) => renderTab(route, i))}

          {/* Post button */}
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => router.push('/create-post')}
            activeOpacity={0.85}
          >
            <PlusIcon color="#444444" />
          </TouchableOpacity>

          {/* Right tabs */}
          {rightTabs.map((route, i) => renderTab(route, i + 2))}
        </View>
      </View>
    </View>
  );
}

// Tab layout
export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: 'transparent' },
      }}
    >
      {/* Tab screens */}
      <Tabs.Screen name="index" options={{ title: 'Feed' }} />
      <Tabs.Screen name="chats" options={{ title: 'Chats' }} />
      <Tabs.Screen name="friends" options={{ title: 'Friends' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}


