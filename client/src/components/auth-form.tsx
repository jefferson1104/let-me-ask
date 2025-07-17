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

const authSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),

  password: z
    .string()
    .nonempty({ message: 'Password is required' })
    .min(6, { message: 'It must be at least 6 characters long' }),
});

type AuthFormData = z.infer<typeof authSchema>;

export function AuthForm() {
  const authForm = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function handleAuth({ email, password }: AuthFormData) {
    console.log('Form submitted: ', { email, password });

    authForm.reset();
  }

  return (
    <Form {...authForm}>
      <form
        className="flex flex-col gap-4"
        onSubmit={authForm.handleSubmit(handleAuth)}
      >
        <FormField
          control={authForm.control}
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
          control={authForm.control}
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
