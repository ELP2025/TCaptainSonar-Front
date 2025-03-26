import React, { useState } from "react";
import MapGrid from "../components/MapGrid"; // Adjust path based on your structure
import "./CaptainPage.css";

type Coord = {
  x: number;
  y: number;
};

const CaptainPage: React.FC = () => {
  const [startPosition, setStartPosition] = useState<Coord | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleSelectStart = (coord: Coord) => {
    if (!isConfirmed) {
      setStartPosition(coord);
    }
  };

  const handleConfirm = () => {
    if (startPosition) {
      setIsConfirmed(true);
    }
  };

  const handleReset = () => {
    setStartPosition(null);
    setIsConfirmed(false);
  };

  return (
    <div className="captain-page">
        <div className="title">
            <h1>🧭 Interface Capitaine</h1>
            <p>
                {isConfirmed && startPosition
                ? `Sous-marin positionné en ${String.fromCharCode(65 + startPosition.x)}${startPosition.y + 1}`
                : "Choisissez la position initiale du sous-marin"}
            </p>
        </div>

        <MapGrid
            onSelectStart={handleSelectStart}
            startPosition={startPosition}
            isConfirmed={isConfirmed}
            onReset={handleReset}
        />

        <div className="control-panel">
            {!isConfirmed && startPosition && (
            <button onClick={handleConfirm}>Confirmer la position</button>
            )}
            {isConfirmed && (
            <button onClick={handleReset}>Réinitialiser</button>
            )}
        </div>
    </div>
  );
};

export default CaptainPage;