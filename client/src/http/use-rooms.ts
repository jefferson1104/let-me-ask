import { useQuery } from '@tanstack/react-query';

import api from '@/services/api';

import type { GetRoomsApiResponse } from './types/get-rooms-response';

export const useRooms = () => {
  return useQuery({
    queryKey: ['get-rooms'],
    queryFn: async () => {
      const { data } = await api.get('http://localhost:3333/rooms');

      return data as GetRoomsApiResponse;
    },
  });
};
