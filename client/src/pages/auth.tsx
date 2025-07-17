import { GoogleLogin } from '@react-oauth/google';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthForm } from '@/components/auth-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
      <Card className="min-w-80">
        <CardHeader className="flex flex-col items-center justify-center">
          <CardTitle>Sign in</CardTitle>
          <CardDescription className="text-center text-xs">
            Type your email and password to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-8">
          <AuthForm />
          <div className="flex flex-col items-center justify-center gap-2">
            <CardDescription className="text-center text-xs">
              Or use your Google account to sign in.
            </CardDescription>
            <GoogleLogin
              onError={() => alert('Error: login failed')}
              onSuccess={(response) => {
                if (response.credential) {
                  handleAuth(response.credential);
                }
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
