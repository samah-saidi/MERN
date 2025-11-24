import { useEffect } from 'react';
import useCharactersStore from '../store/useCharactersStore';
import CharacterCard from './CharacterCard';

function CharacterGrid() {
  const getFilteredCharacters = useCharactersStore(state => state.getFilteredCharacters);
  const loading = useCharactersStore(state => state.loading);
  const fetchCharacters = useCharactersStore(state => state.fetchCharacters);

  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  const characters = getFilteredCharacters();

  return (
    <div className="character-grid">
      {characters.map(character => (
        <CharacterCard key={character.id} character={character} />
      ))}
    </div>
  );
}

export default CharacterGrid;