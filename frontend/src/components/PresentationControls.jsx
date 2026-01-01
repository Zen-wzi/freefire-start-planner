"use client";
import { useRef, useState } from "react";

export default function PresentationControls() {
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);
  const [recording, setRecording] = useState(false);

  const startRecording = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true
      });

      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });

      const combinedStream = new MediaStream([
        ...screenStream.getVideoTracks(),
        ...audioStream.getAudioTracks()
      ]);

      const mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType: "video/webm"
      });

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunks.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks.current, {
          type: "video/webm"
        });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "strategy-presentation.webm";
        a.click();

        recordedChunks.current = [];
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setRecording(true);
    } catch (err) {
      console.error("Recording failed", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      {!recording ? (
        <button onClick={startRecording}>🎥 Start Presentation</button>
      ) : (
        <button onClick={stopRecording}>⏹ Stop & Save</button>
      )}
    </div>
  );
}
