import { useState } from "react";
import History from "../components/History";
import Cookies from "js-cookie";

interface HomePageProps {
    setIsAuthenticated: (value: boolean) => void;
}


function HomePage({ setIsAuthenticated }: HomePageProps) {
    const [showHistory, setShowHistory] = useState(false);

    function disconnect(): void {
        Cookies.remove("token");
        setIsAuthenticated(false);
    }

    return (
        <div style={{ position: 'relative', minHeight: '100vh' }}>
            <div className="nes-container">
                <h1>Page d'Accueil</h1>
            </div>

            {/* Bouton positionné en bas à droite */}
            <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 100 }}>
                <button
                    className="nes-btn is-primary me-2"  // me-2 = margin-right de 0.5rem (~8px)
                    onClick={() => setShowHistory(!showHistory)}
                >
                    {showHistory ? 'Masquer' : 'Afficher'} l'Historique
                </button>
                <button
                    className="nes-btn is-warning"
                    onClick={() => disconnect()}
                >
                    Déconnexion
                </button>
            </div>

            {showHistory && <History />}
        </div>
    );
}

export default HomePage;