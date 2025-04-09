// components/PerformanceCard.tsx
import React from 'react';

interface Game {
  _id: string;
  status: string;
  startDate: string;
  endDate: string;
}

interface Performance {
  _id: string;
  game: Game;
  role: string;
  score: number;
}

interface PerformanceCardProps {
  performance: Performance;
}

const PerformanceCard: React.FC<PerformanceCardProps> = ({ performance }) => {
  return (
    <div className="nes-container with-title is-rounded m-3">
      <h3 className="title">Partie #{performance.game._id.slice(-4)}</h3>
      <div className="row align-items-center">
    <div className="lists">
      <ul className="nes-list is-disc text-start">
        <li>Rôle : {performance.role}</li>
        <li>Score : {performance.score}</li>
        <li>Statut : {performance.game.status}</li>
      </ul>
    </div>
</div>
<span className="nes-text is-primary text-end d-block w-100">{new Date(performance.game.startDate).toLocaleDateString()}</span>    
</div>
  );
};

export default PerformanceCard;