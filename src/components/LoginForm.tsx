// components/LoginForm.tsx

import "../style/Login.css"

interface LoginFormProps {
  error: string;
  onUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function LoginForm({
  onUsernameChange,
  onPasswordChange,
  onSubmit,
}: LoginFormProps) {
  return (
    <form onSubmit={onSubmit} className="nes-container with-title" style={{ maxWidth: '400px', margin: '0 auto' }}>
    <h3 className="title">Login</h3>
    
    <div className="nes-field" style={{ marginBottom: '1.5rem' }}>
        <input
            type="text"
            className="nes-input"
            placeholder="Nom d'utilisateur"
            onChange={onUsernameChange}
            required
        />
    </div>
    
    <div className="nes-field" style={{ marginBottom: '2rem' }}>
        <input
            type="password"
            className="nes-input"
            placeholder="Mot de passe"
            onChange={onPasswordChange}
            required
        />
    </div>
    
    <div style={{ textAlign: 'center' }}>
        <button className="nes-btn is-primary" type="submit" style={{ width: '100%' }}>
            Se connecter
        </button>
    </div>
</form>
  );
}