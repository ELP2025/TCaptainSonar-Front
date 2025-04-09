import { useState } from "react";
import { Link } from "react-router-dom";
import History from "../components/History";
import DisconnectButton from "../components/DisconnectButton";




function HomePage() {
    const [showHistory, setShowHistory] = useState(false); 

    return (
        
        <div style={{ position: 'relative', minHeight: '100vh' }}>
            <div className="nes-container">
                <h1>TCaptain Sonar</h1>
            </div>

            <div className="nes-container" style={{ margin: '2rem auto', textAlign: 'center' }}>
                <Link 
                    to="/lobby" 
                    className="nes-btn is-success" 
                    style={{ marginBottom: '1rem' }}
                >
                    Lancer une partie
                </Link>
            </div>
            

            {/* Bouton positionné en bas à droite */}
            <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 100 }}>
                <button
                    className="nes-btn is-primary me-2"  // me-2 = margin-right de 0.5rem (~8px)
                    onClick={() => setShowHistory(!showHistory)}
                >
                    {showHistory ? 'Masquer' : 'Afficher'} l'Historique
                </button>
                <DisconnectButton/>
            </div>
                {showHistory && <History />}

        </div>
    );
}

export default HomePage;