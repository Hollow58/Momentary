import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";

// ── Config ────────────────────────────────────────────────────────────────────

const API_URL    = "https://102722.stu.sd-lab.nl/spotifytest/api.php?action=now-playing";
const LOGIN_URL  = "https://102722.stu.sd-lab.nl/spotifytest/login.php";
const POLL_MS    = 2000;

// Persists the session cookie between fetch calls so PHP
// knows which user is making the request.
let sessionCookie = "";

const FALLBACK_PALETTE = [
  "#1c1c1c", "#242424", "#2e2e2e", "#1a1a1a", "#222222", "#282828",
];

// ── Main component ────────────────────────────────────────────────────────────

export default function App() {
  const [state, setState]   = useState("loading"); // loading | unauthenticated | idle | track
  const [track, setTrack]   = useState(null);
  const [palette, setPalette] = useState(FALLBACK_PALETTE);
  const [error, setError]   = useState(null);
  const lastTrackId = useRef(null);

  // Animated values for blob movement
  const blob1 = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const blob2 = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const blob3 = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  // ── Blob animations ────────────────────────────────────────────────────────

  useEffect(() => {
    const animateBlob = (blob, toX, toY, duration) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(blob, {
            toValue: { x: toX, y: toY },
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(blob, {
            toValue: { x: 0, y: 0 },
            duration,
            useNativeDriver: true,
          }),
        ])
      ).start();

    animateBlob(blob1,  60,  40, 8000);
    animateBlob(blob2, -55,  50, 9000);
    animateBlob(blob3,  70, -45, 10000);
  }, []);

  // ── Polling ────────────────────────────────────────────────────────────────

  useEffect(() => {
    let active = true;

    const poll = async () => {
      try {
        const res = await fetch(API_URL, {
          headers: sessionCookie ? { Cookie: sessionCookie } : {},
          credentials: "include",
        });

        // Capture the session cookie from the first response
        const setCookie = res.headers.get("set-cookie");
        if (setCookie) {
          const match = setCookie.match(/(PHPSESSID=[^;]+)/);
          if (match) sessionCookie = match[1];
        }

        const data = await res.json();
        if (!active) return;

        switch (data.type) {
          case "track":
            if (data.id !== lastTrackId.current) {
              lastTrackId.current = data.id;
              setTrack(data);
              setPalette(data.palette?.length >= 6 ? data.palette : FALLBACK_PALETTE);
            }
            setState("track");
            setError(null);
            break;

          case "idle":
            lastTrackId.current = null;
            setState("idle");
            setPalette(FALLBACK_PALETTE);
            break;

          case "unauthenticated":
            lastTrackId.current = null;
            setState("unauthenticated");
            setPalette(FALLBACK_PALETTE);
            break;

          case "error":
            setError(data.message || "Spotify API error – retrying…");
            break;
        }
      } catch {
        if (active) setError("Connection error – retrying…");
      }
    };

    poll();
    const timer = setInterval(poll, POLL_MS);
    return () => { active = false; clearInterval(timer); };
  }, []);

  // ── Login ──────────────────────────────────────────────────────────────────

  const handleLogin = async () => {
    // Opens login.php in the device browser.
    // PHP handles OAuth entirely server-side; tokens are stored on the server.
    // Once the user authenticates, the next poll will return track data.
    await WebBrowser.openBrowserAsync(LOGIN_URL);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  const { width, height } = Dimensions.get("window");
  const blobSize = Math.max(width, height) * 0.85;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* ── Gradient background ── */}
      <LinearGradient
        colors={["#111111", "#1a1a2e"]}
        style={StyleSheet.absoluteFill}
      />

      {/* ── Animated blobs ── */}
      <Animated.View
        style={[
          styles.blob,
          { width: blobSize, height: blobSize, backgroundColor: palette[0] + "cc",
            top: -blobSize * 0.3, left: -blobSize * 0.3 },
          { transform: blob1.getTranslateTransform() },
        ]}
      />
      <Animated.View
        style={[
          styles.blob,
          { width: blobSize * 0.9, height: blobSize * 0.9, backgroundColor: palette[1] + "bb",
            top: -blobSize * 0.25, right: -blobSize * 0.3 },
          { transform: blob2.getTranslateTransform() },
        ]}
      />
      <Animated.View
        style={[
          styles.blob,
          { width: blobSize * 0.8, height: blobSize * 0.8, backgroundColor: palette[2] + "99",
            bottom: -blobSize * 0.3, left: -blobSize * 0.2 },
          { transform: blob3.getTranslateTransform() },
        ]}
      />

      {/* ── Dark overlay ── */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(0,0,0,0.35)" }]} />

      {/* ── Content ── */}
      <View style={styles.content}>

        {/* Track state */}
        {state === "track" && track && (
          <View style={styles.card}>
            <Image
              source={{ uri: track.albumArt }}
              style={styles.albumArt}
              resizeMode="cover"
            />
            <Text style={styles.title} numberOfLines={2}>{track.title}</Text>
            <Text style={styles.artist} numberOfLines={1}>{track.artist}</Text>
            <Text style={styles.album}  numberOfLines={1}>{track.album}</Text>
          </View>
        )}

        {/* Idle state */}
        {state === "idle" && (
          <View style={styles.statePanel}>
            <Text style={styles.stateIcon}>🎵</Text>
            <Text style={styles.stateTitle}>Nothing playing</Text>
            <Text style={styles.stateSubtitle}>
              Start playing something on Spotify and it will appear here.
            </Text>
          </View>
        )}

        {/* Unauthenticated state */}
        {state === "unauthenticated" && (
          <View style={styles.statePanel}>
            <Text style={styles.stateIcon}>🔒</Text>
            <Text style={styles.stateTitle}>Connect Spotify</Text>
            <Text style={styles.stateSubtitle}>
              Sign in with your Spotify account to see what's playing.
            </Text>
            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
              <Text style={styles.loginBtnText}>Connect with Spotify</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Loading state */}
        {state === "loading" && (
          <View style={styles.statePanel}>
            <Text style={styles.stateIcon}>⏳</Text>
            <Text style={styles.stateTitle}>Connecting…</Text>
          </View>
        )}

        {/* Non-blocking error message */}
        {error && (
          <View style={styles.errorToast}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
  },
  blob: {
    position: "absolute",
    borderRadius: 999,
    opacity: 0.55,
    // Blur-like softness via opacity — React Native has no CSS blur for views
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },

  // ── Track card ──────────────────────────────────────────────────────────────
  card: {
    alignItems: "center",
    gap: 16,
  },
  albumArt: {
    width: 280,
    height: 280,
    borderRadius: 20,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.7,
    shadowRadius: 30,
    elevation: 20,
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
  artist: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 20,
    textAlign: "center",
  },
  album: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
    textAlign: "center",
  },

  // ── State panels ────────────────────────────────────────────────────────────
  statePanel: {
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 24,
  },
  stateIcon: {
    fontSize: 64,
  },
  stateTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  stateSubtitle: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 16,
    textAlign: "center",
    maxWidth: 300,
  },
  loginBtn: {
    marginTop: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 30,
  },
  loginBtnText: {
    color: "#111",
    fontSize: 16,
    fontWeight: "bold",
  },

  // ── Error toast ──────────────────────────────────────────────────────────────
  errorToast: {
    position: "absolute",
    bottom: 40,
    backgroundColor: "rgba(220,50,50,0.9)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
  },
  errorText: {
    color: "#fff",
    fontSize: 14,
  },
});
