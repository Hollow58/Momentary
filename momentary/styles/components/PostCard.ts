import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  cardWrapper: {
    paddingHorizontal: 16,
    position: 'relative',
  },
  card: {
    backgroundColor: '#faf4ee',
    borderRadius: 36,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    width: '100%',
    alignSelf: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarSpacing: {
    marginRight: 14,
  },
  avatarLetter: {
    fontSize: 22,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 19,
    color: '#000',
  },
  userNameLarge: {
    fontSize: 23,
  },
  timestamp: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: 'rgba(0,0,0,0.6)',
    marginTop: 2,
  },
  deleteBtn: {
    position: 'absolute',
    top: 14,
    right: 16,
    zIndex: 10,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 28,
    color: '#aaa',
    fontWeight: '300',
    lineHeight: 30,
  },
  divider: {
    height: 2,
    backgroundColor: 'rgba(68, 68, 68, 0.15)',
    borderRadius: 1,
    marginBottom: 14,
    marginHorizontal: 10,
  },
  body: {
    flex: 1,
  },
  bodyWithoutImage: {
    justifyContent: 'center',
  },
  caption: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 16,
    color: '#000',
    marginBottom: 0,
    lineHeight: 23,
  },
  captionLarge: {
    fontSize: 18,
    lineHeight: 26,
  },
  imageContainer: {
    borderRadius: 30,
    overflow: 'hidden',
    marginTop: 12,
  },
  postImage: {
    width: '100%',
    aspectRatio: 1,
  },
});
