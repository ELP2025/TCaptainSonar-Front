import React, { useEffect, useState } from 'react';
import './Lobby.css';
import "nes.css/css/nes.min.css";
import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';
import { useAuth } from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

// Types
type Team = {
  captain: string;
};

type TeamUpdate = {
  blue: Team;
  red: Team;
};

interface JwtPayload {
  id: string;
  username: string;
  [key: string]: any;
}

interface LobbyProps {
  availableRoles?: string[];
}

type TeamType = 'blue' | 'red';
type RoleSelection = { team: TeamType; role: string } | null;

const Lobby: React.FC<LobbyProps> = ({ 
  availableRoles = ["Capitaine"]
}) => {
  const { isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [selected, setSelected] = useState<RoleSelection>(null);
  const [teams, setTeams] = useState<TeamUpdate>({
    blue: { captain: '' },
    red: { captain: '' }
  });
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const navigate = useNavigate()


  // Récupération de l'ID utilisateur
  useEffect(() => {
    const fetchUserData = () => {
      const token = Cookies.get('token');
      if (!token) {
          console.log("Pas de token trouvé");
          return;
      }

      try {
          const decoded = jwtDecode<JwtPayload>(token);
          setCurrentUserId(decoded.id);
          return decoded;
      } catch (err) {
          console.error("Erreur de décodage:", err);
      }
    };

    fetchUserData();
  }, []);

  // Initial socket setup
  useEffect(() => {
    if (!isAuthenticated || !currentUserId) return;

    const newSocket = io('http://localhost:3000', {
      auth: { token: Cookies.get('token') },
      transports: ['websocket']
    });
    
    newSocket.emit('getRole');
    newSocket.on('teams_update', (updatedTeams: TeamUpdate) => {
      setTeams(updatedTeams);
      console.log("update teams", teams)
      console.log("update teams", updatedTeams.red.captain)
    });
    newSocket?.on("game_start", ()=> {
      // navigate('/bonne page');

    })
 
    setSocket(newSocket);

    return () => {
      newSocket.off('teams_update');
      newSocket.close();
    };
  }, [isAuthenticated, currentUserId]);

  const startGame = () => {
    if (!currentUserId) return;
    socket?.emit("game_start_signal", teams);
  };

  const handleSelection = (team: TeamType, role: string) => {
    if (!currentUserId) return;
    // Désélection

    if (selected?.team === team && selected?.role === role) {
      setSelected(null);
      socket?.emit('role_selection', { 
        team, 
        role, 
        action: 'deselect',
        playerId: currentUserId
      });
      return;
    }
    // Désélectionner d'abord le rôle actuel si existant
    if (selected) {
      socket?.emit('role_selection', { 
        team: selected.team, 
        role: selected.role, 
        action: 'deselect',
        playerId: currentUserId
      });
    }
  
    // Sélectionner le nouveau rôle
    const newSelection = { team, role };
    setSelected(newSelection);
    socket?.emit('role_selection', { 
      team, 
      role, 
      action: 'select',
      playerId: currentUserId
    });
  };
  
  const isRoleOccupied = (team: TeamType, role: string) => {
    if (role === "Capitaine") {
      return !!teams[team].captain && 
             !(selected?.team === team && selected?.role === role);
    }
    return false;
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
    </div>
  );

  const canStartGame = teams.blue.captain && teams.red.captain;

  return (
    <div className="lobby-container">
      <h1>Captain Sonar Lobby</h1>
      <div className="teams-container">
        {renderTeamSection('blue')}
        {renderTeamSection('red')}
      </div>
      <div>
        {canStartGame && <button className="nes-btn" onClick={startGame}>Lancer partie</button>}
      </div>
    </div> 
  );
}; 

export default Lobby;