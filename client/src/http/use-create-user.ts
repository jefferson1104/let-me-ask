import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { Slide, toast } from 'react-toastify';

import type { CreateUserRequest } from '@/http/types/create-user-request';
import api from '@/services/api';

export function useCreateUser() {
  return useMutation({
    mutationFn: async (data: CreateUserRequest) => {
      const response = await api.post('/auth/register', data);

      await response.data;

      return;
    },
    onSuccess: () => {
      toast.success('User created successfully', {
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
