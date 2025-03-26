// components/LoginForm.tsx
import "nes.css/css/nes.min.css";

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
    <form onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Nom d'utilisateur"
        onChange={onUsernameChange}
        required
      />
      <input
        type="password"
        placeholder="Mot de passe"
        onChange={onPasswordChange}
        required
      />
    <button type="submit">Se connecter</button>
    </form>
  );
}