import React, { useState, useEffect } from "react";
import axios from "axios";

const ObjectDetection = () => {
  const [image, setImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [webcamActive, setWebcamActive] = useState(false);
  const [streamUrl, setStreamUrl] = useState(null);

  const handleFileChange = (e) => setImage(e.target.files[0]);

  const uploadImage = async () => {
    if (!image) return alert("Please select an image!");
    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await axios.post("http://127.0.0.1:5000/detect-image", formData, {
        responseType: "blob",
      });
      setResultImage(URL.createObjectURL(response.data));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (webcamActive) {
      const interval = setInterval(() => {
        setStreamUrl(`http://127.0.0.1:5000/detect-webcam?timestamp=${new Date().getTime()}`);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setStreamUrl(null);
    }
  }, [webcamActive]);

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/back4.jpg')" }} // Background Image
    >
      <h1 className="text-4xl font-bold mb-6">Object Detection</h1>

      {/* Image/Webcam Box */}
      <div className="w-full max-w-2xl border-4 border-blue-500 rounded-lg shadow-lg overflow-hidden mb-6 bg-gray-700">
        {webcamActive && streamUrl ? (
          <img src={streamUrl} alt="Webcam Stream" className="w-full h-80 object-cover" />
        ) : resultImage ? (
          <img src={resultImage} alt="Detected" className="w-full h-80 object-cover" />
        ) : (
          <img 
            src="/images/Yolo2.jpg" 
            alt="Default" 
            className="w-full h-80 object-cover " // Default Image with Fixed Size
          />
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md w-96 flex flex-col items-center">
        <input 
          type="file" 
          className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600" 
          onChange={handleFileChange} 
        />
        <button 
          className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition"
          onClick={uploadImage}
        >
          Detect Objects
        </button>

        <button 
          className="mt-4 w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg transition"
          onClick={() => setWebcamActive(!webcamActive)}
        >
          {webcamActive ? "Stop Webcam" : "Start Webcam"}
        </button>
      </div>
    </div>
  );
};

export default ObjectDetection;
