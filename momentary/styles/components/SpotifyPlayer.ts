import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    overflow: 'hidden',
    marginTop: 4,
    backgroundColor: '#111',
  },
  gradientBg: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    filter: [{ saturate: 1.5 }, { contrast: 1.18 }],
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.22)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    padding: 24,
  },
  albumArt: {
    width: 120,
    height: 120,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    flexShrink: 0,
  },
  albumPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  albumPlaceholderText: {
    fontSize: 48,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  trackInfo: {
    flex: 1,
    minWidth: 0,
  },
  trackTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 22,
    lineHeight: 26,
    color: '#fff',
  },
  trackArtist: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 6,
  },
  trackAlbum: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.55)',
    marginTop: 4,
  },
  progressWrap: {
    marginTop: 16,
  },
  progressTimes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressTime: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.55)',
  },
  progressBarBg: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
});
