import { ChevronLeft, Wand } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';

type RoomParams = {
  roomId: string;
};

export function Room() {
  const params = useParams<RoomParams>();

  if (!params.roomId) {
    return <Navigate replace to="/" />;
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-100 dark:bg-neutral-900">
      <div className="flex w-full max-w-md flex-col items-center rounded-2xl bg-white p-10 shadow-xl dark:bg-neutral-800">
        <h1 className="mb-8 text-center font-bold text-2xl text-gray-900 dark:text-white">
          Sala #{params.roomId}
        </h1>

        <p className="mb-8 text-center text-gray-600 dark:text-gray-300">
          Bem-vindo à sala! Aqui você pode interagir, fazer perguntas e
          compartilhar ideias.
        </p>

        <div className="flex w-full flex-col flex-nowrap items-center gap-4">
          <Button className="w-full" size="lg">
            <Wand className="mr-2" /> Nova pergunta
          </Button>

          <Link className="flex w-full items-center" to="/">
            <Button className="w-full " size="lg" variant="outline">
              <ChevronLeft className="mr-2" /> Nova pergunta
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
