import { useState } from "react";
import { LoginForm } from "../components/LoginForm";

interface LoginPageProps {
    setIsAuthenticated: (value: boolean) => void;
  }
  
  function LoginPage({ setIsAuthenticated }: LoginPageProps) {
      const [username, setUsername] = useState('');
      const [password, setPassword] = useState('');
      const [error, setError] = useState('');
  
      const handleLogin = async (e: React.FormEvent) => {
          e.preventDefault();
          try {
              const response = await fetch('http://localhost:3000/login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ username, password }),
              });
  
              const data = await response.json();
  
              if (!response.ok) {
                  throw new Error(data.message || 'Erreur de connexion');
              }
              document.cookie = "token="+data.token
              setIsAuthenticated(true); // <-- Ceci déclenche le re-render et affiche la HomePage
          } catch (err) {
              setError((err as Error).message);
          }
      };
  
      return <LoginForm error="" onSubmit={handleLogin} onPasswordChange={(e) => setPassword(e.target.value)} onUsernameChange={(e) => setUsername(e.target.value)}/>
  }

export default LoginPage; 