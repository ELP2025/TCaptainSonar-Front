import { useLocation } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import ImageMap from "../components/ImageMap";
import "./CaptainPage.css";
import io from 'socket.io-client';

const socket = io('http://localhost:3000');



type Coord = {
  x: number;
  y: number;
};

type ChatMessage = {
  text: string;
  isSystem?: boolean;
};

const CaptainPage: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const team = params.get('team') as 'blue' | 'red';
  const roomId = params.get('roomId') || 'defaultRoom';
  const [startPosition, setStartPosition] = useState<Coord | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [path, setPath] = useState<Coord[]>([]);
  const [currentPosition, setCurrentPosition] = useState<Coord | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isBlocked, setIsBlocked] = useState(false);
  const MAX_MESSAGES = 5;

  const addChatMessage = (text: string, isSystem: boolean = false) => {
    setChatMessages(prev => {
      const newMessages = [...prev, { text, isSystem }];
      return newMessages.slice(-MAX_MESSAGES);
    });
  };

  useEffect(() => {
    socket.emit('joinRoom', roomId); // Rejoindre la room spécifique
    socket.emit('getMapState');      // Demander l’état initial de la carte

    socket.on('map_update', (mapState) => {
      const teamState = mapState[team]; // État spécifique à l’équipe
      setPath(teamState.path || []);
      setCurrentPosition(teamState.currentPosition || null);
      setIsBlocked(teamState.isBlocked || false);
    });

return () => {
      socket.off('map_update');
    };
  }, [team, roomId]);



  const checkIfCompletelyBlocked = (position: Coord): boolean => {
    const directions = [
      { x: 0, y: -1 },  // NORD
      { x: 1, y: 0 },   // EST
      { x: 0, y: 1 },   // SUD
      { x: -1, y: 0 }   // OUEST
    ];

    return directions.every(dir => {
      const newX = position.x + dir.x;
      const newY = position.y + dir.y;
      
      if (newX < 0 || newX >= 15 || newY < 0 || newY >= 15) return true;
      
      return ISLANDS.some(p => p.x === newX && p.y === newY) || 
             path.some(p => p.x === newX && p.y === newY);
    });
  };

  const handleSelectStart = (coord: Coord) => {
    if (!isConfirmed) {
      setStartPosition(coord);
      setPath([coord]);
      setCurrentPosition(coord);
    }
  };

  const handleConfirm = () => {
    if (startPosition) {
      setIsConfirmed(true);
      addChatMessage("Position confirmée. Prêt à naviguer !", true);
      socket.emit('setInitialPosition', { team, position: startPosition });
    }
  };

  const handleReset = () => {
    setStartPosition(null);
    setIsConfirmed(false);
    setPath([]);
    setCurrentPosition(null);
    setChatMessages([]);
    setIsBlocked(false);
    socket.emit('reset', { team });
  };

  const directionToFrench = (dir: string) => {
    switch(dir) {
      case "north": return "NORD";
      case "south": return "SUD";
      case "east": return "EST";
      case "west": return "OUEST";
      default: return dir;
    }
  };

  const handleBlackout = () => {
    setPath(path.length > 0 ? [path[path.length - 1]] : []);
    setIsBlocked(false);
    addChatMessage("BLACKOUT effectué", true);
    socket.emit('blackout', { team });
  };

  const handleMove = (direction: string) => {
    if (!currentPosition) return;
    socket.emit('move', { direction, team });
    const newPosition = { ...currentPosition };
    let moved = false;
    
    switch (direction) {
      case "north":
        if (newPosition.y > 0) {
          newPosition.y -= 1;
          moved = true;
        }
        break;
      case "east":
        if (newPosition.x < 14) {
          newPosition.x += 1;
          moved = true;
        }
        break;
      case "south":
        if (newPosition.y < 14) {
          newPosition.y += 1;
          moved = true;
        }
        break;
      case "west":
        if (newPosition.x > 0) {
          newPosition.x -= 1;
          moved = true;
        }
        break;
    }

    const isIsland = ISLANDS.some(p => p.x === newPosition.x && p.y === newPosition.y);
    const isAlreadyVisited = path.some(p => p.x === newPosition.x && p.y === newPosition.y);
    
    if (moved && !isIsland && !isAlreadyVisited) {
      setCurrentPosition(newPosition);
      const newPath = [...path, newPosition];
      setPath(newPath);
      addChatMessage(`Déplacement vers ${directionToFrench(direction)}`);
      
      if (checkIfCompletelyBlocked(newPosition)) {
        setIsBlocked(true);
      }
    } else {
      
      // Vérifie si complètement bloqué après ce mouvement impossible
      if (checkIfCompletelyBlocked(currentPosition)) {
        setIsBlocked(true);
      }
    }
  };

  return (
    <div className="captain-page">
      <div className="title">
        <h1>
          {isConfirmed && currentPosition
            ? `📍 Sous-marin en ${String.fromCharCode(65 + currentPosition.x)}${currentPosition.y + 1}📍`
            : "🧭 Choisir position initiale 🧭"}
        </h1>
      </div>
      
      <div className="main-content">
        <div className="chat-container">
          <div className="chat-header">Historique</div>
          <div className="chat-messages">
            {chatMessages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.isSystem ? "system" : ""}`}>
                {msg.text}
              </div>
            ))}
          </div>
        </div>
        
        <div className="map-and-controls">
          <div className="control-panel">
            <ImageMap
              onSelectStart={handleSelectStart}
              startPosition={startPosition}
              isConfirmed={isConfirmed}
              onReset={handleReset}
              onMove={handleMove}
              path={path}
              currentPosition={currentPosition}
            />
            
            <div className="movement-controls">
              {isConfirmed ? (
                <>
                  <div className="movement-buttons">
                    <button onClick={() => handleMove("north")}>NORD</button>
                    <div className="horizontal-buttons">
                      <button onClick={() => handleMove("west")}>OUEST</button>
                      <button onClick={() => handleMove("east")}>EST</button>
                    </div>
                    <button onClick={() => handleMove("south")}>SUD</button>
                  </div>
                  <button 
                    onClick={handleBlackout}
                    className={`blackout-btn ${isBlocked ? "blocked" : ""}`}
                  >
                    {isBlocked ? "BLACKOUT (OBLIGATOIRE)" : "BLACKOUT"}
                  </button>
                  <button onClick={handleReset}>Réinitialiser</button>
                </>
              ) : (
                <button
                  onClick={handleConfirm}
                  disabled={!startPosition}
                  className={!startPosition ? "disabled-btn" : ""}
                >
                  Confirmer la position
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ISLANDS: Coord[] = [
  // Secteur 1 (A1-E5)
  { x: 2, y: 1 }, // C2
  { x: 2, y: 2 }, // C3
  // Secteur 2 (F1-J5)
  { x: 6, y: 1 }, // G2
  { x: 8, y: 2 }, // I3
  { x: 8, y: 3 }, // I4
  // Secteur 3 (K1-O5)
  { x: 13, y: 1 }, // N2
  { x: 12, y: 1 }, // M2
  { x: 12, y: 2 }, // M3
  // Secteur 4 (A6-E10)
  { x: 1, y: 6 }, // B7
  { x: 1, y: 7 }, // B8
  { x: 3, y: 6 }, // D7
  { x: 3, y: 7 }, // D8
  { x: 3, y: 8 }, // D9
  // Secteur 5 (F6-J10)
  { x: 6, y: 6 }, // G7
  { x: 6, y: 7 }, // G8
  { x: 7, y: 8 }, // H9
  { x: 8, y: 6 }, // I7
  // Secteur 6 (K6-O10)
  { x: 11, y: 8 }, // L9  
  { x: 12, y: 8 }, // M9
  { x: 13, y: 8 }, // N9
  // Secteur 7 (A11-E15)
  { x: 3, y: 10 }, // D11
  { x: 2, y: 11 }, // C12
  { x: 0, y: 12 }, // A13
  { x: 2, y: 13 }, // C14
  { x: 3, y: 14 }, // D15
  // Secteur 8 (F11-J15)
  { x: 7, y: 11 }, // H12
  { x: 6, y: 13 }, // G14
  { x: 8, y: 13 }, // I14
  // Secteur 9 (K11-O15)
  { x: 11, y: 11 }, // L12
  { x: 12, y: 12 }, // M13
  { x: 13, y: 13 }, // N14
];

export default CaptainPage;