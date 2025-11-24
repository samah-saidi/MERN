## 🔴 Rick & Morty Gallery - Redux Toolkit 
-----------

*“Parce que gérer l’état global sans structure, c’est comme sauver Rick sans portal gun.”*

Redux Toolkit (RTK) est la version moderne, simplifiée et recommandée de Redux.
Il règle presque tous les problèmes qui faisaient de Redux quelque chose de long, verbeux et complexe.

Ce projet t’explique :

- Pourquoi Redux existe

- Comment Redux Toolkit simplifie tout

- La structure d’un store moderne

- L’usage de createSlice, createAsyncThunk, useSelector, useDispatch

- Un exemple réaliste basé sur le projet Rick & Morty

### 🎯 Objectifs

Avec ce guide, tu pourras :

*✓ Comprendre le fonctionnement de Redux Toolkit*

*✓ Organiser proprement ton state global*

*✓ Charger des données depuis une API via createAsyncThunk*

*✓ Implémenter likes, filtres, favoris, loading…*

*✓ Utiliser Redux comme un pro dans n’importe quel projet*

-------
### 🔴 Concepts clés

Redux suit un pattern **unidirectionnel** strict :
- Un **Store** unique contient tout l'état
- Des **Actions** décrivent ce qui se passe
- Des **Reducers** mettent à jour l'état
- Des **Selectors** lisent l'état

--------------

### 📐 Architecture Redux
```
┌─────────────────────────────────────────┐
│              STORE (État Global)        │
│  { characters: [], likedIds: [] }      │
└─────────────────────────────────────────┘
           ↑                    ↓
      Selector              Dispatch
           │                    │
    ┌──────┴────────┐    ┌─────┴──────┐
    │   Component   │    │   Action   │
    └───────────────┘    └────────────┘
                              ↓
                        ┌──────────┐
                        │ Reducer  │
                        └──────────┘
```                        

#### 🧩 1. Pourquoi Redux ?

Dans une app React moyenne, plusieurs composants ont besoin d’une même donnée :

  - utilisateur

  - panier

  - liste filtrée

  - favoris

  - thèmes

  - résultats d’API

Sans une solution d’état global, on finit avec :

❌ Du prop drilling

❌ Des états dupliqués

❌ Des données incohérentes

❌ De la complexité qui augmente

**➡️ Redux apporte un store centralisé**

**➡️ Tous les composants peuvent accéder aux données**

**➡️ Les modifications sont prévisibles et contrôlées**

--------------

#### 🧠 2. Pourquoi Redux Toolkit (RTK) ?

RTK est la version moderne et officielle de Redux :

✓ moins de code

✓ plus simple

✓ opinionated (= bonnes pratiques imposées)

✓ support des actions async intégré

✓ immutabilité gérée automatiquement

✓ devtools parfaits

C’est actuellement la meilleure façon de faire du Redux.

-----------

#### 🏗️ 3. Architecture avec Redux Toolkit

##### 📂 Structure du Projet

```jsx
version2-redux/
├── src/
│   ├── store/
│   │   ├── charactersSlice.js       # Slice Redux avec actions/reducers
│   │   └── store.js                 # Configuration du store
│   ├── components/
│   │   ├── Header.jsx               # Header avec useSelector
│   │   ├── FilterBar.jsx            # Filtres avec dispatch
│   │   ├── CharacterCard.jsx        # Carte avec actions Redux
│   │   ├── CharacterGrid.jsx        # Grille avec thunk
│   │   └── FavoritesSidebar.jsx     # Sidebar avec selectors
│   ├── styles/
│   │   └── styles.css               # Styles globaux
│   ├── App.jsx                      # Composant principal
│   └── main.jsx                     # Point d'entrée avec Provider
```
--------

#### 📦 4. Installation
```bash
npm install @reduxjs/toolkit react-redux
```
-----

#### 🧱 5. Créer un Slice – Le Cœur de Redux Toolkit

RTK utilise un concept clé : le slice
→ un fichier qui contient :

- l’état initial

- les reducers (= actions sync)

- les actions

- les thunks (async)

- les sélecteurs

