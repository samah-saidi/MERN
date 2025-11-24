import useCharactersStore from '../store/useCharactersStore';

function FilterBar() {
  const filter = useCharactersStore(state => state.filter);
  const setFilter = useCharactersStore(state => state.setFilter);

  const filters = ['all', 'alive', 'dead', 'unknown'];

  return (
    <div className="filter-bar">
      {filters.map(f => (
        <button
          key={f}
          className={`filter-btn ${filter === f ? 'active' : ''}`}
          onClick={() => setFilter(f)}
        >
          {f.charAt(0).toUpperCase() + f.slice(1)}
        </button>
      ))}
    </div>
  );
}

export default FilterBar;