import { useState, useEffect } from 'react';
import 'nes.css/css/nes.min.css';
import './SecondPage.css';
import System from './System';

interface Item {
  name: string;
  used: boolean;
}

/**
 * Composant SecondPage - Interface principale avec systèmes interactifs
 * 
 * Gère :
 * - Un système d'avertissements avec compteur (0-4)
 * - Une collection d'items pouvant être ajoutés et utilisés
 * - Des systèmes interactifs avec complétion progressive
 * - Un mécanisme de permission d'action avec délai de 5s après modification
 */
function SecondPage() {
  const [warnings, setWarnings] = useState(0); // Compteur d'avertissements (0 à 4 max)
  const [items, setItems] = useState<Item[]>([]); // Liste des items chargés
  const [resetFlags, setResetFlags] = useState<Record<string, boolean>>({}); // Flags pour réinitialiser les systèmes
  const [actionPermission, setActionPermission] = useState(false); // Permission pour effectuer des actions

  /**
   * Effet qui gère le délai de 5 secondes après chaque modification des items
   * Active la permission d'action après ce délai
   */
  useEffect(() => {
    const timeout = setTimeout(() => {
      setActionPermission(true);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [items]);

  /**
   * Effet qui nettoie les resetFlags après leur utilisation
   * S'exécute dès qu'un flag est activé et les réinitialise
   */
  useEffect(() => {
    if (Object.values(resetFlags).some(v => v)) {
      setTimeout(() => setResetFlags({}), 0);
    }
  }, [resetFlags]);

  /**
   * Ajoute un avertissement (max 4)
   */
  const addWarning = () => {
    setWarnings(prev => Math.min(prev + 1, 4));
  };

  /**
   * Réinitialise complètement l'état (avertissements et items)
   */
  const resetAll = () => {
    setWarnings(0);
    setItems([]);
  };

  /**
   * Ajoute un nouvel item à la liste s'il n'existe pas déjà
   * @param name - Nom de l'item à ajouter
   */
  const completeItem = (name: string) => {
    if (!items.some(item => item.name === name)) {
      setItems([...items, { name, used: false }]);
      setActionPermission(false); // Bloque les actions après ajout
    }
  };

  /**
   * Utilise un item : le retire de la liste et déclenche son reset
   * @param name - Nom de l'item à utiliser
   */
  const useItem = (name: string) => {
    setItems(prevItems => prevItems.filter(item => item.name !== name));
    setResetFlags(prev => ({ ...prev, [name]: true })); // Active le reset pour ce système
    setActionPermission(false); // Bloque les actions après utilisation
  };

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">SECOND</h1>

        {/* Section d'affichage des avertissements */}
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
            {/* Grille des systèmes interactifs */}
            <div className="components-frame nes-container">
              <div className="grid">
                {["Mine", "Torpille", "Drone", "Sonar", "Furtif"].map(name => (
                  <System 
                    key={name}
                    max_marks={name === "Furtif" ? 5 : name === "Sonar" || name === "Mine" ? 2 : 3}
                    buttonText={name}
                    onComplete={() => completeItem(name)}
                    resetMarks={resetFlags[name]}
                    canAct={actionPermission}
                  />
                ))}
              </div>
            </div>

            {/* Bouton de réinitialisation globale */}
            <div className="action-buttons"> 
              <button onClick={resetAll} className="nes-btn is-warning reset-btn">
                Réinitialiser tout
              </button>
            </div>
          </div>

          {/* Panneau d'affichage des items chargés */}
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