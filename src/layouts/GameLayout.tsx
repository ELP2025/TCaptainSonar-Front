import { Outlet } from 'react-router-dom';

export default function GameLayout() {
  return (
    <div className="game-container">
      <header>Captain Sonar - En cours</header>
      <main>
        <Outlet /> {/* Ceci affichera les routes enfants */}
      </main>
    </div>
  );
}