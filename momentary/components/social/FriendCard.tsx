import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { type User } from '@/lib/api';
import * as g from '@/styles/global';

import { UserAvatar } from './UserAvatar';

type FriendCardProps = {
  user: User;
  // card width in pixels
  cubeSize: number;
  onPress: (user: User) => void;
};

// friend card for the 2-column grid
export function FriendCard({ user, cubeSize, onPress }: FriendCardProps) {
  // avatar is 62% of card width
  const avatarSize = Math.floor(cubeSize * 0.62);

  return (
    <TouchableOpacity
      style={[styles.cube, { width: cubeSize }]}
      onPress={() => onPress(user)}
      activeOpacity={0.85}
    >
      <UserAvatar user={user} size={avatarSize} />
      <Text style={styles.name} numberOfLines={1}>
        {user.display_name}
      </Text>
      <Text style={styles.handle} numberOfLines={1}>
        (@{user.username})
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cube: {
    backgroundColor: g.SURFACE_BASE,
    borderRadius: g.CARD_RADIUS,
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 12,
    ...g.cardShadow,
  },
  name: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 17,
    color: g.TEXT_PRIMARY,
    marginTop: 14,
    textAlign: 'center',
  },
  handle: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: g.TEXT_SECONDARY,
    marginTop: 3,
    textAlign: 'center',
  },
});
