import { useSelector, useDispatch } from 'react-redux';
import { selectLikedIds, toggleLike } from '../store/charactersSlice';

function CharacterCard({ character }) {
  const likedIds = useSelector(selectLikedIds);
  const dispatch = useDispatch();
  const isLiked = likedIds.includes(character.id);

  return (
    <div className="character-card">
      <button
        className={`like-btn ${isLiked ? 'liked' : ''}`}
        onClick={() => dispatch(toggleLike(character.id))}
      >
        {isLiked ? '     ' : '     '}
      </button>

      <img src={character.image} alt={character.name} />

      <div className="character-info">
        <div className="character-name">{character.name}</div>
        <div className={`character-status status-${character.status.toLowerCase()}`}>
          {character.status} - {character.species}
        </div>
      </div>
    </div>
  );
}

export default CharacterCard;