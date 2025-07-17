import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { RequireAuth } from '@/components/require-auth';
import { AuthProvider } from '@/contexts/auth-context';
import { CreateRoom } from '@/pages/create-room';
import { RecordRoomAudio } from '@/pages/record-room-audio';
import { Room } from '@/pages/room';
import { SignIn } from '@/pages/sign-in';

export function App() {
  const queryClient = new QueryClient();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route element={<SignIn />} index />
              <Route
                element={
                  <RequireAuth>
                    <CreateRoom />
                  </RequireAuth>
                }
                path="/create-room"
              />
              <Route
                element={
                  <RequireAuth>
                    <Room />
                  </RequireAuth>
                }
                path="/room/:roomId"
              />
              <Route
                element={
                  <RequireAuth>
                    <RecordRoomAudio />
                  </RequireAuth>
                }
                path="/room/:roomId/audio"
              />
            </Routes>
            <ToastContainer />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}
