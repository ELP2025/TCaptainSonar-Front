import React, { useState } from "react";
import ImageMap from "../components/ImageMap";
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
            <h1>{isConfirmed && startPosition
                ? `📍 Sous-marin positionné en ${String.fromCharCode(65 + startPosition.x)}${startPosition.y + 1}📍`
                : "🧭Choisissez la position initiale du sous-marin🧭"}</h1>
        </div>
        
        <div className="control-panel">
            <ImageMap
                onSelectStart={handleSelectStart}
                startPosition={startPosition}
                isConfirmed={isConfirmed}
                onReset={handleReset}
            />
            {isConfirmed ? (
              <button onClick={handleReset}>Réinitialiser</button>
            ) : (
              <button
                onClick={handleConfirm}
                disabled={!startPosition} // ✅ empêche clic si rien sélectionné
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
  );
};

export default CaptainPage;