import { useSelector, useDispatch } from 'react-redux';
import { selectFilter, setFilter } from '../store/charactersSlice';

function FilterBar() {
  const filter = useSelector(selectFilter);
  const dispatch = useDispatch();

  const filters = ['all', 'alive', 'dead', 'unknown'];

  return (
    <div className="filter-bar">
      {filters.map(f => (
        <button
          key={f}
          className={`filter-btn ${filter === f ? 'active' : ''}`}
          onClick={() => dispatch(setFilter(f))}
        >
          {f.charAt(0).toUpperCase() + f.slice(1)}
        </button>
      ))}
    </div>
  );
}

export default FilterBar;