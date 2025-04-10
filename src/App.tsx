import './App.css';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import LobbyPage from './pages/LobbyPage.tsx';;
import CaptainPage from './pages/CaptainPage.tsx';
import SecondPage from './pages/SecondPage.tsx';
import MecanoPage from './pages/MecanoPage.tsx';
import DetectorPage from './pages/DetectorPage.tsx';
 
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
        } />        
        <Route path="*" element={<LoginPage />} />
        <Route path="/Lobby" element= {
          <ProtectedRoute> 
            <LobbyPage /> 
          </ProtectedRoute>} />
          <Route path="/Capitaine" element= {
          <ProtectedRoute> 
            <CaptainPage/> 
          </ProtectedRoute>} />
          <Route path="/Mecano" element= {
          <ProtectedRoute> 
            <MecanoPage /> 
          </ProtectedRoute>} />
          <Route path="/Second" element= {
          <ProtectedRoute> 
            <SecondPage /> 
          </ProtectedRoute>} />
          <Route path="/Detector" element= {
            <ProtectedRoute>
              <DetectorPage/>
            </ProtectedRoute>
          }  />
      </Routes>
          </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
