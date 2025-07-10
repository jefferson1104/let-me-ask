import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCreateRoom } from '@/http/use-create-room';
import { Button } from './ui/button';

const createRoomSchema = z.object({
  name: z.string().min(3, { message: 'It must be at least 3 characters long' }),
  description: z.string(),
});

type CreateRoomFormData = z.infer<typeof createRoomSchema>;

export function CreateRoomForm() {
  const { mutateAsync: createRoom } = useCreateRoom();

  const createRoomForm = useForm<CreateRoomFormData>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  async function handleCreateRoom({ name, description }: CreateRoomFormData) {
    await createRoom({ name, description });
    createRoomForm.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create room</CardTitle>
        <CardDescription>
          Create a new room to start asking questions and receive answers from
          IA
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...createRoomForm}>
          <form
            className="flex flex-col gap-4"
            onSubmit={createRoomForm.handleSubmit(handleCreateRoom)}
          >
            <FormField
              control={createRoomForm.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Room name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Type room name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={createRoomForm.control}
              name="description"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <Button className="w-full" type="submit">
              Create room
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
