import { Stack } from 'expo-router';

// Stack navigator (wordt boven de app getoond voor de login scherm)
export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#f6edd0' },
      }}
    />
  );
}
