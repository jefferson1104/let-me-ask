import api from './api';

type LoginWithGoogleResponse = {
  accessToken: string;
  refreshToken: string;
};

export async function loginWithGoogle(
  googleCredential: string
): Promise<LoginWithGoogleResponse> {
  const { data } = await api.post('/auth/google', {
    credential: googleCredential,
  });

  return data as LoginWithGoogleResponse;
}
