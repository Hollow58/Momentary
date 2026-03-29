import React from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';

import { type RelationshipState, type User } from '@/lib/api';

import { RelationshipBadge } from './RelationshipBadge';
import { UserAvatar } from './UserAvatar';
import { styles } from '@/styles/components/FriendSearchCard';

type FriendSearchCardProps = {
  user: User;
  relationship: RelationshipState;
  primaryLabel: string;
  disabled: boolean;
  onOpenProfile: (user: User) => void;
  onPrimaryAction: () => void;
};

// Search result card
export function FriendSearchCard({
  user,
  relationship,
  primaryLabel,
  disabled,
  onOpenProfile,
  onPrimaryAction,
}: FriendSearchCardProps) {
  return (
    <View style={styles.card}>
      {/* User info */}
      <Pressable style={styles.row} onPress={() => onOpenProfile(user)}>
        {/* Avatar */}
        <UserAvatar user={user} size={54} style={styles.avatar} letterStyle={styles.avatarLetter} />

        <View style={styles.meta}>
          <Text style={styles.name}>{user.display_name}</Text>
          <Text style={styles.username}>@{user.username}</Text>
          {/* Relationship status pill */}
          <View style={styles.badgeWrap}>
            <RelationshipBadge state={relationship} />
          </View>
        </View>
      </Pressable>

      {/* Action buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => onOpenProfile(user)} activeOpacity={0.85}>
          <Text style={styles.secondaryButtonText}>View profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.primaryButton, disabled && styles.primaryButtonDisabled]}
          onPress={onPrimaryAction}
          activeOpacity={0.85}
          disabled={disabled}
        >
          <Text style={styles.primaryButtonText}>{primaryLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
