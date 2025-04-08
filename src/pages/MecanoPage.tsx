import React, { useState } from 'react';
import './MecanoPage.css';

const positions = [
  // Format : [top, left] en %
  [62.6, 15.2], [62.6, 26.4], [62.6, 35.1], [62.6, 55.1], [62.6, 74.9], // Ligne du haut
  [71.4, 26.5], [71.4, 35.1], [71.4, 45.9], [71.4, 55.1 ], [71.4, 66], [71.4, 74.8], [71.4, 85.9], // Ligne centrale
  [80.6, 15.1], [80.6, 20.8], [80.6, 26.3], [80.6, 35.2], [80.6, 40.8], [80.6, 46.2], [80.6, 54.7], [80.6, 60.6], [80.6, 66.3], [80.6, 74.8], [80.6, 80.4], [80.6, 86.2],// Ligne du bas
];

const MecanoPage = () => {
  const [crosses, setCrosses] = useState(Array(positions.length).fill(false));

  const toggleCross = (index: number) => {
    const updated = [...crosses];
    updated[index] = !updated[index];
    setCrosses(updated);
  };

  return (
    <div className="mecano-wrapper">
      <h1>⚙️ Cocher une panne ⚙️</h1>
      <img src="/assets/mecano.jpg" alt="Mécano" className="mecano-background" />
      {positions.map(([top, left], index) => (
        <button
          key={index}
          className={`mecano-button ${crosses[index] ? 'crossed' : ''}`}
          onClick={() => toggleCross(index)}
          style={{ top: `${top}%`, left: `${left}%` }}
        >
          {crosses[index] && <span className="cross">✖</span>}
        </button>
      ))}
    </div>
  );
};

export default MecanoPage;
