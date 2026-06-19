import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useRef, useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Modal,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { type Message, type User, resolveImageUrl } from '@/lib/api';
import * as g from '@/styles/global';

import { UserAvatar } from '../social/UserAvatar';
import { formatTimeLabel } from './ChatThreadCard';

type Props = {
  currentUser: User | null;
  activeFriend: User | null;
  messages: Message[];
  draft: string;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  onSendImage: (localUri: string) => void;
  onClose: () => void;
};

const BG_COLORS = [
  '#FAF4EE', '#E4EEF8', '#E4F0E8', '#EEE4F5',
  '#F5EAE4', '#EAEAEA', '#2D2D2D', '#1C2333',
];

const DARK_BG_COLORS = new Set(['#2D2D2D', '#1C2333']);

export function ChatConversationModal({
  currentUser,
  activeFriend,
  messages,
  draft,
  onDraftChange,
  onSend,
  onSendImage,
  onClose,
}: Props) {
  const scrollRef = useRef<ScrollView>(null);
  const isAtBottomRef = useRef(true);
  const prevLengthRef = useRef(0);
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [focusedImageUri, setFocusedImageUri] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState('#FAF4EE');
  const [showBgPicker, setShowBgPicker] = useState(false);
  const isDark = DARK_BG_COLORS.has(bgColor);
  const activeFriendId = activeFriend?.id;

  // Load saved colour when a conversation opens
  useEffect(() => {
    if (!activeFriendId) return;
    AsyncStorage.getItem(`chat_bg_${activeFriendId}`).then((saved) => {
      setBgColor(saved && BG_COLORS.includes(saved) ? saved : '#FAF4EE');
    });
  }, [activeFriendId]);

  const handleSetBgColor = (color: string) => {
    setBgColor(color);
    setShowBgPicker(false);
    if (activeFriend) AsyncStorage.setItem(`chat_bg_${activeFriend.id}`, color);
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    isAtBottomRef.current = contentSize.height - (contentOffset.y + layoutMeasurement.height) < 60;
  };

  const handleContentSizeChange = () => {
    if (messages.length > prevLengthRef.current && isAtBottomRef.current) {
      scrollRef.current?.scrollToEnd({ animated: true });
    }
    prevLengthRef.current = messages.length;
  };

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.85,
      allowsEditing: false,
    });
    if (!result.canceled && result.assets[0]) onSendImage(result.assets[0].uri);
  };

  return (
    <Modal visible={activeFriend !== null} animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.shell}
        >
          <View style={[styles.backgroundPanel, { backgroundColor: bgColor }]} pointerEvents="none" />

          {/* Nameplate header */}
          <View style={[styles.nameplate, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity onPress={onClose} style={styles.backButton} activeOpacity={0.8}>
              <Svg width={18} height={18} viewBox="0 0 73 119">
                <Path d="M2.55635 53.7867C-0.852116 56.9421 -0.852116 62.058 2.55635 65.2133L58.1004 116.633C61.509 119.789 67.0352 119.789 70.4436 116.633C73.8521 113.478 73.8521 108.362 70.4436 105.207L21.0711 59.5L70.4436 13.7933C73.8521 10.6378 73.8521 5.52194 70.4436 2.36655C67.0352 -0.78885 61.509 -0.78885 58.1004 2.36655L2.55635 53.7867Z" fill="#444" />
              </Svg>
            </TouchableOpacity>
            <View style={styles.nameplateCenter}>
              {activeFriend && <UserAvatar user={activeFriend} size={36} />}
              <Text style={styles.name}>{activeFriend?.display_name}</Text>
            </View>
            <TouchableOpacity style={styles.menuButton} onPress={() => setShowBgPicker(v => !v)} activeOpacity={0.7}>
              <Text style={styles.menuButtonText}>···</Text>
            </TouchableOpacity>
          </View>

          {/* Background colour picker */}
          {showBgPicker && (
            <View style={styles.colorPicker}>
              <Text style={styles.colorPickerTitle}>Background</Text>
              <View style={styles.colorSwatches}>
                {BG_COLORS.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[styles.colorSwatch, { backgroundColor: color }, bgColor === color && styles.colorSwatchActive]}
                    onPress={() => handleSetBgColor(color)}
                    activeOpacity={0.8}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Message list + composer */}
          <View style={[styles.sheet, { backgroundColor: bgColor }]}>
            <ScrollView
              ref={scrollRef}
              style={styles.messageList}
              contentContainerStyle={styles.messageStack}
              showsVerticalScrollIndicator={false}
              onScroll={handleScroll}
              onContentSizeChange={handleContentSizeChange}
              scrollEventThrottle={100}
            >
              {messages.map((message) => {
                const isMine = Boolean(currentUser && message.sender_id === currentUser.id);
                const isImage = message.body.startsWith('[img]');
                const imageUrl = isImage ? resolveImageUrl(message.body.slice(5)) : null;

                return (
                  <View key={message.id} style={[styles.messageRow, isMine ? styles.messageRowMine : styles.messageRowTheirs]}>
                    <View style={[styles.messageBubble, isMine ? styles.messageBubbleMine : styles.messageBubbleTheirs, isImage && styles.messageBubbleImage]}>
                      {isImage ? (
                        <TouchableOpacity activeOpacity={0.9} onPress={() => setFocusedImageUri(imageUrl)}>
                          <Image source={{ uri: imageUrl! }} style={styles.messageImage} resizeMode="cover" />
                        </TouchableOpacity>
                      ) : (
                        <Text style={[styles.messageText, isMine ? styles.messageTextMine : styles.messageTextTheirs]}>
                          {message.body}
                        </Text>
                      )}
                    </View>
                    <Text style={[styles.messageTime, isMine ? styles.messageTimeMine : styles.messageTimeTheirs, isDark && styles.messageTimeDark]}>
                      {formatTimeLabel(message.created_at)}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>

            {/* Composer */}
            <View style={[styles.composer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
              <View style={styles.inputWrapper}>
                <TouchableOpacity style={styles.addButton} onPress={handlePickImage} activeOpacity={0.7}>
                  <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
                <TextInput
                  value={draft}
                  onChangeText={onDraftChange}
                  placeholder="Write a message"
                  placeholderTextColor="#9B8E80"
                  style={[styles.input, draft.trim().length > 0 && styles.inputWithSend]}
                  multiline
                />
                {draft.trim().length > 0 && (
                  <TouchableOpacity style={styles.inlineSendButton} onPress={onSend} activeOpacity={0.85}>
                    <Text style={styles.sendButtonText}>▷</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>

        {/* Fullscreen image viewer */}
        {focusedImageUri && (
          <View style={[StyleSheet.absoluteFill, viewerStyles.overlay]}>
            <TouchableOpacity style={viewerStyles.closeButton} onPress={() => setFocusedImageUri(null)} activeOpacity={0.7}>
              <Text style={viewerStyles.closeText}>✕</Text>
            </TouchableOpacity>
            <Image
              source={{ uri: focusedImageUri }}
              style={{ width: screenWidth, height: screenHeight }}
              resizeMode="contain"
            />
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  shell: {
    flex: 1,
  },
  backgroundPanel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  nameplate: {
    ...g.modalNameplate,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameplateCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  name: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 18,
    color: g.TEXT_PRIMARY,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButtonText: {
    fontSize: 22,
    color: '#555',
    letterSpacing: 3,
    lineHeight: 22,
  },
  sheet: {
    flex: 1,
  },
  messageList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messageStack: {
    paddingTop: 10,
    paddingBottom: 16,
    gap: 14,
  },
  messageRow: {
    flexDirection: 'column',
    gap: 3,
  },
  messageRowMine: {
    alignItems: 'flex-end',
  },
  messageRowTheirs: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '78%',
    borderRadius: 22,
    paddingVertical: 11,
    paddingHorizontal: 16,
  },
  messageBubbleImage: {
    padding: 0,
    overflow: 'hidden',
  },
  messageBubbleMine: {
    backgroundColor: 'rgba(240, 232, 210, 0.95)',
    borderBottomRightRadius: 6,
  },
  messageBubbleTheirs: {
    backgroundColor: 'rgba(185, 200, 208, 0.88)',
    borderBottomLeftRadius: 6,
  },
  messageText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 15,
    lineHeight: 21,
    color: g.TEXT_PRIMARY,
  },
  messageTextMine: {
    color: '#3A2E20',
  },
  messageTextTheirs: {
    color: '#2A3238',
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 18,
  },
  messageTime: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 11,
  },
  messageTimeMine: {
    color: 'rgba(90, 70, 50, 0.6)',
  },
  messageTimeTheirs: {
    color: 'rgba(50, 70, 85, 0.6)',
  },
  messageTimeDark: {
    color: 'rgba(255, 255, 255, 0.55)',
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  addButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  addButtonText: {
    fontSize: 26,
    color: '#9B8E80',
    lineHeight: 28,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    minHeight: 48,
    paddingHorizontal: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 110,
    paddingHorizontal: 10,
    paddingVertical: 14,
    fontFamily: 'Nunito_400Regular',
    fontSize: 15,
    lineHeight: 20,
    color: g.TEXT_PRIMARY,
    textAlignVertical: 'center',
    backgroundColor: 'transparent',
  },
  inputWithSend: {
    paddingRight: 4,
  },
  inlineSendButton: {
    width: 47,
    height: 47,
    borderRadius: 24,
    backgroundColor: '#c4cccf',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    marginRight: -6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sendButtonText: {
    fontSize: 18,
    color: '#555',
    marginLeft: 2,
  },
  colorPicker: {
    position: 'absolute',
    top: 72,
    right: 14,
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 30,
    zIndex: 50,
  },
  colorPickerTitle: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: '#555',
    marginBottom: 10,
  },
  colorSwatches: {
    flexDirection: 'row',
    gap: 10,
  },
  colorSwatch: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  colorSwatchActive: {
    borderWidth: 3,
    borderColor: '#444',
  },
});

const viewerStyles = StyleSheet.create({
  overlay: {
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
});
