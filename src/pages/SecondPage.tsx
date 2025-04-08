import { useState, useEffect } from 'react';
import 'nes.css/css/nes.min.css';
import './SecondPage.css';
import System from './System';

interface Item {
  name: string;
  used: boolean;
}

/**
 * Composant SecondPage - Interface principale avec le nouveau système d'actions alternées
 * 
 * Nouveautés :
 * - Système d'actions autorisées (0: rien, 1: systèmes, 2: utilisations)
 * - Timer de 5 secondes entre chaque action
 * - Boutons désactivés selon le mode
 */
function SecondPage() {
  const [warnings, setWarnings] = useState(0);
  const [items, setItems] = useState<Item[]>([]);
  const [resetFlags, setResetFlags] = useState<Record<string, boolean>>({});
  const [allowedAction, setAllowedAction] = useState<0 | 1 | 2>(0);

  /**
   * Effet pour gérer l'alternance des modes d'action
   * Toutes les 5 secondes, passe aléatoirement en mode 1 ou 2
   */
  useEffect(() => {
    if (allowedAction === 0) {
      const timer = setTimeout(() => {
        const nextMode = items.length > 0 ? (Math.random() > 0.5 ? 1 : 2) : 1;
        setAllowedAction(nextMode);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [allowedAction, items.length]);

  /**
   * Consomme l'action en cours et retourne en mode attente
   */
  const consumeAction = () => {
    setAllowedAction(0);
  };

  const addWarning = () => {
    setWarnings(prev => Math.min(prev + 1, 4));
  };

  const completeItem = (name: string) => {
    if (allowedAction === 1 && !items.some(item => item.name === name)) {
      setItems([...items, { name, used: false }]);
      consumeAction();
    }
  };

  const useItem = (name: string) => {
    if (allowedAction === 2) {
      setItems(prevItems => prevItems.filter(item => item.name !== name));
      setResetFlags(prev => ({ ...prev, [name]: true }));
      setTimeout(() => {
        setResetFlags(prev => ({ ...prev, [name]: false }));
      }, 10);
      consumeAction();
    }
  };
  return (
    <div className="container">
      <div className="header">
        <h1 className="title">SECOND</h1>

        {/* Indicateur de mode */}
        <div className={`action-mode nes-container is-rounded ${
          allowedAction === 0 ? 'is-dark' : 
          allowedAction === 1 ? 'is-primary' : 'is-success'
        }`}>
          {allowedAction === 0 ? 'En attente...' : 
           allowedAction === 1 ? 'Mode Systèmes' : 'Mode Utilisation'}
        </div>

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
          <button 
          onClick={addWarning} 
          className="nes-btn is-error small-warning-btn">
            +
          </button>
        </div>
      </div>

      <div className="content">
        <div className="layout">
          <div className="main">
            <div className="components-frame nes-container">
              <div className="grid">
                {["Mine", "Torpille", "Drone", "Sonar", "Furtif"].map(name => (
                  <System 
                    key={name}
                    max_marks={name === "Furtif" ? 5 : name === "Sonar" || name === "Mine" ? 2 : 3}
                    buttonText={name}
                    onComplete={() => completeItem(name)}
                    resetMarks={resetFlags[name]}
                    allowedAction={allowedAction}
                    onActionConsumed={consumeAction}
                  />
                ))}
              </div>
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
                    className={`nes-btn ${allowedAction === 2 ? 'is-success' : 'is-disabled'}`}
                    disabled={allowedAction !== 2}
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