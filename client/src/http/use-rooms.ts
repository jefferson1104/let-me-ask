import { useQuery } from '@tanstack/react-query';

import type { GetRoomsApiResponse } from './types/get-rooms-response';

export const useRooms = () => {
  return useQuery({
    queryKey: ['get-rooms'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3333/rooms');

      const result: GetRoomsApiResponse = await response.json();

      return result;
    },
  });
};
