import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(250, 244, 238, 0.92)',
    borderRadius: 26,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(64, 49, 43, 0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
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
    color: '#33261F',
    flex: 1,
  },
  time: {
    fontFamily: 'Nunito_600SemiBold',
    color: '#8B7766',
    fontSize: 12,
  },
  preview: {
    fontFamily: 'Nunito_400Regular',
    color: '#7C6C5B',
    marginTop: 5,
  },
  nameUnread: {
    fontFamily: 'Nunito_700Bold',
    color: '#1A110D',
  },
  timeUnread: {
    fontFamily: 'Nunito_700Bold',
    color: '#40312B',
  },
  previewUnread: {
    fontFamily: 'Nunito_800ExtraBold',
    color: '#1A110D',
  },
});
