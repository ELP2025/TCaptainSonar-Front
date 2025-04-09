import React, { useState } from 'react';
import './MecanoPage.css';

// Positions groupées par zone
const zonePositions = {
  ouest: [ 
    [64, 15.2], [64, 26.4], [72.8, 26.5],
    [80.6 + 1, 15.1], [80.6 + 1, 20.8], [80.6 + 1, 26.3]
  ],
  nord: [
    [62.6 + 1.4, 35.1], [71.4 + 1.4, 35.1], [71.4 + 1.4, 45.9],
    [81.6, 35.2], [81.6, 40.8], [81.6, 46.2]
  ],
  sud: [
    [62.6 + 1.4, 55.1], [71.4 + 1.4, 55.1], [71.4 + 1.4, 66],
    [81.6, 54.7], [81.6, 60.6], [81.6, 66.3]
  ],
  est: [
    [62.6 + 1.4, 74.9], [71.4 + 1.4, 74.8], [71.4 + 1.4, 85.9],
    [81.6, 74.8], [81.6, 80.4], [81.6, 86.2]
  ]
};

// Convertir en tableau plat pour le rendu
const allPositions = Object.values(zonePositions).flat();

const MecanoPage = () => {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [crosses, setCrosses] = useState(Array(allPositions.length).fill(false));

  const toggleCross = (index: number) => {
    // Vérifier si la position appartient à la zone sélectionnée
    const position = allPositions[index];
    const isInSelectedZone = selectedZone && 
      zonePositions[selectedZone as keyof typeof zonePositions].some(
        pos => pos[0] === position[0] && pos[1] === position[1]
      );

    if (isInSelectedZone || !selectedZone) {
      const updated = [...crosses];
      updated[index] = !updated[index];
      setCrosses(updated);
    }
  };

  return (
    <div className="mecano-wrapper">
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

      <img src="/assets/mecano.jpg" alt="Mécano" className="mecano-background" />
      
      {allPositions.map(([top, left], index) => {
        const isInSelectedZone = !selectedZone || 
          zonePositions[selectedZone as keyof typeof zonePositions]
            .some(pos => pos[0] === top && pos[1] === left);

        return (
          <button
            key={index}
            className={`mecano-button ${crosses[index] ? 'crossed' : ''}`}
            onClick={() => isInSelectedZone && toggleCross(index)}
            style={{ 
              top: `${top}%`, 
              left: `${left}%`,
              cursor: isInSelectedZone ? 'pointer' : 'not-allowed',
            }}
          >
            {crosses[index] && <span className="cross">✖</span>}
          </button>
        );
      })}
    </div>
  );
};

export default MecanoPage;