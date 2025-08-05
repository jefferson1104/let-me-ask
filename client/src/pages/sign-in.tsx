import { GoogleLogin } from '@react-oauth/google';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { SignInForm } from '@/components/sign-in-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';

export function SignIn() {
  // Hooks
  const navigate = useNavigate();
  const { signInWithGoogle, accessToken } = useAuth();

  // Methods
  const handleRedirectToHome = () => {
    navigate('/create-room', { replace: true });
  };

  const handleGoogleSignIn = async (credential: string) => {
    await signInWithGoogle(credential);
    handleRedirectToHome();
  };

  // Renders
  if (accessToken) {
    return <Navigate replace to="/create-room" />;
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <Card className="min-w-80">
        <CardHeader className="flex flex-col items-center justify-center">
          <img
            alt="logo"
            className="w-36"
            src="/assets/images/logo-light.svg"
          />
          <CardTitle>Sign In</CardTitle>
          <CardDescription className="text-center text-xs">
            Type your email and password to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-8">
          <SignInForm />

          <div className="flex items-center gap-1">
            <p className="text-muted-foreground text-sm">
              if you don't have an account{' '}
              <Link className="text-zinc-200 underline" to="/sign-up">
                Sign Up
              </Link>{' '}
              first
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-2">
            <CardDescription className="text-center text-xs">
              Or use your Google account to sign in.
            </CardDescription>
            <GoogleLogin
              onError={() => alert('Error: login failed')}
              onSuccess={(response) => {
                if (response.credential) {
                  handleGoogleSignIn(response.credential);
                }
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
