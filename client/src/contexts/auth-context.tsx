import { isAxiosError } from 'axios';
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Slide, toast } from 'react-toastify';

import api from '@/services/api';

type AuthContextType = {
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: (googleCredential: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data } = await api.post('/auth', { email, password });

      localStorage.setItem('access_token', data.accessToken);
      localStorage.setItem('refresh_token', data.refreshToken);

      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
    } catch (error) {
      const errorMessage =
        isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Unknown error';

      console.error('signIn() Error: ', errorMessage);

      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
        transition: Slide,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async (googleCredential: string) => {
    try {
      setIsLoading(true);

      const { data } = await api.post('/auth/google', {
        credential: googleCredential,
      });

      localStorage.setItem('access_token', data.accessToken);
      localStorage.setItem('refresh_token', data.refreshToken);

      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
    } catch (error) {
      const errorMessage =
        isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Unknown error';

      console.error('signInWithGoogle() Error: ', errorMessage);

      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
        transition: Slide,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  };

  useEffect(() => {
    const accessTokenFromStorage = localStorage.getItem('access_token');
    const refreshTokenFromStorage = localStorage.getItem('refresh_token');

    setAccessToken(accessTokenFromStorage);
    setRefreshToken(refreshTokenFromStorage);
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signInWithGoogle,
        signOut,
        isLoading,
        accessToken,
        refreshToken,
      }}
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
