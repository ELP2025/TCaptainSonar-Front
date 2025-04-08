import './App.css';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import LobbyPage from './pages/LobbyPage.tsx'; 
import CaptainPage from './pages/CaptainPage.tsx';

function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={
          <ProtectedRoute>
            <HomePage  />
          </ProtectedRoute>
        } />        <Route path="*" element={<LoginPage />} />
        <Route path="/Lobby" element= {
          <ProtectedRoute> 
            <LobbyPage /> 
          </ProtectedRoute>} />
          <Route path="/Captain" element= {
          <ProtectedRoute> 
            <CaptainPage /> 
          </ProtectedRoute>} />

      </Routes>
          </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
// =======
// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import CaptainPage from "./pages/CaptainPage";
// import DetectorPage from "./pages/DetectorPage";

// const App: React.FC = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Navigate to="/captain" />} />
//         <Route path="/captain" element={<CaptainPage />} />
//         <Route path="/detector" element={<DetectorPage />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;
// // >>>>>>> origin/dev-mecano
