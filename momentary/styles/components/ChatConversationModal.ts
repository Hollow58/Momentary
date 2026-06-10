import { StyleSheet } from 'react-native';
import * as g from '@/styles/global';

export const styles = StyleSheet.create({
  backdrop: g.modalBackdrop,
  sheet: {
    ...g.modalSheetBase,
    height: '90%',
  },
  shell: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 12,
  },
  backButton: {
    backgroundColor: 'rgba(64, 49, 43, 0.08)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexShrink: 0,
  },
  backButtonText: {
    fontFamily: 'Nunito_700Bold',
    color: '#40312B',
  },
  friendBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  messageList: {
    flex: 1,
    paddingHorizontal: 18,
  },
  avatar: {
    flexShrink: 0,
  },
  avatarLetter: {
    fontSize: 18,
  },
  name: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: '#33261F',
  },
  username: {
    fontFamily: 'Nunito_400Regular',
    color: '#7C6C5B',
    marginTop: 2,
  },
  messageStack: {
    paddingTop: 6,
    paddingBottom: 12,
    gap: 10,
  },
  messageRow: {
    flexDirection: 'row',
  },
  messageRowMine: {
    justifyContent: 'flex-end',
  },
  messageRowTheirs: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '82%',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  messageBubbleMine: {
    backgroundColor: '#40312B',
    borderBottomRightRadius: 8,
  },
  messageBubbleTheirs: {
    backgroundColor: 'rgba(64, 49, 43, 0.08)',
    borderBottomLeftRadius: 8,
  },
  messageText: {
    fontFamily: 'Nunito_400Regular',
    lineHeight: 20,
  },
  messageTextMine: {
    color: '#F8F2EC',
  },
  messageTextTheirs: {
    color: '#33261F',
  },
  messageFooter: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  messageTime: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 11,
  },
  messageTimeMine: {
    color: 'rgba(248, 242, 236, 0.78)',
  },
  messageTimeTheirs: {
    color: '#8B7766',
  },
  messageStatus: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 11,
    color: 'rgba(248, 242, 236, 0.78)',
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(64, 49, 43, 0.08)',
    paddingTop: 14,
    paddingHorizontal: 18,
  },
  input: {
    flex: 1,
    minHeight: 52,
    maxHeight: 110,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#FCFAF7',
    borderWidth: 1,
    borderColor: 'rgba(64, 49, 43, 0.08)',
    fontFamily: 'Nunito_400Regular',
    color: '#33261F',
  },
  sendButton: {
    backgroundColor: '#40312B',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  sendButtonText: {
    fontFamily: 'Nunito_700Bold',
    color: '#F8F2EC',
  },
});
