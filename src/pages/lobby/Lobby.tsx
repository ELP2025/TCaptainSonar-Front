import React, {useEffect, useState } from 'react';
import './Lobby.css';
import "nes.css/css/nes.min.css";
import { io, Socket } from 'socket.io-client';

// Type pour les props (permet de personnaliser les rôles)
interface LobbyProps {
  availableRoles?: string[];
}

const Lobby: React.FC<LobbyProps> = ({ 
  availableRoles = ["Capitaine", "Second", "Ingénieur", "Opérateur Radio"] 
}) => { 




    const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to the server');
    });


    newSocket.on('disconnect', () => {
      console.log('Disconnected from the server');
    });

    return () => {
      newSocket.close();
    };
  }, []);



  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleRoleSelection = (role: string) => {
    const newRole = selectedRole === role ? null : role;
    setSelectedRole(newRole);
    sendMessage(newRole); 
  };
    
  const sendMessage = (role: string | null) => {
    if (socket) {
      socket.emit('role', role);
    }
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