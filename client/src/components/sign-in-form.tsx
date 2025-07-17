import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const signInSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
  password: z
    .string()
    .nonempty({ message: 'Password is required' })
    .min(6, { message: 'It must be at least 6 characters long' }),
});

type SignInFormData = z.infer<typeof signInSchema>;

export function SignInForm() {
  const signIn = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function handleSignIn({ email, password }: SignInFormData) {
    console.log('Form submitted: ', { email, password });

    signIn.reset();
  }

  return (
    <Form {...signIn}>
      <form
        className="flex flex-col gap-4"
        onSubmit={signIn.handleSubmit(handleSignIn)}
      >
        <FormField
          control={signIn.control}
          name="email"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={signIn.control}
          name="password"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <Button className="w-full" type="submit">
          Sign In
        </Button>
      </form>
    </Form>
  );
}
