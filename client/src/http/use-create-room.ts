import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { Slide, toast } from 'react-toastify';
import type { CreateRoomRequest } from '@/http/types/create-room-request';
import type { CreateRoomResponse } from '@/http/types/create-room-response';
import api from '@/services/api';

export function useCreateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateRoomRequest) => {
      const response = await api.post('/rooms', data);

      const result: CreateRoomResponse = await response.data;

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-rooms'] });

      toast.success('Room created successfully', {
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
    },
    onError: (error) => {
      const errorMessage =
        isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Unknown error';

      console.error('Error: ', errorMessage);

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
    },
  });
}
