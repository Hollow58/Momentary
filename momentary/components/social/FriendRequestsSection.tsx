import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { type FriendRequestView } from '@/lib/api';
import { styles } from '@/styles/components/FriendRequestsSection';

type FriendRequestsSectionProps = {
  incomingRequests: FriendRequestView[];
  outgoingRequests: FriendRequestView[];
  onAccept: (requestId: number) => void;
  onDecline: (requestId: number) => void;
  onCancel: (requestId: number) => void;
};

// Friend requests section
export function FriendRequestsSection({
  incomingRequests,
  outgoingRequests,
  onAccept,
  onDecline,
  onCancel,
}: FriendRequestsSectionProps) {
  return (
    <View style={styles.wrapper}>
      {/* Incoming */}
      <View style={styles.column}>
        <Text style={styles.columnTitle}>Incoming</Text>
        {incomingRequests.length > 0 ? (
          incomingRequests.map((request) => (
            <View key={request.id} style={styles.card}>
              <Text style={styles.name}>{request.from_user.display_name}</Text>
              <Text style={styles.meta}>@{request.from_user.username}</Text>
              {/* Actions */}
              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.button, styles.buttonPrimary]}
                  onPress={() => onAccept(request.id)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.buttonPrimaryText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => onDecline(request.id)} activeOpacity={0.85}>
                  <Text style={styles.buttonText}>Decline</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No incoming requests right now.</Text>
          </View>
        )}
      </View>

      {/* Outgoing */}
      <View style={styles.column}>
        <Text style={styles.columnTitle}>Outgoing</Text>
        {outgoingRequests.length > 0 ? (
          outgoingRequests.map((request) => (
            <View key={request.id} style={styles.card}>
              <Text style={styles.name}>{request.to_user.display_name}</Text>
              <Text style={styles.meta}>Pending</Text>
              {/* Cancel button */}
              <View style={styles.actions}>
                <TouchableOpacity style={styles.button} onPress={() => onCancel(request.id)} activeOpacity={0.85}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No outgoing requests.</Text>
          </View>
        )}
      </View>
    </View>
  );
}

