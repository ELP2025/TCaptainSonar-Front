import React, { useState } from "react";
import ImageMap from "../components/ImageMap";
import "./CaptainPage.css";

type Coord = {
  x: number;
  y: number;
};

type ChatMessage = {
  text: string;
  isSystem?: boolean;
};

const CaptainPage: React.FC = () => {
  const [startPosition, setStartPosition] = useState<Coord | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [path, setPath] = useState<Coord[]>([]);
  const [currentPosition, setCurrentPosition] = useState<Coord | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const MAX_MESSAGES = 5;

  const addChatMessage = (text: string, isSystem: boolean = false) => {
    setChatMessages(prev => {
      const newMessages = [...prev, { text, isSystem }];
      return newMessages.slice(-MAX_MESSAGES);
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
    }
  };

  const handleReset = () => {
    setStartPosition(null);
    setIsConfirmed(false);
    setPath([]);
    setCurrentPosition(null);
    setChatMessages([]);
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

  const handleMove = (direction: string) => {
    if (!currentPosition) return;

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
      setPath([...path, newPosition]);
      addChatMessage(`Déplacement vers ${directionToFrench(direction)}`);
    }
  };

  return (
    <div className="captain-page">
      <div className="title">
        <h1>
          {isConfirmed && currentPosition
            ? `📍 Sous-marin positionné en ${String.fromCharCode(65 + currentPosition.x)}${currentPosition.y + 1}📍`
            : "🧭 Choisir la position initiale du sous-marin 🧭"}
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
                  <button onClick={handleReset}>Réinitialiser</button>
                </>
              ) : (
                <button
                  onClick={handleConfirm}
                  disabled={!startPosition}
                  style={{
                    opacity: startPosition ? 1 : 0.5,
                    cursor: startPosition ? "pointer" : "not-allowed"
                  }}
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