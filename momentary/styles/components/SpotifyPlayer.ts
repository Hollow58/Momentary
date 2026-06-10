import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    overflow: 'hidden',
    marginTop: 20,
    backgroundColor: '#111',
  },
  /* Blob container — mirrors .gradient-bg */
  gradientBg: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  /* Dark overlay — mirrors .overlay { background: rgba(0,0,0,0.22) } */
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.22)',
  },
  /* Content sits on z-index 2 above blobs + overlay */
  content: {
    padding: 20,
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    width: '100%',
  },
  albumArt: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  albumPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  albumPlaceholderText: {
    fontSize: 28,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 17,
    color: '#fff',
  },
  trackArtist: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 3,
  },
  trackAlbum: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 2,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
    width: '100%',
  },
  progressTime: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.55)',
    minWidth: 32,
    textAlign: 'center',
  },
  progressBarBg: {
    flex: 1,
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
