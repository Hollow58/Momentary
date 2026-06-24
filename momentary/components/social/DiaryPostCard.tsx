import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { type Post, resolveImageUrl } from '@/lib/api';
import { timeAgo } from '@/lib/time';

export function DiaryPostCard({
  post,
  onImagePress,
}: {
  post: Post;
  onImagePress?: (uri: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const imageUrl = resolveImageUrl(post.image_uri);
  const caption = post.caption ?? '';
  const isLong = caption.length > 120;

  return (
    <View style={styles.card}>
      <Text style={styles.time}>{timeAgo(post.created_at)}</Text>
      {imageUrl ? (
        <TouchableOpacity activeOpacity={0.9} onPress={() => onImagePress?.(imageUrl)}>
          <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
        </TouchableOpacity>
      ) : null}
      {caption ? (
        <TouchableOpacity onPress={() => isLong && setExpanded(!expanded)} activeOpacity={isLong ? 0.7 : 1} disabled={!isLong}>
          <Text style={styles.caption} numberOfLines={expanded ? undefined : 3}>
            {caption}
          </Text>
          {isLong && !expanded && <Text style={styles.more}>tap to read more</Text>}
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FAF4EE',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(64, 49, 43, 0.06)',
  },
  time: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: '#9B8E80',
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
  },
  image: {
    width: '100%',
    aspectRatio: 1.2,
    backgroundColor: '#EFDEC2',
  },
  caption: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 15,
    color: '#33261F',
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 14,
    lineHeight: 21,
  },
  more: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: '#9B8E80',
    paddingHorizontal: 14,
    paddingBottom: 14,
    fontStyle: 'italic',
  },
});