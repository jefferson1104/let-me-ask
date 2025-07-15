import { GoogleLogin } from '@react-oauth/google';
import { Navigate, useNavigate } from 'react-router-dom';

import { useAuth } from '@/contexts/auth-context';

export function Auth() {
  const navigate = useNavigate();
  const { accessToken, login } = useAuth();

  const handleAuth = async (credential: string) => {
    await login(credential);
    navigate('/create-room', { replace: true });
  };

  if (accessToken) {
    return <Navigate replace to="/create-room" />;
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="font-black text-2xl text-zinc-100">Login</h1>
      <GoogleLogin
        onError={() => alert('Error: login failed')}
        onSuccess={(response) => {
          if (response.credential) {
            handleAuth(response.credential);
          }
        }}
      />
    </div>
  );
}
