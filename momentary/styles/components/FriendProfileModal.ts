import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(30, 22, 18, 0.34)',
  },
  card: {
    backgroundColor: '#FAF4EE',
    borderRadius: 30,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(64, 49, 43, 0.08)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 20,
    color: '#33261F',
  },
  closeButton: {
    backgroundColor: 'rgba(64, 49, 43, 0.08)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  closeButtonText: {
    fontFamily: 'Nunito_700Bold',
    color: '#40312B',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    flexShrink: 0,
  },
  avatarLetter: {
    fontSize: 26,
  },
  profileTextBlock: {
    flex: 1,
  },
  name: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 24,
    color: '#33261F',
  },
  username: {
    fontFamily: 'Nunito_400Regular',
    color: '#7C6C5B',
    marginTop: 4,
  },
  email: {
    fontFamily: 'Nunito_400Regular',
    color: '#7C6C5B',
    marginTop: 2,
  },
  body: {
    marginTop: 18,
    backgroundColor: 'rgba(64, 49, 43, 0.04)',
    borderRadius: 22,
    padding: 16,
  },
  note: {
    fontFamily: 'Nunito_400Regular',
    color: '#7C6C5B',
    marginTop: 12,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
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
  primaryButtonLocked: {
    flex: 1,
    backgroundColor: 'rgba(64, 49, 43, 0.12)',
    borderRadius: 18,
    paddingVertical: 13,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontFamily: 'Nunito_700Bold',
    color: '#F8F2EC',
  },
});
