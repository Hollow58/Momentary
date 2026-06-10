import React from 'react';
import { Image, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { resolveImageUrl, type User } from '@/lib/api';
import { styles } from '@/styles/components/UserAvatar';

type UserAvatarProps = {
  user: Pick<User, 'avatar_url' | 'display_name'>;
  size: number;
  style?: StyleProp<ViewStyle>;
  letterStyle?: StyleProp<TextStyle>;
};

// User avatar
export function UserAvatar({ user, size, style, letterStyle }: UserAvatarProps) {
  // Avatar image URL
  const avatarUrl = resolveImageUrl(user?.avatar_url ?? null);
  const borderRadius = size / 2;

  // Show image if available
  if (avatarUrl) {
    return (
      <View style={[{ width: size, height: size, borderRadius }, style]}>
        <Image source={{ uri: avatarUrl }} style={[styles.image, { width: size, height: size, borderRadius }]} />
      </View>
    );
  }

  // Fallback letter circle
  return (
    <View style={[styles.fallback, { width: size, height: size, borderRadius }, style]}>
      <Text style={[styles.letter, letterStyle]}>{(user?.display_name?.[0] ?? '?').toUpperCase()}</Text>
    </View>
  );
}

