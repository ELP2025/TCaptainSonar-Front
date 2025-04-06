import { useState, useEffect } from 'react';
import 'nes.css/css/nes.min.css';
import './SecondPage.css';
import System from './System';

interface Item {
  name: string;
  used: boolean;
}

function SecondPage() {
  const [warnings, setWarnings] = useState(0);
  const [items, setItems] = useState<Item[]>([]);
  const [resetFlags, setResetFlags] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (Object.values(resetFlags).some(value => value)) {
      setTimeout(() => {
        setResetFlags({});
      }, 0); // Délais minimal pour s'assurer que React a fait son rendu
    }
  }, [resetFlags]);

  const addWarning = () => setWarnings(prev => Math.min(prev + 1, 4));

  const resetAll = () => {
    setWarnings(0);
    setItems([]);
  };

  const completeItem = (name: string) => {
    if (!items.some(item => item.name === name)) {
      setItems([...items, { name, used: false }]);
    }
  };


const useItem = (name: string) => {
  setItems(prevItems => prevItems.filter(item => item.name !== name));
  setResetFlags(prev => ({ ...prev, [name]: true }));
};

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">SECOND</h1>
        <div className="warning-header">
          <span className="warning-label">Warning:</span>
          <div className="warning-checks">
            {[1, 2, 3, 4].map(i => (
              <label key={i}>
                <input 
                  type="checkbox" 
                  className="nes-checkbox" 
                  checked={i <= warnings}
                  readOnly
                />
                <span></span>
              </label>
            ))}
          </div>
          <button onClick={addWarning} className="nes-btn is-error small-warning-btn">
            +
          </button>
        </div>
      </div>

      <div className="content">
        <div className="layout">
          <div className="main">
            <div className="components-frame nes-container">
              <div className="grid">
                <System 
                  max_marks={2} 
                  buttonText="Mine"
                  onComplete={() => completeItem("Mine")}
                  resetMarks={resetFlags["Mine"]}
                />
                <System 
                  max_marks={3} 
                  buttonText="Torpille"
                  onComplete={() => completeItem("Torpille")}
                  resetMarks={resetFlags["Torpille"]} 
                />
                <System 
                  max_marks={3} 
                  buttonText="Drone"
                  onComplete={() => completeItem("Drone")}
                  resetMarks={resetFlags["Drone"]}
                />
                <System 
                  max_marks={2} 
                  buttonText="Sonar"
                  onComplete={() => completeItem("Sonar")}
                  resetMarks={resetFlags["Sonar"]}
                />
                <System 
                  max_marks={5} 
                  buttonText="Furtif"
                  onComplete={() => completeItem("Furtif")}
                  resetMarks={resetFlags["Furtif"]}
                />
              </div>
            </div>

            <div className="action-buttons"> 
              <button onClick={resetAll} className="nes-btn is-warning reset-btn">
                Réinitialiser tout
              </button>
            </div>
          </div>

          <div className="items-box nes-container">
            <h2 className="items-title">Objets chargés</h2>
            <ul className="items-list">
              {items.map((item, index) => (
                <li key={index} className="item">
                  <span className="nes-text is-primary">{item.name}</span>
                  <button 
                    onClick={() => useItem(item.name)} 
                    className="nes-btn is-success use-btn"
                  >
                    Utiliser
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SecondPage;