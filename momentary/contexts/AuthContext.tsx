import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, loginUser, registerUser, getUserById, updateUser as apiUpdateUser, updateUserAvatar as apiUpdateUserAvatar, removeUserAvatar as apiRemoveUserAvatar } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, displayName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (fields: { display_name?: string; email?: string }) => Promise<void>;
  updateAvatar: (localUri: string) => Promise<void>;
  removeAvatar: () => Promise<void>;
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
  refreshUser: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

const USER_ID_KEY = 'momentary_user_id';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    (async () => {
      try {
        const storedId = await AsyncStorage.getItem(USER_ID_KEY);
        if (storedId) {
          const restored = await getUserById(Number(storedId));
          if (restored) {
            setUser(restored);
          } else {
            await AsyncStorage.removeItem(USER_ID_KEY);
          }
        }
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const u = await loginUser(email, password);
    await AsyncStorage.setItem(USER_ID_KEY, String(u.id));
    setUser(u);
  }, []);

  const register = useCallback(
    async (username: string, displayName: string, email: string, password: string) => {
      const u = await registerUser(username, displayName, email, password);
      await AsyncStorage.setItem(USER_ID_KEY, String(u.id));
      setUser(u);
    },
    [],
  );

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(USER_ID_KEY);
    setUser(null);
  }, []);

  const updateUser = useCallback(async (fields: { display_name?: string; email?: string }) => {
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

  const refreshUser = useCallback(async () => {
    if (!user) return;
    const fresh = await getUserById(user.id);
    if (fresh) setUser(fresh);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser, updateAvatar, removeAvatar, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
