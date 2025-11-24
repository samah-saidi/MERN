import useCharactersStore from '../store/useCharactersStore';

function CharacterCard({ character }) {
  const likedIds = useCharactersStore(state => state.likedIds);
  const toggleLike = useCharactersStore(state => state.toggleLike);
  const isLiked = likedIds.includes(character.id);

  return (
    <div className="character-card">
      <button
        className={`like-btn ${isLiked ? 'liked' : ''}`}
        onClick={() => toggleLike(character.id)}
      >
        {isLiked ? '  ' : '  '}
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