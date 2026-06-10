import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Text, View } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Ellipse } from 'react-native-svg';
import { styles } from '@/styles/components/SpotifyPlayer';

const SPOTIFY_BASE = 'https://102722.stu.sd-lab.nl/spotify';
const FALLBACK_PALETTE = ['#1c1c1c', '#242424', '#2e2e2e', '#1a1a1a', '#222222', '#282828'];

type SpotifyTrack = {
  type: 'track';
  title: string;
  artist: string;
  album: string;
  albumArt: string | null;
  palette?: string[];
  progressMs?: number;
  durationMs?: number;
};

type SpotifyStatus =
  | SpotifyTrack
  | { type: 'idle' }
  | { type: 'not_connected' }
  | { type: 'loading' };

// Format time
function formatMs(ms: number): string {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = String(total % 60).padStart(2, '0');
  return `${m}:${s}`;
}

/* Animated blob with radial gradient */

type BlobProps = {
  id: string;
  color: string;
  size: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  duration: number;
  opacity?: number;
};

// Animated gradient blob
function Blob({ id, color, size, startX, startY, endX, endY, duration, opacity = 0.85 }: BlobProps) {
  // Animation loop
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: duration / 2, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: duration / 2, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [anim, duration]);

  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [startX, endX] });
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [startY, endY] });
  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] });

  const gradId = `blob-${id}`;
  const half = size / 2;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        width: size,
        height: size,
        transform: [{ translateX }, { translateY }, { scale }],
      }}
    >
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id={gradId} cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0" stopColor={color} stopOpacity={String(opacity)} />
            <Stop offset="0.35" stopColor={color} stopOpacity={String(opacity * 0.6)} />
            <Stop offset="0.65" stopColor={color} stopOpacity={String(opacity * 0.2)} />
            <Stop offset="1" stopColor={color} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Ellipse cx={String(half)} cy={String(half)} rx={String(half)} ry={String(half)} fill={`url(#${gradId})`} />
      </Svg>
    </Animated.View>
  );
}

type SpotifyPlayerProps = {
  userId: number;
};

// Spotify now playing widget
export function SpotifyPlayer({ userId }: SpotifyPlayerProps) {
  // Track status
  const [spotify, setSpotify] = useState<SpotifyStatus>({ type: 'loading' });
  // Progress tracking
  const progressRef = useRef(0);
  const durationRef = useRef(0);
  const lastTickRef = useRef(0);
  const [displayProgress, setDisplayProgress] = useState(0);
  // Current song key
  const lastTrackKeyRef = useRef('');
  // Album art colors
  const [stablePalette, setStablePalette] = useState<string[]>(FALLBACK_PALETTE);

  // Fetch playing status
  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`${SPOTIFY_BASE}/api.php?user_id=${userId}`);
      const data = await res.json();
      if (data.type === 'track') {
        const trackKey = `${data.title}\0${data.artist}`;
        if (trackKey !== lastTrackKeyRef.current) {
          lastTrackKeyRef.current = trackKey;
          if (data.palette && data.palette.length >= 6) {
            setStablePalette(data.palette.slice(0, 6));
          } else {
            setStablePalette(FALLBACK_PALETTE);
          }
        }
        progressRef.current = data.progressMs ?? 0;
        durationRef.current = data.durationMs ?? 0;
        lastTickRef.current = Date.now();
        setDisplayProgress(data.progressMs ?? 0);
      }
      setSpotify(data);
    } catch {
      setSpotify({ type: 'not_connected' });
    }
  }, [userId]);

  // Poll every 5 seconds
  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  // Progress tick every second
  useEffect(() => {
    const tick = setInterval(() => {
      if (durationRef.current <= 0) return;
      const now = Date.now();
      const elapsed = now - lastTickRef.current;
      lastTickRef.current = now;
      progressRef.current = Math.min(progressRef.current + elapsed, durationRef.current);
      setDisplayProgress(progressRef.current);
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  // Only show when playing
  if (spotify.type !== 'track') return null;

  const p = stablePalette;
  const duration = durationRef.current;
  const progressPct = duration > 0 ? (displayProgress / duration) * 100 : 0;

  return (
    <View style={styles.card}>
      {/* Gradient background */}
      <View style={styles.gradientBg}>
        {/* Corner blobs */}
        <Blob id="1" color={p[0]} size={480} startX={-140} startY={-130} endX={-110} endY={-100} duration={8000} opacity={1} />
        <Blob id="2" color={p[1]} size={480} startX={80}   startY={-130} endX={110}  endY={-100} duration={9000} opacity={1} />
        <Blob id="3" color={p[2]} size={480} startX={-130} startY={10}   endX={-100} endY={40}   duration={10000} opacity={1} />
        <Blob id="4" color={p[3]} size={480} startX={70}   startY={0}    endX={100}  endY={30}   duration={11000} opacity={1} />
        {/* Center blobs */}
        <Blob id="5" color={p[4]} size={400} startX={-20}  startY={-30}  endX={10}   endY={-10}  duration={12000} opacity={0.85} />
        <Blob id="6" color={p[5]} size={420} startX={10}   startY={-10}  endX={-20}  endY={10}   duration={13000} opacity={0.70} />
      </View>
      {/* Dark overlay */}
      <View style={styles.overlay} />
      {/* Track info */}
      <View style={styles.content}>
        <View style={styles.trackRow}>
          {spotify.albumArt ? (
            <Image source={{ uri: spotify.albumArt }} style={styles.albumArt} />
          ) : (
            <View style={[styles.albumArt, styles.albumPlaceholder]}>
              <Text style={styles.albumPlaceholderText}>♫</Text>
            </View>
          )}
          <View style={styles.trackInfo}>
            <Text style={styles.trackTitle} numberOfLines={1}>{spotify.title}</Text>
            <Text style={styles.trackArtist} numberOfLines={1}>{spotify.artist}</Text>
            <Text style={styles.trackAlbum} numberOfLines={1}>{spotify.album}</Text>
          </View>
        </View>
        <View style={styles.progressRow}>
          <Text style={styles.progressTime}>{formatMs(displayProgress)}</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${Math.min(progressPct, 100)}%` }]} />
          </View>
          <Text style={styles.progressTime}>{formatMs(duration)}</Text>
        </View>
      </View>
    </View>
  );
}
