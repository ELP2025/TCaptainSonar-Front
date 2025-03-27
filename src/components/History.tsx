import { useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import PerformanceCard from "./HistoryCard";

interface JwtPayload {
    id: string;
    username: string;
    iat: number;
    exp: number;
}

interface Game {
    _id: string;
    startDate: string;
    endDate: string;
    status: string;
}

interface Performance {
    _id: string;
    player: string;
    game: Game;
    score: number;
    role: string;
}

function History() {
    const [performances, setPerformances] = useState<Performance[]>([]);
    const [username, setUsername] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUserData = () => {
            const token = Cookies.get('token');
            if (!token) {
                console.log("Pas de token trouvé");
                setLoading(false);
                return;
            }

            try {
                const decoded = jwtDecode<JwtPayload>(token);
                console.log("Username décodé:", decoded.username);
                setUsername(decoded.username); // ← Ici on met à jour l'état
                
                // Si tu veux aussi récupérer les jeux :
                fetchGames(decoded.id); 
            } catch (err) {
                console.error("Erreur de décodage:", err);
            } finally {
                setLoading(false);
            }
        };

        const fetchGames = async (userId: string) => {
            try {
                const response = await fetch(`http://localhost:3000/api/performances/user/${userId}`);
                const data = await response.json();
                setPerformances(data); // Ou traite les données selon ton besoin
            } catch (err) {
                console.error("Erreur fetch games:", err);
            }
        };

        fetchUserData();
    }, []); // Le tableau vide signifie que ça ne s'exécute qu'au montage

    if (loading) return <div>Chargement...</div>;

    return (
        <div className="nes-container">
          <h2>Historique de {username}</h2>
          
          {performances.length === 0 ? (
            <div className="nes-container is-rounded">
              <p>Aucune performance trouvée.</p>
            </div>
          ) : (
            <div>
              {performances.map((performance) => (
                <PerformanceCard key={performance._id} performance={performance} />
              ))}
            </div>
          )}
        </div>
      );
}


export default History;