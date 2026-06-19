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
  threadStack: {
    gap: 12,
    marginHorizontal: -12,
  },
  emptyCard: {
    backgroundColor: 'rgba(250, 244, 238, 0.82)',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(64, 49, 43, 0.06)',
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
    lineHeight: 20,
  },
  placeholder: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 16,
    color: '#888',
  },
});
