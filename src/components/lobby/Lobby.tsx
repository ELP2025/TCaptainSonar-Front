import React, { useEffect, useRef, useState } from 'react';
import './Lobby.css';
import "nes.css/css/nes.min.css";
import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';
import { useAuth } from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { Link, useNavigate } from 'react-router-dom';

// Types
type Team = {
  captain: string,
  mecano:string;
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

const savePlayerPerformance = async (performanceData: {
  player: string;
  game: string;
  score: number;
  role: string;
}) => {
  try {
    const response = await fetch('http://localhost:3000/api/performances/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(performanceData)
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log('Performance enregistrée:', data);
    return data;
  } catch (error) {
    console.error('Erreur lors de lenregistrement:', error);
    throw error;
  }
};

const Lobby: React.FC<LobbyProps> = ({ 
  availableRoles = ["Capitaine", "Mecano"]
}) => {
  const { isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [selected, setSelected] = useState<RoleSelection>(null);
  const [teams, setTeams] = useState<TeamUpdate>({
    blue: { captain: '',mecano:'' },
    red: { captain: '',mecano:'' }
  });
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const selectedRef = useRef<RoleSelection>(null);
  const navigate = useNavigate()
  useEffect(() => {
    selectedRef.current = selected; // ✅ Synchronisation
  }, [selected]);

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
          console.log("decode "+decoded.username)
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
    });
    newSocket.on("game_start", async (data) => {
      try {
        if (!currentUserId || !selectedRef.current?.role) {
          console.error('Données manquantes');
          return;
        }
    
        const role = selectedRef.current.role.toString();
        await savePlayerPerformance({
          player: currentUserId,
          game: data.gameId,
          role, // Utilisation directe
          score: 0
        });
        navigate(`/${role.toLowerCase()}`);
    
      } catch (error) {
        console.error('Erreur:', error);
      }
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
    if (role === "Mecano") {
      return !!teams[team].mecano && 
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

  const canStartGame = teams.blue.captain && teams.red.captain && teams.blue.mecano && teams.red.mecano;

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
      <div>
        {selected?.role}
      </div>
    </div> 
  );
}; 

export default Lobby;
