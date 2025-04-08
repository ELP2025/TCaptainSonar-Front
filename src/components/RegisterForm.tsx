import { useState } from 'react';

interface RegisterFormProps {
    onSuccess: () => void;
    onError: (error: string) => void;
    switchToLogin: () => void;
}

export function RegisterForm({ onSuccess, onError, switchToLogin }: RegisterFormProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:3000/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Erreur lors de l'inscription");
            }

            onSuccess();
        } catch (err) {
            onError(err instanceof Error ? err.message : "Erreur inconnue lors de l'inscription");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="nes-container with-title" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h2 className="title">Inscription</h2>
            <form onSubmit={handleSubmit}>
                <div className="nes-field " style={{ marginBottom: '1rem' }}>
                    <label htmlFor="reg-username">Nom d'utilisateur</label>
                    <input
                        id="reg-username"
                        type="text"
                        className="nes-input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="nes-field" style={{ marginBottom: '2rem' }}>
                    <label htmlFor="reg-password">Mot de passe</label>
                    <input
                        id="reg-password"
                        type="password"
                        className="nes-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    className={`nes-btn is-success ${isLoading ? 'is-disabled' : ''}`}
                    disabled={isLoading}
                >
                    {isLoading ? 'Inscription...' : 'S\'inscrire'}
                </button>
            </form>

            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <button 
                    type="button" 
                    className="nes-btn"
                    onClick={switchToLogin}
                >
                    Déjà un compte ? Se connecter
                </button>
            </div>
        </div>
    );
}