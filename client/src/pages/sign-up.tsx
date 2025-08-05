import { SignUpForm } from '@/components/sign-up-form';

export function SignUp() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="container mx-auto max-w-md px-4 py-8">
        <div className="mt-16 flex flex-col gap-8">
          <div className="flex flex-col">
            <h1 className="mb-2 font-bold text-3xl text-foreground">Sign Up</h1>
            <p className="text-muted-foreground">Create your account here.</p>
          </div>

          <SignUpForm />
        </div>
      </div>
    </div>
  );
}
