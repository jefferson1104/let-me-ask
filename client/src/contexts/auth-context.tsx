import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import { loginWithGoogle } from '@/services/google-oauth';
import { refreshAccessToken } from '@/services/refresh-token';

type AuthContextType = {
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  login: (googleCredential: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const login = async (googleCredential: string) => {
    const response = await loginWithGoogle(googleCredential);

    localStorage.setItem('access_token', response.accessToken);
    localStorage.setItem('refresh_token', response.refreshToken);

    setAccessToken(response.accessToken);
    setRefreshToken(response.refreshToken);
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  };

  const refresh = async () => {
    const response = await refreshAccessToken();
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    localStorage.setItem('access_token', response.accessToken);
    localStorage.setItem('refresh_token', response.refreshToken);
  };

  useEffect(() => {
    const accessTokenFromStorage = localStorage.getItem('access_token');
    const refreshTokenFromStorage = localStorage.getItem('refresh_token');

    setAccessToken(accessTokenFromStorage);
    setRefreshToken(refreshTokenFromStorage);
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ accessToken, refreshToken, login, logout, refresh, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
