import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (isCameraOn) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isCameraOn, isFrontCamera]);

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: isFrontCamera ? 'user' : 'environment',
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error('Error accessing camera: ', err);
    }
  };

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const image = canvas.toDataURL('image/png');
    setCapturedImage(image);
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const switchCamera = () => {
    setIsFrontCamera(prevState => !prevState);
  };

  return (
    <div>
      <div>
        {isCameraOn ? (
          <video ref={videoRef} style={{ width: '100%' }} playsInline />
        ) : (
          <button onClick={() => setIsCameraOn(true)}>Switch on Camera</button>
        )}
      </div>
      {isCameraOn && (
        <div>
          <button onClick={captureImage}>Capture Image</button>
          <button onClick={() => setIsCameraOn(false)}>Switch off Camera</button>
          <button onClick={switchCamera}>Switch Camera</button>
        </div>
      )}
      {capturedImage && (
        <div>
          <h3>Captured Image:</h3>
          <img src={capturedImage} alt="Captured" />
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    </div>
  );
}

export default App;
