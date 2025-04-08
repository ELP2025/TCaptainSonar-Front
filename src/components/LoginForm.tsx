import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface LoginFormProps {
    onSuccess: () => void;
    onError: (error: string) => void;
    switchToRegister: () => void;
}

export function LoginForm({ onSuccess, onError, switchToRegister }: LoginFormProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
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
            login(data.token)
            onSuccess();
        } catch (err) {
            onError(err instanceof Error ? err.message : 'Erreur inconnue');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="nes-container with-title" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h2 className="title">Connexion</h2>
            <form onSubmit={handleSubmit}>
                <div className="nes-field" style={{ marginBottom: '1rem' }}>
                    <label htmlFor="username">Nom d'utilisateur</label>
                    <input
                        id="username"
                        type="text"
                        className="nes-input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                
                <div className="nes-field" style={{ marginBottom: '2rem' }}>
                    <label htmlFor="password">Mot de passe</label>
                    <input
                        id="password"
                        type="password"
                        className="nes-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    className={`nes-btn is-primary ${isLoading ? 'is-disabled' : ''}`}
                    disabled={isLoading}
                >
                    {isLoading ? 'Connexion...' : 'Se connecter'}
                </button>
            </form>

            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <button 
                    type="button" 
                    className="nes-btn"
                    onClick={switchToRegister}
                >
                    Pas de Compte ? S'inscrire
                </button>
            </div>
        </div>
    );
}