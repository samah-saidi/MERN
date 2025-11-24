import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectFilteredCharacters,
  selectLoading,
  fetchCharacters
} from '../store/charactersSlice';
import CharacterCard from './CharacterCard';

function CharacterGrid() {
  const characters = useSelector(selectFilteredCharacters);
  const loading = useSelector(selectLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCharacters());
  }, [dispatch]);

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="character-grid">
      {characters.map(character => (
        <CharacterCard key={character.id} character={character} />
      ))}
    </div>
  );
}

export default CharacterGrid;