import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

type GetRoomsApiResponse = Array<{
  id: string;
  name: string;
}>;

export function CreateRoom() {
  const { data, isLoading } = useQuery({
    queryKey: ['get-rooms'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3333/rooms');

      const result: GetRoomsApiResponse = await response.json();

      return result;
    },
  });

  return (
    <div>
      <h1 className="mb-8 font-bold ">Create Room</h1>

      {isLoading && <p>Loading...</p>}

      {!isLoading &&
        data &&
        data.map((room) => (
          <div className="mb-4" key={room.id}>
            <Link className="underline" to={`/room/${room.id}`}>
              Access Room {room.name}
            </Link>
          </div>
        ))}
    </div>
  );
}
