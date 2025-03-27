/*import React, { useState } from 'react';
import './SecondPage.css';
import OurComponent from './OurComponent';

function SecondPage() {
  const [warningMarks, setWarningMarks] = useState(0);

  const addWarningMark = () => setWarningMarks(prev => prev < 4 ? prev + 1 : prev);
  const resetAll = () => setWarningMarks(0);

  return (
    <div className="secondPage">
      <div className="content">
        <h1>PREMIER MAÎTRE</h1>
        
        <div className="components-grid">
          <OurComponent max_marks={2} buttonText='Mine'/>
          <OurComponent max_marks={3} buttonText='Torpille'/>
          <OurComponent max_marks={3} buttonText='Drone'/>
          <OurComponent max_marks={2} buttonText='Sonar'/>
          <OurComponent max_marks={5} buttonText='Furtif'/>
          <OurComponent max_marks={5} buttonText='Scénario'/>
        </div>

        <div className="warning-section">
          <div className="warning-container">
            <span className="warning-text">WARNING!</span>
            <div className="warning-checkboxes">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className={`checkbox ${i < warningMarks ? 'checked' : ''}`}>
                  {i < warningMarks && <span className="checkmark">✓</span>}
                </div>
              ))}
            </div>
          </div>
          <button onClick={addWarningMark} className="warning-button">
            Ajouter warning
          </button>
        </div>

        <button onClick={resetAll} className="reset-button">
          Réinitialiser tout
        </button>
      </div>
    </div>
  );
}

export default SecondPage;*/

import React, { useState } from 'react';
import 'nes.css/css/nes.min.css';
import './SecondPage.css';

function SecondPage() {
  const [warningMarks, setWarningMarks] = useState(0);

  const addWarningMark = () => setWarningMarks(prev => prev < 4 ? prev + 1 : prev);
  const resetAll = () => setWarningMarks(0);

  return (
    <div className="secondPage nes-container is-dark">
      <div className="content">
        <h1 className="nes-text is-primary">SECOND</h1>
        
        <div className="components-grid">
          <ActionComponent max_marks={2} buttonText='Mine'/>
          <ActionComponent max_marks={3} buttonText='Torpille'/>
          <ActionComponent max_marks={3} buttonText='Drone'/>
          <ActionComponent max_marks={2} buttonText='Sonar'/>
          <ActionComponent max_marks={5} buttonText='Furtif'/>
          <ActionComponent max_marks={5} buttonText='Scénario'/>
        </div>

        <div className="warning-section nes-container is-rounded">
          <span className="nes-text is-error">WARNING!</span>
          <div className="warning-checkboxes">
            {[1, 2, 3, 4].map(i => (
              <label key={i}>
                <input 
                  type="checkbox" 
                  className="nes-checkbox is-dark" 
                  checked={i <= warningMarks}
                  readOnly
                />
                <span></span>
              </label>
            ))}
          </div>
          <button 
            onClick={addWarningMark} 
            className="nes-btn is-error"
          >
            Ajouter warning
          </button>
        </div>

        <button 
          onClick={resetAll} 
          className="nes-btn is-warning"
        >
          Réinitialiser tout
        </button>
      </div>
    </div>
  );
}

// Composant ActionComponent séparé
function ActionComponent({ max_marks, buttonText }: { max_marks: number, buttonText: string }) {
  const [marks, setMarks] = useState(0);

  return (
    <div className="component-row">
      <button 
        onClick={() => setMarks(prev => prev < max_marks ? prev + 1 : prev)} 
        className="nes-btn is-success"
      >
        {buttonText}
      </button>
      <div className="checkboxes">
        {[...Array(max_marks)].map((_, i) => (
          <label key={i}>
            <input 
              type="checkbox" 
              className="nes-checkbox is-dark" 
              checked={i < marks}
              readOnly
            />
            <span></span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default SecondPage;