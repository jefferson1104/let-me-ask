/** biome-ignore-all lint/suspicious/noConsole: depois vou apagar */
import { useRef, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const isRecordingSupported =
  !!navigator.mediaDevices &&
  typeof navigator.mediaDevices.getUserMedia === 'function' &&
  typeof window.MediaRecorder === 'function';

type RoomParams = {
  roomId: string;
};

export function RecordRoomAudio() {
  const params = useParams<RoomParams>();

  const recorder = useRef<MediaRecorder | null>(null);

  const [isRecording, setIsRecording] = useState(false);

  async function uploadAudio(audio: Blob) {
    const formData = new FormData();

    formData.append('audio', audio, 'audio.webm');

    const response = await fetch(
      `http://localhost:3333/rooms/${params.roomId}/audio`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const result = await response.json();

    console.log(result);
  }

  async function startRecording() {
    if (!isRecordingSupported) {
      alert('Your browser does not support the record audio feature.');
      return;
    }

    setIsRecording(true);

    const audio = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44_100,
      },
    });

    recorder.current = new MediaRecorder(audio, {
      mimeType: 'audio/webm',
      audioBitsPerSecond: 64_000,
    });

    recorder.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        uploadAudio(event.data);
      }
    };

    recorder.current.onstart = () => {
      console.log('Recording started');
    };

    recorder.current.onstop = () => {
      console.log('Recording stopped');
    };

    recorder.current.start();
  }

  function stopRecording() {
    setIsRecording(false);

    if (recorder.current && recorder.current.state !== 'inactive') {
      recorder.current.stop();
    }
  }

  if (!params.roomId) {
    return <Navigate replace to="/" />;
  }
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3">
      <Button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? 'Stop recording' : 'Record audio'}
      </Button>
      {isRecording ? <p>Recording...</p> : <p>Stopped</p>}
    </div>
  );
}
