import { StyleSheet } from 'react-native';
import * as g from '@/styles/global';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(250, 244, 238, 0.92)',
    borderRadius: g.CARD_RADIUS,
    padding: 16,
    borderWidth: 1,
    borderColor: g.SURFACE_BORDER,
    ...g.cardShadow,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
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
  name: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: g.TEXT_PRIMARY,
  },
  username: {
    fontFamily: 'Nunito_400Regular',
    color: g.TEXT_SECONDARY,
    marginTop: 2,
  },
  badgeWrap: {
    marginTop: 10,
    flexDirection: 'row',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: g.CONTROL_TINT,
    borderRadius: g.CONTROL_RADIUS,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontFamily: 'Nunito_700Bold',
    color: g.PRIMARY_ACTION,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: g.PRIMARY_ACTION,
    borderRadius: g.CONTROL_RADIUS,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.55,
  },
  primaryButtonText: {
    fontFamily: 'Nunito_700Bold',
    color: g.PRIMARY_ACTION_TEXT,
  },
});
