import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import CaptainPage from "./pages/CaptainPage";
import DetectorPage from "./pages/DetectorPage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/captain" />} />
        <Route path="/captain" element={<CaptainPage />} />
        <Route path="/detector" element={<DetectorPage />} />
      </Routes>
    </Router>
  );
};

export default App;
