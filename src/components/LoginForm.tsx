// components/LoginForm.tsx
import "nes.css/css/nes.min.css";
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
    <form onSubmit={onSubmit} className="nes-container with-title ">
    <p className="title">Login</p>
      <input className="nes-field"
        type="text"
        placeholder="Nom d'utilisateur"
        onChange={onUsernameChange}
        required
      />
      <input className="nes-field"
        type="password"
        placeholder="Mot de passe"
        onChange={onPasswordChange}
        required
      />
    <button className="nes-btn" type="submit">Se connecter</button>
    </form>
  );
}