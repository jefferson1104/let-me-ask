import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3333',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && [401].includes(error.response.status)) {
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        try {
          const { data } = await api.post('/auth/refresh-token', {
            refreshToken,
          });

          localStorage.setItem('access_token', data.accessToken);
          localStorage.setItem('refresh_token', data.refreshToken);

          error.config.headers.Authorization = `Bearer ${data.accessToken}`;

          return api.request(error.config);
        } catch (_refreshError) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');

          window.location.href = '/';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
