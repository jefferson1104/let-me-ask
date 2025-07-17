import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SignUpForm } from '@/components/sign-up-form';
import { Button } from '@/components/ui/button';

export function SignUp() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="container mx-auto max-w-md px-4 py-8">
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <Link to="/">
              <Button variant="outline">
                <ArrowLeft className="mr-2 size-4" />
                Back
              </Button>
            </Link>
          </div>
          <div className="mt-16">
            <h1 className="mb-2 font-bold text-3xl text-foreground">Sign Up</h1>
            <p className="text-muted-foreground">Create your account here.</p>
          </div>
        </div>

        <SignUpForm />
      </div>
    </div>
  );
}
