import React from 'react';
import './LivesDisplay.css';

const LivesDisplay: React.FC<{ lives: number }> = ({ lives }) => {
  return (
    <div className="lives-display">
      {Array.from({ length: 4 }).map((_, index) => (
        <span key={index} className={`heart ${index < lives ? 'active' : ''}`}>❤️</span>
      ))}
    </div>
  );
};

export default LivesDisplay;