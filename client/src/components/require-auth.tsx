import type { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';

interface RequireAuthProps {
  children: JSX.Element;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const { accessToken, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Carregando...
      </div>
    );
  }

  if (!accessToken) {
    return <Navigate replace to="/" />;
  }

  return children;
}
