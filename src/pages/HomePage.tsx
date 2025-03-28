import { useState } from "react";
import History from "../components/History";

function HomePage() {
    const [showHistory, setShowHistory] = useState(false);

    return (
        <div style={{ position: 'relative', minHeight: '100vh' }}>
            <div className="nes-container">
                <h1>Page d'Accueil</h1>
            </div>
            
            {/* Bouton positionné en bas à droite */}
            <div style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: 100
            }}>
                <button
                    className="nes-btn is-primary"
                    onClick={() => setShowHistory(!showHistory)}
                >
                    {showHistory ? 'Masquer' : 'Afficher'} l'Historique
                </button>
            </div>

            {showHistory && <History />}
        </div>
    );
}

export default HomePage;