import { useSelector } from 'react-redux';
import { selectLikedIds } from '../store/charactersSlice';

function Header() {
  const likedIds = useSelector(selectLikedIds);

  return (
    <header className="header">
      <h1>Rick & Morty Characters (Redux)</h1>
      <div className="likes-badge">
        {likedIds.length} personnages likés
      </div>
    </header>
  );
}

export default Header;