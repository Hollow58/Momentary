import { Dimensions, StyleSheet } from 'react-native';
import * as g from '@/styles/global';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 110,
  },
  title: {
    ...g.pageTitle,
    paddingHorizontal: 28,
    paddingTop: 72,
    paddingBottom: 10,
  },
  storiesRow: {
    marginBottom: 20,
  },
  storiesContainer: {
    paddingHorizontal: 28,
    gap: 14,
    alignItems: 'flex-end',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 22,
    color: '#444',
    marginBottom: 8,
  },
  emptySubText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
  },
  detailOverlay: {
    flex: 1,
    backgroundColor: 'rgb(237,230,223)',
  },
  detailGradient: {
    flex: 1,
  },
  detailHeader: {
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  detailBackBtn: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#f1ede9',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  detailScroll: {
    flex: 1,
  },
  detailScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  detailUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailAvatarSpacing: {
    marginRight: 14,
  },
  detailAvatarLetter: {
    fontSize: 22,
  },
  detailUserName: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 22,
    color: '#000',
  },
  detailTimestamp: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: 'rgba(0,0,0,0.6)',
    marginTop: 2,
  },
  detailCaption: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 18,
    color: '#000',
    lineHeight: 26,
    marginBottom: 20,
  },
  detailImageContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#eee',
  },
  detailImage: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.5,
  },
  imageViewerOverlay: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageViewerClose: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageViewerCloseText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  imageViewerImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
});
