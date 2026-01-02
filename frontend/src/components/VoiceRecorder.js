import React, { useState } from "react";
import { ReactMic } from "react-mic";

export default function VoiceRecorder() {
  const [isRecording, setRecording] = useState(false);

  return (
    <div>
      <ReactMic
        record={isRecording}
        className="sound-wave"
        onStop={(recordedBlob) =>
          console.log("blob", recordedBlob)
        }
      />
      <button onClick={() => setRecording(!isRecording)}>
        {isRecording ? "Stop" : "Record"}
      </button>
    </div>
  );
}