Exemple basé sur ton projet Rick & Morty 👇

-------------

#### ⚡ 6. Charger une API avec createAsyncThunk

createAsyncThunk simplifie totalement les appels API.
```js
export const fetchCharacters = createAsyncThunk(
  "characters/fetchCharacters",
  async () => {
    const response = await fetch("https://rickandmortyapi.com/api/character");
    const data = await response.json();
    return data.results;
  }
);
```

RTK crée automatiquement :

`characters/fetchCharacters/pending`

`characters/fetchCharacters/fulfilled`

`characters/fetchCharacters/rejected`

--------

#### 🧬 7. Le Slice Complet
```js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCharacters = createAsyncThunk(
  "characters/fetchCharacters",
  async () => {
    const response = await fetch("https://rickandmortyapi.com/api/character");
    const data = await response.json();
    return data.results;
  }
);

const charactersSlice = createSlice({
  name: "characters",
  initialState: {
    characters: [],
    likedIds: [],
    filter: "all",
    loading: false
  },
  reducers: {
    toggleLike: (state, action) => {
      const id = action.payload;
      state.likedIds = state.likedIds.includes(id)
        ? state.likedIds.filter(x => x !== id)
        : [...state.likedIds, id];
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
export default charactersSlice.reducer;
```

#### 🗄️ 8. Configurer le Store
```js
import { configureStore } from "@reduxjs/toolkit";
import charactersReducer from "./charactersSlice";

export const store = configureStore({
  reducer: {
    characters: charactersReducer
  }
});
```
----

#### 🔌 9. Fournir le Store à l'Application

Dans main.jsx :
```jsx
<Provider store={store}>
  <App />
</Provider>
```

Tous tes composants peuvent maintenant utiliser Redux.

-----
#### 🍽️ 10. Consommer les données : useSelector
```js
import { useSelector } from "react-redux";
import { selectLikedIds } from "../store/charactersSlice";

const likedIds = useSelector(selectLikedIds);
```

**Créons des sélecteurs utiles :**

```jsx
export const selectCharacters = state => state.characters.characters;
export const selectLikedIds = state => state.characters.likedIds;
export const selectFilter = state => state.characters.filter;
export const selectLoading = state => state.characters.loading;

export const selectFilteredCharacters = state => {
  const { characters, filter } = state.characters;
  if (filter === "all") return characters;
  return characters.filter(c => c.status.toLowerCase() === filter);
};

export const selectLikedCharacters = state =>
  state.characters.characters.filter(c =>
    state.characters.likedIds.includes(c.id)
  );
```

----

#### 🎮 11. Déclencher une action : useDispatch
```js
import { useDispatch } from "react-redux";
import { toggleLike } from "../store/charactersSlice";

const dispatch = useDispatch();

<button onClick={() => dispatch(toggleLike(character.id))}>❤️</button>
```

#### 🎮 12.charactersSlices.js
```js
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
```

#### 🧪 13. Exemple complet de composants
**Header (affiche les likes)**
```jsx
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
```

**FilterBar (changement de filtre)**
```jsx
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
```

**CharacterGrid (chargement API + affichage filtré)**
```jsx
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
```

**FavoritesSidebar.jsx**
```jsx
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
```

**CharactersCard.jsx**
```jsx
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
```
---------

#### 💎 14. Avantages de Redux Toolkit

**✔️ Très structuré**

Tu maîtrises où chaque donnée se trouve.

**✔️ Devtools incroyablement puissants**

Timetravel, state explorer, actions log…

**✔️ Parfait pour les grandes applications**

RTK est la norme pour :

- apps d’entreprise

- apps avec API complexes

- état global volumineux

- logique métier évoluée

**✔️ Moins de code que Redux classique**

-------

#### ⚠️ 15. Limites

Un peu plus verbeux que useContext ou Zustand

Architecture imposée

Peut être “too much” pour de petites apps

-------
#### 🚀 16. Conclusion

Redux Toolkit est aujourd’hui :

  - Le standard moderne de Redux

  - La solution idéale pour les apps structurées

  - La meilleure option pour un état global complexe

  - Un outil puissant, propre et prévisible

---------
