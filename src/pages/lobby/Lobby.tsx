import React, { useState } from 'react';
import './Lobby.css';
import "nes.css/css/nes.min.css";

// Type pour les props (permet de personnaliser les rôles)
interface LobbyProps {
  availableRoles?: string[];
}

const Lobby: React.FC<LobbyProps> = ({ 
  availableRoles = ["Capitaine", "Second", "Ingénieur", "Opérateur Radio"] 
}) => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleRoleSelection = (role: string) => {
    setSelectedRole(prev => prev === role ? null : role);
  };

  return (
    <div className="lobby-container">
  <h1>Captain Sonar Lobby</h1>
  
  <p>
    {selectedRole 
      ? `Vous avez sélectionné : ${selectedRole}` 
      : "Choisissez votre rôle :"}
  </p>
  
  <div className="roles-selection">
    {availableRoles.map(role => (
      <button
        key={role}
        className={`nes-btn ${selectedRole === role ? 'is-primary' : ''}`}
        onClick={() => handleRoleSelection(role)}
      >
        {role}
      </button>
    ))}
  </div>
</div>
  );
};

export default Lobby;