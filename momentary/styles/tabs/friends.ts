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
  subtitle: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 15,
    color: '#888',
    marginBottom: 20,
  },
  searchBox: {
    backgroundColor: 'rgba(250, 244, 238, 0.82)',
    borderRadius: 26,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(64, 49, 43, 0.08)',
    marginBottom: 18,
  },
  sectionLabel: {
    ...g.sectionLabel,
    marginBottom: 10,
  },
  searchInput: g.tabInput,
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 12,
  },
  sectionTitle: g.sectionTitle,
  sectionCount: g.sectionCount,
  sectionStack: {
    gap: 14,
  },
  emptyCard: {
    backgroundColor: 'rgba(250, 244, 238, 0.78)',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(64, 49, 43, 0.06)',
    marginBottom: 10,
  },
  emptyTitle: {
    fontFamily: 'Nunito_700Bold',
    color: '#444',
    fontSize: 16,
    marginBottom: 6,
  },
  emptyText: {
    fontFamily: 'Nunito_400Regular',
    color: '#888',
  },
  placeholder: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 16,
    color: '#888',
    lineHeight: 22,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  requestsBtn: {
    position: 'relative',
    backgroundColor: 'rgba(64, 49, 43, 0.08)',
    borderRadius: 20,
    padding: 10,
    marginTop: 12,
  },
  requestsDot: {
    position: 'absolute',
    top: 5,
    right: 5,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderColor: 'rgba(64, 49, 43, 0.08)',
  },
  requestsModalTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 20,
    color: '#444',
  },
  requestsModalDoneBtn: {
    backgroundColor: 'rgba(64, 49, 43, 0.08)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  requestsModalDoneText: {
    fontFamily: 'Nunito_600SemiBold',
    color: '#444',
  },
  requestsModalContent: {
    padding: 22,
  },
});
