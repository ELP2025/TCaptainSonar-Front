import { useState, useEffect } from "react";
import "nes.css/css/nes.min.css";
import "./System.css";

interface SystemProps {
  max_marks: number;
  buttonText?: string;
  onComplete: () => void;
  resetMarks?: boolean;
  allowedAction: 0 | 1 | 2;
  onActionConsumed: () => void; // Nouvelle prop pour notifier le parent
}

export default function System({ 
  max_marks,
  buttonText = "Système",
  onComplete,
  resetMarks = false,
  allowedAction,
  onActionConsumed // Nouvelle prop
}: SystemProps) {
  const [marks, setMarks] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (resetMarks) {
      setMarks(0);
      setIsLocked(false);
      const timer = setTimeout(() => {
        setIsLocked(false);
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [resetMarks]);

  const handleIncrement = () => {
    if (!isLocked && allowedAction === 1) {
      // Notifie immédiatement le parent que l'action est consommée
      onActionConsumed();
      
      setMarks(prev => {
        const newMarks = Math.min(prev + 1, max_marks);
        
        if (newMarks === max_marks) {
          onComplete();
          setIsLocked(true);
        }
        
        return newMarks;
      });
    }
  };

  const renderCheckbox = (index: number) => (
    <label key={index}>
      <input 
        type="checkbox"
        className="nes-checkbox"
        checked={index < marks}
        readOnly
      />
      <span></span>
    </label>
  );


  const getButtonState = () => {
    if (isLocked) return "is-disabled";
    if (allowedAction !== 1) return "is-disabled";
    return "is-success";
  };

  return (
    <div className="nes-container with-title is-centered component-container">
      <div className="checkboxes-vertical-layout">
        <button 
          onClick={handleIncrement}
          className={`nes-btn ${getButtonState()}`}
          disabled={isLocked || allowedAction !== 1}
          aria-label={buttonText}
        >
          {buttonText}
        </button>
  
        <div className="checkboxes-container">
          {Array.from({ length: max_marks }, (_, i) => renderCheckbox(i))}
        </div>
      </div>
    </div>
  );
}