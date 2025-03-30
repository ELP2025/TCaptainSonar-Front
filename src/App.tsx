import { useEffect, useState } from 'react';
import './App.css';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import Cookies from 'js-cookie';
import { BrowserRouter, Route, Routes } from 'react-router-dom';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/home" element={<HomePage setIsAuthenticated={setIsAuthenticated}/>} />
        <Route path="*" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
