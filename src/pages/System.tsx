import { useState, useEffect } from "react";
import "nes.css/css/nes.min.css";

interface SystemProps {
  max_marks: number;
  buttonText?: string;
  onComplete: () => void;
  resetMarks?: boolean;
}

export default function System({ 
  max_marks, 
  buttonText = "Magic button",
  onComplete,
  resetMarks = false
}: SystemProps) {
  const [marks, setMarks] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (resetMarks) {
      setMarks(0);
      setIsLocked(false);
    }
  }, [resetMarks]);

  useEffect(() => {
    if (marks === max_marks) {
      onComplete();
      setIsLocked(true);
    }
  }, [marks, max_marks, onComplete]);

  const handleIncrement = () => {
    if (!isLocked) {
      setMarks(prev => Math.min(prev + 1, max_marks));
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

  const topRowBoxes = Math.min(3, max_marks);
  const bottomRowBoxes = Math.max(0, max_marks - 3);

  return (
    <div className="nes-container with-title is-centered component-container">
      <div className="checkboxes-layout">
        <button 
          onClick={handleIncrement} 
          className={`nes-btn ${isLocked ? 'is-disabled' : 'is-success'}`}
          disabled={isLocked}
          aria-label={buttonText}
        >
          {buttonText}
        </button>
        
        <div className="checkboxes-group">
          <div className="checkboxes-row">
            {Array.from({ length: topRowBoxes }, (_, i) => renderCheckbox(i))}
          </div>
          
          {bottomRowBoxes > 0 && (
            <div className="checkboxes-row">
              {Array.from({ length: bottomRowBoxes }, (_, i) => renderCheckbox(i + topRowBoxes))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}