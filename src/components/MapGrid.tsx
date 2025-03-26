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

// Génération aléatoire d'îles
const generateIslands = (): Coord[] => {
  const totalIslands = 9;
  const maxIslandSize = 4;
  const occupied = new Set<string>();
  const islands: Coord[] = [];

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  const isFree = (x: number, y: number): boolean =>
    x >= 0 && y >= 0 && x < SIZE && y < SIZE && !occupied.has(`${x},${y}`);

  for (let i = 0; i < totalIslands; i++) {
    let attempts = 0;
    let island: Coord[] = [];

    while (attempts < 50 && island.length === 0) {
      attempts++;
      const x = Math.floor(Math.random() * SIZE);
      const y = Math.floor(Math.random() * SIZE);
      if (!isFree(x, y)) continue;

      const size = 1 + Math.floor(Math.random() * maxIslandSize);
      island.push({ x, y });
      occupied.add(`${x},${y}`);
      let last = { x, y };

      while (island.length < size) {
        const [dx, dy] = directions[Math.floor(Math.random() * directions.length)];
        const nx = last.x + dx;
        const ny = last.y + dy;
        if (isFree(nx, ny)) {
          island.push({ x: nx, y: ny });
          occupied.add(`${nx},${ny}`);
          last = { x: nx, y: ny };
        } else {
          break;
        }
      }
    }

    islands.push(...island);
  }

  return islands;
};

const MapGrid: React.FC = () => {
  const [path, setPath] = useState<Coord[]>([]);
  const [position, setPosition] = useState<Coord | null>(null);
  const [islands, setIslands] = useState<Coord[]>(generateIslands());

  const resetMap = () => {
    setPath([]);
    setPosition(null);
    setIslands(generateIslands());
  };
  

  const handleCellClick = (x: number, y: number) => {
    const isIsland = islands.some(p => p.x === x && p.y === y);
    if (isIsland) return;

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
      {/* Lettres A-O en haut */}
      <div className="column-labels">
        <div className="empty-corner"></div>
        {Array.from({ length: SIZE }, (_, col) => (
          <div key={col} className="column-label">
            {LETTERS[col]}
          </div>
        ))}
      </div>

      <div className="grid-and-row-labels">
        {/* Chiffres 1-15 à gauche */}
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
                const isIsland = islands.some(p => p.x === col && p.y === row);

                return (
                  <div key={col} className="cell-wrapper">
                    <div
                      className={`cell ${isIsland ? "island" : ""} ${
                        isStart ? "start" : isCurrent ? "current" : isPath ? "path" : ""
                      }`}
                      onClick={() => handleCellClick(col, row)}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Chiffres géants de secteurs */}
      <div className="sector-overlay">
        {Array.from({ length: 9 }, (_, i) => {
          const row = Math.floor(i / 3);
          const col = i % 3;
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
    <div className="action-panel">
        <button onClick={resetMap}>🔁 Régénérer les îles</button>
    </div>

    </div>
  );
};

export default MapGrid;
