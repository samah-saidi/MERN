import { useCharacters } from '../context/CharactersContext';
import CharacterCard from './CharacterCard';

function CharacterGrid() {
    const { getFilteredCharacters, loading } = useCharacters();

    if (loading) {
        return <div className="loading">Chargement...</div>;
    }

    const filteredCharacters = getFilteredCharacters();

    return (
        <div className="character-grid">
            {filteredCharacters.map(character => (
                <CharacterCard key={character.id} character={character} />
            ))}
        </div>
    );
}

export default CharacterGrid;