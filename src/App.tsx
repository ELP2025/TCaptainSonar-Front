import './App.css';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import LobbyPage from './pages/LobbyPage.tsx';
 

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

      </Routes>
          </BrowserRouter>
    </AuthProvider>
  );
};

export default App;