import React, { useEffect, useState } from 'react';
import './Lobby.css';
import "nes.css/css/nes.min.css";
import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from "react-router-dom";

interface LobbyProps {
  availableRoles?: string[];
}
interface Team {
  Captain: string;
}
interface TeamUpdate {
  blue: Team;
  red: Team;
}

type TeamType = 'blue' | 'red';
type RoleSelection = { team: TeamType; role: string } | null;

const Lobby: React.FC<LobbyProps> = ({ 
  availableRoles = ["Capitaine", "Second", "Ingénieur", "Opérateur Radio"] 
  // availableRoles = ["Capitaine"]
}) => {
  const { isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [selected, setSelected] = useState<RoleSelection>(null);
  const navigate = useNavigate();
  const [occupiedRoles, setOccupiedRoles] = useState<Record<TeamType, string[]>>({
    blue: [],
    red: []
  });
  const [flag, setFlag] = useState(false)

  if(flag == false){
    const newSocket = io('http://localhost:3000', {
      auth: { token: Cookies.get('token') },
      transports: ['websocket'] // Force WebSocket
    });
    
    newSocket?.emit('getRole');
    newSocket?.on('roles_update', (updatedOccupied) => {
      console.log('Reçu roles_update:', updatedOccupied); // Debug 4
      setOccupiedRoles(updatedOccupied);
    });
    setFlag(true)
  }
 

  useEffect(() => {
    if (!isAuthenticated) return;
  
    const newSocket = io('http://localhost:3000', {
      auth: { token: Cookies.get('token') },
      transports: ['websocket'] // Force WebSocket
    });
  
    console.log('Tentative de connexion socket...'); // Debug 1
  
    newSocket.on('connect', () => {
      console.log('Connecté au socket! ID:', newSocket.id); // Debug 2
    });
  
    newSocket.on('connect_error', (err) => {
      console.error('Erreur de connexion:', err); // Debug 3
    });
  
    setSocket(newSocket);
  
    newSocket.on('roles_update', (updatedOccupied) => {
      console.log('Reçu roles_update:', updatedOccupied); // Debug 4
      setOccupiedRoles(updatedOccupied);
    });

    newSocket.on('game_start', (data: TeamUpdate) => {

      if (data.blue.Captain === "Coustaud") {
        navigate('/captain');
      } else if (data.red.Captain === "Bobleponge_carre") {
        navigate('/captain');
      } else {
        navigate('/member');
      }
    });

    return () => {
      newSocket.off('roles_update'); // Nettoyage explicite
      newSocket.close();
    };
  }, [isAuthenticated]);

  const handleSelection = (team: TeamType, role: string) => {
    // Si le rôle est déjà sélectionné par l'utilisateur, on le désélectionne
    if (selected?.team === team && selected?.role === role) {
      setSelected(null);
      socket?.emit('role_selection', { team, role, action: 'deselect' });
      return;
    }
  
    // Si l'utilisateur a déjà un rôle sélectionné (dans n'importe quelle équipe), on le désélectionne d'abord
    if (selected) {
      socket?.emit('role_selection', { 
        team: selected.team, 
        role: selected.role, 
        action: 'deselect' 
      });
    }
  
    // Sélectionne le nouveau rôle
    const newSelection = { team, role };
    setSelected(newSelection);
    socket?.emit('role_selection', { team, role, action: 'select' });
  };
  
  const isRoleOccupied = (team: TeamType, role: string) => {
    // Vérifie seulement dans l'équipe concernée
    return occupiedRoles[team].includes(role) && 
           !(selected?.team === team && selected?.role === role);
  };

const renderTeamSection = (team: TeamType) => (
  <div className={`team-section ${team}-team`}>
    <h2 className={`nes-text is-${team === 'blue' ? 'primary' : 'error'}`}>
      Équipe {team === 'blue' ? 'Bleue' : 'Rouge'}
    </h2>
    <div className="roles-grid">
      {availableRoles.map(role => {
        const isSelected = selected?.team === team && selected.role === role;
        const isOccupied = isRoleOccupied(team, role);
        
        return (
          <button
            key={`${team}-${role}`}
            className={`nes-btn ${
              isSelected ? 'is-primary' : 
              isOccupied ? 'is-disabled' : ''
            }`}
            onClick={() => !isOccupied && handleSelection(team, role)}
            disabled={isOccupied}
          >
            {role}
          </button>
        );
      })}
    </div>
  </div>);
  return (
    <div className="lobby-container">
      <h1>Captain Sonar Lobby</h1>
      <div className="teams-container">
        {renderTeamSection('blue')}
        {renderTeamSection('red')}
      </div>
      <div className="nes-container" style={{ margin: '2rem auto', textAlign: 'center' }}>
                <Link 
                    to="/game1" 
                    className="nes-btn is-success" 
                    style={{ marginBottom: '1rem' }}
                >
                    Plonger !
                </Link>
      </div>
    </div>
  );
};

export default Lobby;