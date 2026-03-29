import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(250, 244, 238, 0.92)',
    borderRadius: 28,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(64, 49, 43, 0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
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
    color: '#33261F',
  },
  username: {
    fontFamily: 'Nunito_400Regular',
    color: '#7C6C5B',
    marginTop: 2,
  },
  badgeWrap: {
    marginTop: 10,
    flexDirection: 'row',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: 'rgba(64, 49, 43, 0.06)',
    borderRadius: 18,
    paddingVertical: 13,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontFamily: 'Nunito_700Bold',
    color: '#40312B',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#40312B',
    borderRadius: 18,
    paddingVertical: 13,
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.55,
  },
  primaryButtonText: {
    fontFamily: 'Nunito_700Bold',
    color: '#F8F2EC',
  },
});
