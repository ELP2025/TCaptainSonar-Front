import React, { useEffect, useState } from 'react';
import './Lobby.css';
import "nes.css/css/nes.min.css";
import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';
import { useAuth } from '../../context/AuthContext';

interface LobbyProps {
  availableRoles?: string[];
}

type TeamType = 'blue' | 'red';
type RoleSelection = { team: TeamType; role: string } | null;

const Lobby: React.FC<LobbyProps> = ({ 
  availableRoles = ["Capitaine", "Second", "Ingénieur", "Opérateur Radio"] 
}) => {
  const { isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [selected, setSelected] = useState<RoleSelection>(null);
  const [occupiedRoles, setOccupiedRoles] = useState<Record<TeamType, string[]>>({
    blue: [],
    red: []
  });

  useEffect(() => {
    if (!isAuthenticated) return;

    const newSocket = io('http://localhost:3000', {
      auth: { token: Cookies.get('token') }
    });

    setSocket(newSocket);

    newSocket.on('roles_update', (updatedOccupied: Record<TeamType, string[]>) => {
      setOccupiedRoles(updatedOccupied);
    });

    return () => {
      newSocket.close();
    };
  }, [isAuthenticated]);

  const handleSelection = (team: TeamType, role: string) => {
    const newSelection = selected?.role === role && selected.team === team ? null : { team, role };
    setSelected(newSelection);
    
    if (socket) {
      socket.emit('role_selection', {
        team,
        role,
        action: newSelection ? 'select' : 'deselect'
      });
    }
  };

  const isRoleOccupied = (team: TeamType, role: string) => 
    occupiedRoles[team].includes(role);

  const renderTeamSection = (team: TeamType) => (
    <div className={`team-section ${team}-team`}>
      <h2 className={`nes-text is-${team === 'blue' ? 'primary' : 'error'}`}>
        Équipe {team === 'blue' ? 'Bleue' : 'Rouge'}
      </h2>
      <div className="roles-grid">
        {availableRoles.map(role => (
          <button
            key={`${team}-${role}`}
            className={`nes-btn ${
              selected?.team === team && selected.role === role 
                ? 'is-primary' 
                : isRoleOccupied(team, role) ? 'is-disabled' : ''
            }`}
            onClick={() => handleSelection(team, role)}
            disabled={isRoleOccupied(team, role)}
          >
            {role}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="lobby-container">
      <h1>Captain Sonar Lobby</h1>
      <div className="teams-container">
        {renderTeamSection('blue')}
        {renderTeamSection('red')}
      </div>
    </div>
  );
};

export default Lobby;