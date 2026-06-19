import { StyleSheet } from 'react-native';
import * as g from '@/styles/global';

export const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: g.SURFACE_BASE,
    borderRadius: g.CARD_RADIUS,
    padding: 16,
    ...g.cardShadow,
  },
  avatar: {
    marginRight: 14,
  },
  avatarLetter: {
    fontSize: 20,
  },
  meta: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 17,
    color: g.TEXT_PRIMARY,
    flex: 1,
  },
  time: {
    fontFamily: 'Nunito_600SemiBold',
    color: '#8B7766',
    fontSize: 12,
  },
  preview: {
    fontFamily: 'Nunito_400Regular',
    color: g.TEXT_SECONDARY,
    marginTop: 5,
  },
  nameUnread: {
    fontFamily: 'Nunito_700Bold',
    color: '#1A110D',
  },
  timeUnread: {
    fontFamily: 'Nunito_700Bold',
    color: g.PRIMARY_ACTION,
  },
  previewUnread: {
    fontFamily: 'Nunito_800ExtraBold',
    color: '#1A110D',
  },
});
