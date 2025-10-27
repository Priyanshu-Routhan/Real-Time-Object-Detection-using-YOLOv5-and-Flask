import React from "react";

const LandingPage = ({ onEnter }) => {
  return (
    <div 
      className="relative w-full h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/Entry-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0  bg-opacity-0 flex flex-col justify-end items-center p-10">
        <button 
          className="animate-bounce bg-white text-black px-6 py-3 rounded-full shadow-lg hover:bg-gray-300 transition text-lg md:text-xl"
          onClick={onEnter}
        >
          ⬆ Yolo Detection
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
