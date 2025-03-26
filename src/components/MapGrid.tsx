import React, { useState } from "react";
import "./MapGrid.css";

type Coord = {
  x: number;
  y: number;
};

type MapGridProps = {
  onSelectStart: (coord: Coord) => void;
  startPosition: Coord | null;
  isConfirmed: boolean;
  onReset: () => void;
};

const SIZE = 15;
const BLOCK_SIZE = 5;
const CELL_SIZE = 60;
const LETTERS = "ABCDEFGHIJKLMNO";

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

const MapGrid: React.FC<MapGridProps> = ({ onSelectStart, startPosition, isConfirmed, onReset }) => {
  const [path, setPath] = useState<Coord[]>(startPosition ? [startPosition] : []);
  const [position, setPosition] = useState<Coord | null>(startPosition);
  const [islands, setIslands] = useState<Coord[]>(generateIslands());

  const handleCellClick = (x: number, y: number) => {
    const isIsland = islands.some((p) => p.x === x && p.y === y);
    if (isIsland || isConfirmed) return;

    const newPos = { x, y };
    setPosition(newPos);
    setPath([newPos]);
    onSelectStart(newPos);
  };

  const resetMap = () => {
    setPath([]);
    setPosition(null);
    setIslands(generateIslands());
    onReset();
  };

  return (
    <div className="grid-wrapper">
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

        <div className="grid">
          {Array.from({ length: SIZE }, (_, row) => (
            <div key={row} className="row">
              {Array.from({ length: SIZE }, (_, col) => {
                const isStart = path.length > 0 && path[0].x === col && path[0].y === row;
                const isCurrent = position?.x === col && position?.y === row;
                const isPath = path.some((p) => p.x === col && p.y === row);
                const isIsland = islands.some((p) => p.x === col && p.y === row);

                return (
                  <div key={col} className="cell-wrapper">
                    <div
                        className={`cell ${isIsland ? "island" : ""} ${
                            isStart ? "start" : isCurrent ? "current" : isPath ? "path" : ""
                        }`}
                        onClick={() => handleCellClick(col, row)}
                        >
                        {isStart && <span className="submarine">🛥️</span>}
                        
                    </div>

                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

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
    </div>
  );
};

export default MapGrid;