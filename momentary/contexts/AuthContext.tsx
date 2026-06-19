import { User, removeUserAvatar as apiRemoveUserAvatar, removeUserBanner as apiRemoveUserBanner, updateUser as apiUpdateUser, updateUserAvatar as apiUpdateUserAvatar, updateUserBanner as apiUpdateUserBanner, getUserById, loginUser, registerUser } from '@/lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, displayName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (fields: { display_name?: string; email?: string; bio?: string | null; status?: string | null; feeling?: string | null }) => Promise<void>;
  updateAvatar: (localUri: string) => Promise<void>;
  removeAvatar: () => Promise<void>;
  updateBanner: (localUri: string) => Promise<void>;
  removeBanner: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateUser: async () => {},
  updateAvatar: async () => {},
  removeAvatar: async () => {},
  updateBanner: async () => {},
  removeBanner: async () => {},
  refreshUser: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

const USER_ID_KEY = 'momentary_user_id';

async function readSavedUserId() {
  if (Platform.OS === 'web') {
    return AsyncStorage.getItem(USER_ID_KEY);
  }

  return SecureStore.getItemAsync(USER_ID_KEY);
}

async function saveUserId(userId: number) {
  const value = String(userId);

  if (Platform.OS === 'web') {
    await AsyncStorage.setItem(USER_ID_KEY, value);
    return;
  }

  await SecureStore.setItemAsync(USER_ID_KEY, value);
}

async function clearSavedUserId() {
  if (Platform.OS === 'web') {
    await AsyncStorage.removeItem(USER_ID_KEY);
    return;
  }

  await SecureStore.deleteItemAsync(USER_ID_KEY);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore the saved session on startup.
  useEffect(() => {
    (async () => {
      try {
        const storedId = await readSavedUserId();
        if (storedId) {
          const restored = await getUserById(Number(storedId));
          if (restored) {
            setUser(restored);
          } else {
            await clearSavedUserId();
          }
        }
      } catch {
        // Ignore restore errors and start fresh.
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const u = await loginUser(email, password);
    await saveUserId(u.id);
    setUser(u);
  }, []);

  const register = useCallback(
    async (username: string, displayName: string, email: string, password: string) => {
      const u = await registerUser(username, displayName, email, password);
      await saveUserId(u.id);
      setUser(u);
    },
    [],
  );

  const logout = useCallback(async () => {
    await clearSavedUserId();
    setUser(null);
  }, []);

  const updateUser = useCallback(async (fields: { display_name?: string; email?: string; bio?: string | null; status?: string | null; feeling?: string | null }) => {
    if (!user) return;
    const updated = await apiUpdateUser(user.id, fields);
    setUser(updated);
  }, [user]);

  const updateAvatar = useCallback(async (localUri: string) => {
    if (!user) return;
    const updated = await apiUpdateUserAvatar(user.id, localUri);
    setUser(updated);
  }, [user]);

  const removeAvatar = useCallback(async () => {
    if (!user) return;
    const updated = await apiRemoveUserAvatar(user.id);
    setUser(updated);
  }, [user]);

  const updateBanner = useCallback(async (localUri: string) => {
    if (!user) return;
    const updated = await apiUpdateUserBanner(user.id, localUri);
    setUser(updated);
  }, [user]);

  const removeBanner = useCallback(async () => {
    if (!user) return;
    const updated = await apiRemoveUserBanner(user.id);
    setUser(updated);
  }, [user]);

  const refreshUser = useCallback(async () => {
    if (!user) return;
    const fresh = await getUserById(user.id);
    if (fresh) setUser(fresh);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser, updateAvatar, removeAvatar, updateBanner, removeBanner, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
