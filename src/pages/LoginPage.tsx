import { useState } from 'react';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';

interface LoginPageProps {
    setIsAuthenticated: (value: boolean) => void;
}

function LoginPage({ setIsAuthenticated }: LoginPageProps) {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [error, setError] = useState('');

    const handleAuthSuccess = () => {
        setError('');
        setIsAuthenticated(true);
    };

    const handleAuthError = (errorMessage: string) => {
        setError(errorMessage);
    };

    return (
        <div style={{ padding: '2rem' }}>
            {isLoginMode ? (
                <LoginForm 
                    onSuccess={handleAuthSuccess}
                    onError={handleAuthError}
                    switchToRegister={() => {
                        setError('');
                        setIsLoginMode(false);
                    }}
                />
            ) : (
                <RegisterForm 
                    onSuccess={() => {
                        setError('');
                        setIsLoginMode(true);
                    }}
                    onError={handleAuthError}
                    switchToLogin={() => {
                        setError('');
                        setIsLoginMode(true);
                    }}
                />
            )}

            {error && (
                                <span className="nes-text is-error">{error}</span>
            )}
        </div>
    );
}

export default LoginPage