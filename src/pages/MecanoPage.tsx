import React, { useState, useEffect } from 'react';
import LivesDisplay from '../components/LivesDisplay';
import ChatHistory from '../components/ChatHistory';
import './MecanoPage.css';
import './MecanoPage.css';


// Positions groupées par zone (version originale complète)
const zonePositions = {
  ouest: [ 
    [64, 15.2], [64, 26.4], [72.8, 26.5],
    [81.6, 15.1], [81.6, 20.8], [81.6, 26.3]
  ],
  nord: [
    [64, 35.1], [72.8, 35.1], [72.8, 45.9],
    [81.6, 35.2], [81.6, 40.8], [81.6, 46.2]
  ],
  sud: [
    [64, 55.1], [72.8, 55.1], [72.8, 66],
    [81.6, 54.7], [81.6, 60.6], [81.6, 66.3]
  ],
  est: [
    [64, 74.9], [72.8, 74.8], [72.8, 85.9],
    [81.6, 74.8], [81.6, 80.4], [81.6, 86.2]
  ]
};

// Définition des circuits
const circuits = {
  jaune: [
    [64, 15.2], [64, 26.4], [72.8, 26.5], [72.8, 85.9]
  ],
  orange: [
    [64, 35.1], [72.8, 35.1], [72.8, 45.9], [64, 74.9]
  ],
  gris: [
    [64, 55.1], [72.8, 55.1], [72.8, 66], [72.8, 74.8]
  ]
};

// Toutes positions uniques (toutes zones + circuits)
const allPositions = Array.from(
  new Set([
    ...Object.values(zonePositions).flat(),
    ...Object.values(circuits).flat()
  ].map(pos => `${pos[0]},${pos[1]}`))
).map(str => {
  const [top, left] = str.split(',').map(Number);
  return [top, left] as [number, number];
});

const MecanoPage = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [crosses, setCrosses] = useState<Record<string, boolean>>(
    Object.fromEntries(allPositions.map(pos => [`${pos[0]},${pos[1]}`, false]))
  );

  // Vérifie si un circuit est complet
  const isCircuitComplete = (circuitPositions: number[][]) => {
    return circuitPositions.every(pos => 
      crosses[`${pos[0]},${pos[1]}`] === true
    );
  };

  // Gère le clic sur un bouton
  const toggleCross = (position: [number, number]) => {
    const posKey = `${position[0]},${position[1]}`;
    
    // Inverser l'état de la case
    const newCrosses = {
      ...crosses,
      [posKey]: !crosses[posKey]
    };
    
    setCrosses(newCrosses);
  };

  // Vérifie les circuits complets après chaque changement
  useEffect(() => {
    const completedCircuits = Object.entries(circuits)
      .filter(([_, positions]) => 
        positions.every(pos => crosses[`${pos[0]},${pos[1]}`] === true)
      );
    
    if (completedCircuits.length > 0) {
      // Créer une copie des crosses
      const newCrosses = {...crosses};
      
      // Décocher toutes les cases des circuits complets
      completedCircuits.forEach(([_, positions]) => {
        positions.forEach(pos => {
          newCrosses[`${pos[0]},${pos[1]}`] = false;
        });
      });
      
      setCrosses(newCrosses);
    }
  }, [crosses]);

  return (

    <div className="mecano-wrapper">
      <LivesDisplay lives={4} />

      <h1>⚙️ Cocher une panne ⚙️</h1>

      
      <div className="zone-selector">
        <button 
          className={`zone-button ${selectedZone === 'ouest' ? 'active' : ''}`}
          onClick={() => setSelectedZone('ouest')}
        >
          Ouest
        </button>
        <button 
          className={`zone-button ${selectedZone === 'nord' ? 'active' : ''}`}
          onClick={() => setSelectedZone('nord')}
        >
          Nord
        </button>
        <button 
          className={`zone-button ${selectedZone === 'sud' ? 'active' : ''}`}
          onClick={() => setSelectedZone('sud')}
        >
          Sud
        </button>
        <button 
          className={`zone-button ${selectedZone === 'est' ? 'active' : ''}`}
          onClick={() => setSelectedZone('est')}
        >
          Est
        </button>
        <button 
          className="zone-button"
          onClick={() => setSelectedZone(null)}
        >
          Toutes zones
        </button>
      </div>

      <div className="circuit-status-panel">
        {Object.entries(circuits).map(([name, positions]) => {
          const count = positions.filter(pos => crosses[`${pos[0]},${pos[1]}`]).length;
          return (
            <div key={name} className={`circuit-line ${name}`}>
              <span className="circuit-dot"></span>
              Circuit {name} : {count}/4
            </div>
          );
        })}
      </div>

      <div className="chat-history">
      <ChatHistory 
        messages={chatMessages} 
        title="Historique" 
        maxMessages={7} 
      />
      </div>

      <img src="/assets/mecano.jpg" alt="Mécano" className="mecano-background" />
      
      {allPositions.map(([top, left], index) => {
        const posKey = `${top},${left}`;
        const isInSelectedZone = !selectedZone || 
          zonePositions[selectedZone as keyof typeof zonePositions]?.some(
            pos => pos[0] === top && pos[1] === left
          );

        return (
          <button
            key={posKey}
            className={`mecano-button ${crosses[posKey] ? 'crossed' : ''}`}
            onClick={() => isInSelectedZone && toggleCross([top, left])}
            style={{ 
              top: `${top}%`, 
              left: `${left}%`,
              cursor: isInSelectedZone ? 'pointer' : 'not-allowed',
            }}
          >
            {crosses[posKey] && <span className="cross">✖</span>}
          </button>
        );
      })}
    </div>
  );
};

export default MecanoPage;

