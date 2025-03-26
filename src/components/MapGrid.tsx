import React, { useState } from "react";
import "./MapGrid.css";

type Coord = {
  x: number;
  y: number;
};

const SIZE = 15;
const BLOCK_SIZE = 5;
const CELL_SIZE = 60;
const LETTERS = "ABCDEFGHIJKLMNO";

const MapGrid: React.FC = () => {
  const [path, setPath] = useState<Coord[]>([]);
  const [position, setPosition] = useState<Coord | null>(null);

  const handleCellClick = (x: number, y: number) => {
    if (!position) {
      setPosition({ x, y });
      setPath([{ x, y }]);
      return;
    }

    const dx = Math.abs(x - position.x);
    const dy = Math.abs(y - position.y);
    const isAdjacent = (dx === 1 && dy === 0) || (dx === 0 && dy === 1);

    if (isAdjacent) {
      const newPos = { x, y };
      setPosition(newPos);
      setPath([...path, newPos]);
    }
  };

  return (
    <div className="grid-wrapper">
      {/* Lettres en haut des colonnes */}
      <div className="column-labels">
        <div className="empty-corner"></div> {/* Espace pour l'angle */}
        {Array.from({ length: SIZE }, (_, col) => (
          <div key={col} className="column-label">
            {LETTERS[col]}
          </div>
        ))}
      </div>

      <div className="grid-and-row-labels">
        {/* Chiffres à gauche des lignes */}
        <div className="row-labels">
          {Array.from({ length: SIZE }, (_, row) => (
            <div key={row} className="row-label">
              {row + 1}
            </div>
          ))}
        </div>

        {/* Grille principale */}
        <div className="grid">
          {Array.from({ length: SIZE }, (_, row) => (
            <div key={row} className="row">
              {Array.from({ length: SIZE }, (_, col) => {
                const isStart = path.length > 0 && path[0].x === col && path[0].y === row;
                const isCurrent = position?.x === col && position?.y === row;
                const isPath = path.some(p => p.x === col && p.y === row);

                return (
                  <div key={col} className="cell-wrapper">
                    <div
                      className={`cell ${isStart ? "start" : isCurrent ? "current" : isPath ? "path" : ""}`}
                      onClick={() => handleCellClick(col, row)}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

     {/* Overlay des numéros de secteur centrés */}
    <div className="sector-overlay">
        {Array.from({ length: 9 }, (_, i) => {
            const row = Math.floor(i / 3);
            const col = i % 3;
            // Calcul précis du centre en incluant les bordures
            const centerX = col * (BLOCK_SIZE * CELL_SIZE) + (BLOCK_SIZE * CELL_SIZE) / 2 + col * 3;
            const centerY = row * (BLOCK_SIZE * CELL_SIZE) + (BLOCK_SIZE * CELL_SIZE) / 2 + row * 3;

            return (
            <div
                key={i}
                className="sector-number"
                style={{
                left: `${centerX}px`,
                top: `${centerY}px`,
                }}
            >
                {i + 1}
            </div>
            );
        })}
        </div>
    </div>
  );
};

export default MapGrid;