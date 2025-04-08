import { useState } from 'react';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';
import { useNavigate } from 'react-router-dom';
import { useCss } from '../hooks/useCss';

function LoginPage() {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    useCss(
        "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css",
        "bootstrap-css"
      );
    const handleAuthSuccess = () => {
        setError('');
        navigate('/home');
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