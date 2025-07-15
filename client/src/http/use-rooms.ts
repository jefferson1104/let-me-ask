import { useQuery } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { Slide, toast } from 'react-toastify';

import api from '@/services/api';

import type { GetRoomsApiResponse } from './types/get-rooms-response';

export const useRooms = () => {
  return useQuery({
    queryKey: ['get-rooms'],
    queryFn: async () => {
      try {
        const response = await api.get('http://localhost:3333/rooms');

        const result: GetRoomsApiResponse = await response.data;

        return result;
      } catch (error) {
        const errorMessage =
          isAxiosError(error) && error.response?.data?.message
            ? error.response.data.message
            : 'Unknown error';

        console.error('ERROR ==> ', errorMessage);

        toast.error(errorMessage, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
          transition: Slide,
        });
      }
    },
  });
};
