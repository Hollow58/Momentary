// Fonts
import { GildaDisplay_400Regular, useFonts } from '@expo-google-fonts/gilda-display';
import { Nunito_400Regular, Nunito_600SemiBold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
// Navigation tools
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

// Auth and notification context
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { ActivityIndicator, View } from 'react-native';
import { styles } from '@/styles/screens/root-layout';

SplashScreen.preventAutoHideAsync();

// Component sends users to the right screen
function RootNavigator() {
  // Check if there is a logged in user
  const { user, isLoading } = useAuth();
  // Check which screen the user is on
  const segments = useSegments();
  const router = useRouter();

  // Send user to the right screen
  useEffect(() => {
    // Wait until user is logged in
    if (isLoading) return;

    // Check if the user is currently on an auth screen
    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // Not logged in -> go to login
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // Already logged in -> go to the main app
      router.replace('/(tabs)');
    }
  }, [user, isLoading, router, segments]);

  // Show a spinner while the app checks if someone is logged in
  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#444" />
      </View>
    );
  }

  // Set up the main navigation stack with auth, tabs, and create-post screens
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      {/* Create post opens popup from the bottom */}
      <Stack.Screen
        name="create-post"
        options={{ presentation: 'modal' }}
      />
    </Stack>
  );
}

// Main layout component
export default function RootLayout() {
  // Load all fonts
  const [fontsLoaded] = useFonts({
    GildaDisplay_400Regular,
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_800ExtraBold,
  });

  // Hide the loading screen once fonts are ready
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Show nothing until fonts are loaded
  if (!fontsLoaded) {
    return null;
  }

  // Wrap app in AuthProvider and NotificationProvider
  return (
    <AuthProvider>
      <NotificationProvider>
        <RootNavigator />
        <StatusBar style="dark" />
      </NotificationProvider>
    </AuthProvider>
  );
}


