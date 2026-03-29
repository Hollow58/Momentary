import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { UserAvatar } from '@/components/social/UserAvatar';
import { styles } from '@/styles/components/StoryCircle';

interface StoryCircleProps {
  name: string;
  avatar?: string | null;
  onPress?: () => void;
}

// Story circle
export function StoryCircle({ name, avatar, onPress }: StoryCircleProps) {
  return (
    // Tappable circle
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {/* Profile picture */}
      <UserAvatar
        user={{ avatar_url: avatar ?? null, display_name: name }}
        size={68}
        letterStyle={styles.fallbackText}
      />
      {/* Username below avatar */}
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>
    </TouchableOpacity>
  );
}


