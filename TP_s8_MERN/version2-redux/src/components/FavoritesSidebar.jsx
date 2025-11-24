import { useSelector, useDispatch } from 'react-redux';
import { selectLikedCharacters, toggleLike } from '../store/charactersSlice';

function FavoritesSidebar() {
  const likedCharacters = useSelector(selectLikedCharacters);
  const dispatch = useDispatch();

  return (
    <div className="favorites-sidebar">
      <h2>Mes Favoris ({likedCharacters.length})</h2>

      {likedCharacters.length === 0 ? (
        <p style={{ color: '#95a5a6' }}>Aucun favori</p>
      ) : (
        likedCharacters.map(character => (
          <div key={character.id} className="favorite-item">
            <img src={character.image} alt={character.name} />
            <span>{character.name}</span>
            <button
              onClick={() => dispatch(toggleLike(character.id))}
              style={{
                marginLeft: 'auto',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '20px'
              }}
            >
              ❌
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default FavoritesSidebar;