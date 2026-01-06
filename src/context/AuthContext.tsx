import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthService } from '../services/AuthService';
import { UserService } from '../services/UserService';

interface AuthContextType {
  user: any;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  login: (mobileNumber: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (userData: any) => Promise<void>;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    try {
      const storedAccessToken = await AsyncStorage.getItem('accessToken');
      const storedRefreshToken = await AsyncStorage.getItem('refreshToken');

      if (storedAccessToken) {
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
        const profile = await UserService.getProfile();
        setUser(profile);
      }
    } catch (e) {
      console.log('Failed to load storage data:', e);
    } finally {
      setLoading(false);
    }
  };

  const login = async (mobileNumber: string, password: string) => {
    const data = await AuthService.login(mobileNumber, password);
    const { accessToken: access, refreshToken: refresh } = data;

    if (access) {
      await AsyncStorage.setItem('accessToken', access);
      if (refresh) {
        await AsyncStorage.setItem('refreshToken', refresh);
      }
      setAccessToken(access);
      setRefreshToken(refresh);

      const profile = await UserService.getProfile();
      setUser(profile);
    }
  };

  const signup = async (userData: any) => {
    await AuthService.signup(userData);
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  const isSuperAdmin = user?.roles === 'SUPERADMIN';
  const isAdmin = user?.roles?.includes('ROLE_ADMIN') || false;

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        loading,
        login,
        logout,
        signup,
        isAdmin,
        isSuperAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
