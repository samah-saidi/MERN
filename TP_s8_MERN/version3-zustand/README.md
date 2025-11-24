## 🦊 Zustand – Rick & Morty Gallery

*“Le state management minimaliste, élégant et plus rapide que Morty qui fuit un parasite cosmique.”*

 Zustand est une alternative moderne, simple et extrêmement légère à Redux ou useContext.

 C’est actuellement l’un des outils les plus appréciés dans l’écosystème React grâce à sa simplicité et ses performances incroyables.

Ce pojet couvre :

- Pourquoi Zustand existe

- Comment fonctionne son store

- La gestion d’état global sans Provider

- Comment l’utiliser dans un vrai projet : la galerie Rick & Morty

- Les bonnes pratiques, avantages et limites

### 🎯 Objectifs

Avec ce guide, tu vas apprendre :

*✓ Créer un store Zustand en quelques lignes*

*✓ Accéder à l’état depuis n’importe quel composant*

*✓ Gérer likes, filtres, favoris, loading, API…*

*✓ Exploiter les selectors Zustand (ultra performants)*

*✓ Comprendre quand utiliser Zustand vs Redux ou useContext*

-----------
📂 Structure du Projet

```bash
version3-zustand/
├── src/
│   ├── store/
│   │   └── useCharactersStore.js    # Store Zustand (tout-en-un!)
│   ├── components/
│   │   ├── Header.jsx               # Header simple
│   │   ├── FilterBar.jsx            # Filtres directs
│   │   ├── CharacterCard.jsx        # Carte minimaliste
│   │   ├── CharacterGrid.jsx        # Grille optimisée
│   │   └── FavoritesSidebar.jsx     # Sidebar réactive
│   ├── styles/
│   │   └── styles.css               # Styles globaux
│   ├── App.jsx                      # Composant principal
│   └── main.jsx                     # PAS DE PROVIDER! 🎉
```
---------
### 🧩 1. Pourquoi Zustand ?

Zustand (qui signifie “état” en allemand) a été conçu pour résoudre plusieurs frustrations des développeurs :

❌ useContext → rerender global, limité
❌ Redux → trop de boilerplate
❌ Recoil / Jotai → learning curve plus élevée

**➡️ Zustand propose une solution simple, rapide, flexible et scalable,
sans provider, sans slice obligatoire, sans actions obligatoires.
Juste un store, des fonctions, et c’est parti.**

### ⚙️ 2. Installation
```bash
npm install zustand
```


### 🧠 3. Comment fonctionne Zustand ?

Zustand utilise un store central :

- qui contient ton état

- expose des actions pour le modifier

- s’utilise via un hook personnalisé

- ne nécessite aucun Provider (différence majeure !)

- utilise des selectors pour éviter les re-renders

------

### 🌟 4. Exemple Complet : Rick & Morty Store

**Création de store : useCharactersStore**
```js
import { create } from 'zustand';

const useCharactersStore = create((set, get) => ({
  characters: [],
  likedIds: [],
  filter: 'all',
  loading: true,


  fetchCharacters: async () => {
    set({ loading: true });
    const response = await fetch('https://rickandmortyapi.com/api/character');
    const data = await response.json();
    set({ characters: data.results, loading: false });
  },


  toggleLike: (id) => set((state) => ({
    likedIds: state.likedIds.includes(id)
      ? state.likedIds.filter(likedId => likedId !== id)
      : [...state.likedIds, id]
  })),


  setFilter: (filter) => set({ filter }),


  getLikedCharacters: () => {
    const { characters, likedIds } = get();
    return characters.filter(char => likedIds.includes(char.id));
  },

  getFilteredCharacters: () => {
    const { characters, filter } = get();
    if (filter === 'all') return characters;
    return characters.filter(char => char.status.toLowerCase() === filter);
  }
}));

export default useCharactersStore;
```

**Points forts :**

1.  Aucun Provider

2.  Selectors intégrés

3.  async géré naturellement

4.  State + actions dans le même fichier

5.  Très lisible et scalable

----


### 🔌 5. Utiliser Zustand dans les composants

##### Header : afficher le nombre de likes

```jsx
import useCharactersStore from '../store/useCharactersStore';

function Header() {
  const likedIds = useCharactersStore(state => state.likedIds);

  return (
    <header className="header">
      <h1>Rick & Morty Characters (Zustand)</h1>
      <div className="likes-badge">
        {likedIds.length} personnages likés
      </div>
    </header>
  );
}

export default Header;
```


*Grâce au selector (state) => state.likedIds*

**➡️ Le composant ne se re-render que lorsqu’il doit vraiment changer**

**➡️ Ultra performant**

##### FilterBar : filtrage dynamique
```jsx
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
```

##### CharacterGrid : appel API + liste filtrée
```jsx
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
```

##### FavoritesSidebar : favoris + suppression
```jsx
import useCharactersStore from '../store/useCharactersStore';

function FavoritesSidebar() {
  const getLikedCharacters = useCharactersStore(state => state.getLikedCharacters);
  const toggleLike = useCharactersStore(state => state.toggleLike);
  const likedCharacters = getLikedCharacters();

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
              onClick={() => toggleLike(character.id)}
              style={{
                marginLeft: 'auto',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '20px'
              }}
            >
              
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default FavoritesSidebar;
```

##### CharacterCard.jsx

```jsx
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
        {isLiked ? '❤️' : '🤍'}
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
----------

### 🎉 6. Pourquoi Zustand est génial ?
| Critère            | Zustand      | Redux          | useContext |
|-------------------|-------------|---------------|------------|
| Simplicité         | ⭐⭐⭐⭐⭐       | ⭐⭐            | ⭐⭐⭐       |
| Performance        | ⭐⭐⭐⭐⭐       | ⭐⭐⭐⭐          | ⭐⭐        |
| Boilerplate        | ⭐           | ⭐⭐⭐           | ⭐⭐        |
| API async          | Facile       | Très propre (thunk) | Moyen |
| Provider obligatoire | ❌         | ✔️             | ✔️        |
| Apprentissage      | Ultra simple | Moyen          | Simple    |

----

### 🧠 7. Best Practices Zustand

*✔ Utiliser les selectors (state) => state.value*

*✔ Garder l’état simple et lisible*

*✔ Préférer un seul store ou plusieurs petits stores indépendants*

*✔ Utiliser get() pour les fonctions dérivées*

*✔ Déplacer les appels API dans le store (comme dans ton projet)*

----

### ⚠️ 8. Limites de Zustand

🔴 Pas de structure imposée comme Redux

🔴 Peut devenir fouillis si mal organisé

🔴 Moins adapté aux très grandes équipes qui veulent une architecture rigide

🔴 Pas de time-travel debugging natif (contrairement à Redux)

---

### 🚀 Conclusion

Zustand est une solution idéale pour :

✅ Applications React rapides et simples

✅ Projets personnels ou de taille moyenne

✅ États globalisés sans complexité

✅ Gestion fluide des API, filtres, favoris…