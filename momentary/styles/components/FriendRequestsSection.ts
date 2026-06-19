import { StyleSheet } from 'react-native';
import * as g from '@/styles/global';

export const styles = StyleSheet.create({
  wrapper: {
    gap: 12,
  },
  column: {
    gap: 12,
  },
  columnTitle: {
    fontFamily: 'Nunito_700Bold',
    color: g.PRIMARY_ACTION,
    fontSize: 18,
  },
  card: {
    backgroundColor: 'rgba(250, 244, 238, 0.9)',
    borderRadius: g.CARD_RADIUS,
    padding: 16,
    borderWidth: 1,
    borderColor: g.SURFACE_BORDER,
  },
  name: {
    fontFamily: 'Nunito_700Bold',
    color: g.TEXT_PRIMARY,
    fontSize: 16,
  },
  meta: {
    fontFamily: 'Nunito_400Regular',
    color: g.TEXT_SECONDARY,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  button: {
    flex: 1,
    backgroundColor: g.CONTROL_TINT_SOFT,
    borderRadius: g.CONTROL_RADIUS,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: g.PRIMARY_ACTION,
  },
  buttonText: {
    fontFamily: 'Nunito_700Bold',
    color: g.PRIMARY_ACTION,
  },
  buttonPrimaryText: {
    fontFamily: 'Nunito_700Bold',
    color: g.PRIMARY_ACTION_TEXT,
  },
  emptyCard: {
    backgroundColor: 'rgba(250, 244, 238, 0.72)',
    borderRadius: g.CARD_RADIUS,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(64, 49, 43, 0.05)',
  },
  emptyText: {
    fontFamily: 'Nunito_400Regular',
    color: g.TEXT_SECONDARY,
  },
});
