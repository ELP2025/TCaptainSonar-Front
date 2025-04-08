import React, { useState } from "react";
import "./ImageMap.css";

type Coord = {
  x: number;
  y: number;
};

type ImageMapProps = {
  onSelectStart: (coord: Coord) => void;
  startPosition: Coord | null;
  isConfirmed: boolean;
  onReset: () => void;
  onMove: (direction: string) => void;
  path: Coord[];
  currentPosition: Coord | null;
};

const SIZE = 15;
const LETTERS = "ABCDEFGHIJKLMNO";

// Positions des îles basées sur l'image fournie (cases noires)
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

const ImageMap: React.FC<ImageMapProps> = ({ 
  onSelectStart, 
  startPosition, 
  isConfirmed, 
  onReset,
  onMove,
  path,
  currentPosition
}) => {
  const handleCellClick = (x: number, y: number) => {
    const isIsland = ISLANDS.some((p) => p.x === x && p.y === y);
    if (isIsland || isConfirmed) return;

    const newPos = { x, y };
    onSelectStart(newPos);
  };

  return (
    <div className="image-map-wrapper">
      {/* Labels des colonnes (A-O) */}
      <div className="column-labels">
        <div className="empty-corner"></div>
        {Array.from({ length: SIZE }, (_, col) => (
          <div key={col} className="column-label">
            {LETTERS[col]}
          </div>
        ))}
      </div>
      <div className="grid-and-row-labels">
        <div className="row-labels">
          {Array.from({ length: SIZE }, (_, row) => (
            <div key={row} className="row-label">
              {row + 1}
            </div>
          ))}
        </div>

        <div className="image-grid">
          <img src="/assets/map2" alt="Alpha Map" className="background-map" />
          <div className="overlay-grid">
            {Array.from({ length: SIZE }, (_, row) => (
              <div key={row} className="row">
                {Array.from({ length: SIZE }, (_, col) => {
                  const isStart = path.length > 0 && path[0].x === col && path[0].y === row;
                  const isCurrent = currentPosition?.x === col && currentPosition?.y === row;
                  const isPath = path.some((p) => p.x === col && p.y === row);
                  const isIsland = ISLANDS.some((p) => p.x === col && p.y === row);

                  return (
                    <div key={col} className="cell-wrapper">
                      <div
                        className={`cell ${isIsland ? "island" : ""} ${
                          isStart ? "start" : isCurrent ? "current" : isPath ? "path" : ""
                        }`}
                        onClick={() => handleCellClick(col, row)}
                      >
                        {isCurrent && <span className="submarine">🛥️</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageMap;