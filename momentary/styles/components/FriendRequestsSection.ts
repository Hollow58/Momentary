import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  wrapper: {
    gap: 14,
  },
  column: {
    gap: 12,
  },
  columnTitle: {
    fontFamily: 'Nunito_700Bold',
    color: '#40312B',
    fontSize: 18,
  },
  card: {
    backgroundColor: 'rgba(250, 244, 238, 0.9)',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(64, 49, 43, 0.06)',
  },
  name: {
    fontFamily: 'Nunito_700Bold',
    color: '#33261F',
    fontSize: 16,
  },
  meta: {
    fontFamily: 'Nunito_400Regular',
    color: '#7C6C5B',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  button: {
    flex: 1,
    backgroundColor: 'rgba(64, 49, 43, 0.07)',
    borderRadius: 16,
    paddingVertical: 11,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#40312B',
  },
  buttonText: {
    fontFamily: 'Nunito_700Bold',
    color: '#40312B',
  },
  buttonPrimaryText: {
    fontFamily: 'Nunito_700Bold',
    color: '#F8F2EC',
  },
  emptyCard: {
    backgroundColor: 'rgba(250, 244, 238, 0.72)',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(64, 49, 43, 0.05)',
  },
  emptyText: {
    fontFamily: 'Nunito_400Regular',
    color: '#7C6C5B',
  },
});
