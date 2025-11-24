import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunk pour charger les personnages
export const fetchCharacters = createAsyncThunk(
  'characters/fetchCharacters',
  async () => {
    const response = await fetch('https://rickandmortyapi.com/api/character');
    const data = await response.json();
    return data.results;
  }
);

const charactersSlice = createSlice({
  name: 'characters',
  initialState: {
    characters: [],
    likedIds: [],
    filter: 'all',
    loading: false,
  },
  reducers: {
    toggleLike: (state, action) => {
      const id = action.payload;
      if (state.likedIds.includes(id)) {
        state.likedIds = state.likedIds.filter(likedId => likedId !== id);
      } else {
        state.likedIds.push(id);
      }
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCharacters.pending, state => {
        state.loading = true;
      })
      .addCase(fetchCharacters.fulfilled, (state, action) => {
        state.characters = action.payload;
        state.loading = false;
      });
  }
});

export const { toggleLike, setFilter } = charactersSlice.actions;

// Selectors
export const selectCharacters = state => state.characters.characters;
export const selectLikedIds = state => state.characters.likedIds;
export const selectFilter = state => state.characters.filter;
export const selectLoading = state => state.characters.loading;

export const selectLikedCharacters = (state) =>{
    return state.characters.characters.filter(char =>
    state.characters.likedIds.includes(char.id)
  );
};

export const selectFilteredCharacters = (state) => {
  const { characters, filter } = state.characters;
  if (filter === 'all') return characters;
  return characters.filter(char => char.status.toLowerCase() === filter);
};

export default charactersSlice.reducer;