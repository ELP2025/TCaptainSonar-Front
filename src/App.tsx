import { useEffect, useState } from 'react';
import './App.css';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import Cookies from 'js-cookie';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <div>
      {isAuthenticated ? <HomePage /> : <LoginPage setIsAuthenticated={setIsAuthenticated} />}
    </div>
  );
}

export default App;
