import api from './api';

type RefreshTokenResponse = {
  accessToken: string;
  refreshToken: string;
};

export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refresh_token');

  const { data } = await api.post('/auth/refresh-token', { refreshToken });

  return data as RefreshTokenResponse;
}
