import { StyleSheet } from 'react-native';
import * as g from '@/styles/global';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 28,
    paddingTop: 72,
    paddingBottom: 120,
  },
  title: {
    ...g.pageTitle,
    marginBottom: 8,
  },
  emptyCard: {
    backgroundColor: 'rgba(250, 244, 238, 0.78)',
    borderRadius: g.CARD_RADIUS,
    padding: 18,
    borderWidth: 1,
    borderColor: g.SURFACE_BORDER,
    marginBottom: 10,
  },
  emptyTitle: {
    fontFamily: 'Nunito_700Bold',
    color: g.TEXT_PRIMARY,
    fontSize: 16,
    marginBottom: 6,
  },
  emptyText: {
    fontFamily: 'Nunito_400Regular',
    color: g.TEXT_SECONDARY,
  },
  placeholder: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 16,
    color: g.TEXT_SECONDARY,
    lineHeight: 22,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  actionBtn: {
    position: 'relative',
    width: g.ICON_BUTTON_SIZE,
    height: g.ICON_BUTTON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: g.CONTROL_TINT,
    borderRadius: g.ICON_BUTTON_SIZE / 2,
  },
  requestsDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#D9534F',
    zIndex: 1,
  },
  requestsModalBackdrop: g.modalBackdrop,
  requestsModalSheet: {
    ...g.modalSheetBase,
    height: '85%',
  },
  requestsModalHeader: {
    ...g.modalNameplate,
    justifyContent: 'space-between',
  },
  requestsModalTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 20,
    color: g.TEXT_PRIMARY,
  },
  requestsModalDoneBtn: {
    backgroundColor: g.CONTROL_TINT,
    borderRadius: g.CONTROL_RADIUS,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  requestsModalDoneText: {
    fontFamily: 'Nunito_600SemiBold',
    color: g.PRIMARY_ACTION,
  },
  requestsModalContent: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 36,
  },
  friendsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginHorizontal: -12,
  },
});

