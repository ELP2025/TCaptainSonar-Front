import { useState, useEffect } from "react";
import "nes.css/css/nes.min.css";

interface SystemProps {
  max_marks: number;       // Nombre maximum de cases à cocher
  buttonText?: string;     // Texte du bouton (optionnel)
  onComplete: () => void;  // Callback quand le système est complété
  resetMarks?: boolean;    // Flag pour réinitialiser l'état
  canAct: boolean;         // Permission d'interaction
}

/**
 * Composant System - Représente un système interactif avec cases à cocher
 * 
 * Comportement :
 * - Affiche un bouton et une série de cases à cocher
 * - Chaque clic sur le bouton remplit une case supplémentaire
 * - Quand toutes les cases sont cochées, déclenche onComplete()
 * - Peut être réinitialisé via le prop resetMarks
 * - Respecte les permissions d'action (canAct)
 */
export default function System({ 
  max_marks,
  buttonText = "Système",
  onComplete,
  resetMarks = false,
  canAct
}: SystemProps) {
  const [marks, setMarks] = useState(0);       // Nombre de cases cochées
  const [isLocked, setIsLocked] = useState(false); // Verrouillage après complétion

  /**
   * Effet pour gérer la réinitialisation du système
   * Se déclenche quand resetMarks change et est vrai
   */
  useEffect(() => {
    if (resetMarks) {
      setMarks(0);
      setIsLocked(false);
    }
  }, [resetMarks]);

  /**
   * Gère l'incrémentation des cases cochées
   * - Vérifie que le système n'est pas verrouillé
   * - Vérifie que les actions sont permises (canAct)
   * - Déclenche onComplete() quand toutes les cases sont cochées
   */
  const handleIncrement = () => {
    if (!isLocked && canAct) {
      setMarks(prev => {
        const newMarks = Math.min(prev + 1, max_marks);
        
        // Si toutes les cases sont cochées, verrouille et déclenche le callback
        if (newMarks === max_marks) {
          onComplete();
          setIsLocked(true);
        }
        
        return newMarks;
      });
    }
  };

  /**
   * Rend une case à cocher individuelle
   * @param index Position de la case dans la séquence
   */
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

  // Calcul du nombre de cases par ligne (max 3 en haut, le reste en bas)
  const topRowBoxes = Math.min(3, max_marks);
  const bottomRowBoxes = Math.max(0, max_marks - 3);

  return (
    <div className="nes-container with-title is-centered component-container">
      <div className="checkboxes-layout">
        {/* Bouton principal - désactivé si verrouillé ou actions non permises */}
        <button 
          onClick={handleIncrement}
          className={`nes-btn ${isLocked || !canAct ? 'is-disabled' : 'is-success'}`}
          disabled={isLocked || !canAct}
          aria-label={buttonText}
        >
          {buttonText}
        </button>

        {/* Groupement des cases à cocher avec disposition sur 2 lignes si nécessaire */}
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