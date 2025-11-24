import useCharactersStore from '../store/useCharactersStore';

function Header() {
  const likedIds = useCharactersStore(state => state.likedIds);

  return (
    <header className="header">
      <h1>Rick & Morty Characters (Zustand)</h1>
      <div className="likes-badge">
        {likedIds.length} personnages likés
      </div>
    </header>
  );
}

export default Header;