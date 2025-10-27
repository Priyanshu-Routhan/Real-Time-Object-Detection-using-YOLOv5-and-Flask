import React, { useState } from "react";
import LandingPage from "./LandingPage";
import ObjectDetection from "./ObjectDetection";

const App = () => {
  const [showDetection, setShowDetection] = useState(false);

  return (
    <div>
      {showDetection ? (
        <ObjectDetection />
      ) : (
        <LandingPage onEnter={() => setShowDetection(true)}/>
      )}
    </div>
  );
};

export default App;
