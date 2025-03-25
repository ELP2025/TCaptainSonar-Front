import { useState } from "react";

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
  
              localStorage.setItem('token', data.token);
              setIsAuthenticated(true); // <-- Ceci déclenche le re-render et affiche la HomePage
          } catch (err) {
              setError((err as Error).message);
          }
      };
  
      return <div>
          {error && <p style={{color: 'red'}}>{error}</p>}
          <form onSubmit={handleLogin}>
              <input type="text"
                      placeholder="Nom d'utilisateur"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required />
              <input type="password"
                      placeholder="Mot de passe"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required />
              <button type="submit">Se connecter</button>
          </form>
      </div>
  }

export default LoginPage; 