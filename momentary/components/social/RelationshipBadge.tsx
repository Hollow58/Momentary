import React from 'react';
import { Text, View } from 'react-native';

import { type RelationshipState } from '@/lib/api';
import { styles } from '@/styles/components/RelationshipBadge';

type RelationshipBadgeProps = {
  state: RelationshipState;
};

// Relationship status badge
export function RelationshipBadge({ state }: RelationshipBadgeProps) {
  return (
    <View style={[styles.badge, relationshipPillStyle(state)]}>
      <Text style={styles.label}>{relationshipLabel(state)}</Text>
    </View>
  );
}

// Status labels and colors
const RELATIONSHIP: Record<RelationshipState, { label: string; backgroundColor: string }> = {
  friends:  { label: 'Friends',   backgroundColor: 'rgba(86, 111, 92, 0.16)' },
  incoming: { label: 'Incoming',  backgroundColor: 'rgba(165, 117, 66, 0.16)' },
  outgoing: { label: 'Requested', backgroundColor: 'rgba(120, 119, 112, 0.16)' },
  self:     { label: 'You',       backgroundColor: 'rgba(107, 86, 71, 0.16)' },
  none:     { label: 'Available', backgroundColor: 'rgba(107, 86, 71, 0.12)' },
};

// Get label
export function relationshipLabel(state: RelationshipState) {
  return RELATIONSHIP[state].label;
}

// Get background color
export function relationshipPillStyle(state: RelationshipState) {
  return { backgroundColor: RELATIONSHIP[state].backgroundColor };
}

