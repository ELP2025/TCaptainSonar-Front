import React, { useState } from "react";
import DetectorMap from "../components/DetectorMap";
import "./DetectorPage.css";

type Coord = {
  x: number;
  y: number;
};

const DetectorPage: React.FC = () => {
  const [crosses, setCrosses] = useState<Coord[]>([]);

  const toggleCross = (coord: Coord, isRightClick: boolean = false) => {
    const exists = crosses.some(p => p.x === coord.x && p.y === coord.y);
    
    if (isRightClick) {
      if (exists) {
        setCrosses(prev => prev.filter(p => !(p.x === coord.x && p.y === coord.y)));
      }
    } else {
      if (!exists) {
        setCrosses(prev => [...prev, coord]);
      }
    }
  };

  return (
    <div className="detector-page">
      <h1>🎯 Localiser le sous-marin ennemi 🎯</h1>
      <p>🖱️ Clic gauche pour marquer une croix — 🖱️ Clic droit pour effacer</p>
      <DetectorMap crosses={crosses} onCellClick={toggleCross} />
    </div>
  );
};

export default DetectorPage;
