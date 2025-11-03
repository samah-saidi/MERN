# TP React - Introduction à React et Vite 🚀

## 📋 Table des matières

- [Description](#description)
- [Objectifs pédagogiques](#objectifs-pédagogiques)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Structure du projet](#structure-du-projet)
- [Concepts théoriques](#concepts-théoriques)
- [Exercices réalisés](#exercices-réalisés)
- [Commandes utiles](#commandes-utiles)
- [Technologies utilisées](#technologies-utilisées)
- [Auteurs](#auteurs)

---

## 📖 Description

Ce TP est une introduction pratique à **React** et **Vite**, réalisé dans le cadre du cours MERN (MongoDB, Express, React, Node.js) à l'École Polytechnique de Sousse.

L'objectif est de créer une application de blog avec plusieurs composants réutilisables, en utilisant les concepts fondamentaux de React : JSX, Props, et le rendu de listes.

---

## 🎯 Objectifs pédagogiques

À la fin de ce TP, vous serez capable de :

- ✅ Comprendre la différence entre une application multi-pages (MPA) et une Single Page Application (SPA)
- ✅ Expliquer ce qu'est React et son rôle dans le développement frontend
- ✅ Maîtriser la syntaxe JSX et ses règles fondamentales
- ✅ Créer des composants React fonctionnels réutilisables
- ✅ Utiliser les props pour transmettre des données entre composants
- ✅ Initialiser un projet React moderne avec Vite
- ✅ Afficher des listes de données avec la méthode `.map()`
- ✅ Structurer une application React selon les bonnes pratiques

---

## 🔧 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (version 16 ou supérieure)
- **npm** (généralement installé avec Node.js)
- Un éditeur de code (VS Code recommandé)
- Un navigateur web moderne (Chrome, Firefox, Edge)

### Vérifier les installations
```bash
node --version
npm --version
```

---

## 🚀 Installation

### 1. Créer le projet avec Vite
```bash
# Créer le projet
npm create vite@latest mon-blog-react -- --template react

# Se déplacer dans le dossier
cd mon-blog-react

# Installer les dépendances
npm install
```

### 2. Lancer le serveur de développement
```bash
npm run dev
```

Ouvrez votre navigateur à l'adresse : [http://localhost:5173](http://localhost:5173)

---

## 📁 Structure du projet
```
mon-blog-react/
│
├── node_modules/          # Dépendances installées
├── public/                # Fichiers statiques
├── src/
│   ├── components/        # Composants React
│   │   ├── Article.jsx
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Badge.jsx
│   │   ├── ProductCard.jsx
│   │   ├── CommentCard.jsx
│   │   └── CommentList.jsx
│   ├── App.jsx            # Composant principal
│   ├── main.jsx           # Point d'entrée
│   └── index.css          # Styles globaux
│
├── index.html             # Page HTML principale
├── package.json           # Configuration npm
├── vite.config.js         # Configuration Vite
└── README.md              # Ce fichier
```

---

## 📚 Concepts théoriques

### 1. Single Page Application (SPA)

Une **SPA** charge une seule page HTML au départ, puis JavaScript génère et met à jour le contenu dynamiquement sans rechargement complet.

**Avantages :**
- Navigation fluide et rapide
- Meilleure expérience utilisateur
- Pas de "clignotement" de page

**Analogie :** Comme un livre avec une page magique qui change son contenu au lieu de tourner physiquement les pages.

---

### 2. React

React est une **bibliothèque JavaScript** développée par Facebook (Meta) pour construire des interfaces utilisateur.

**Caractéristiques :**
- **Déclaratif** : On décrit QUOI afficher, pas COMMENT
- **Basé sur les composants** : Interface divisée en morceaux réutilisables
- **Learn Once, Write Anywhere** : Web, mobile (React Native), desktop

---

### 3. JSX (JavaScript XML)

JSX est une extension syntaxique qui ressemble à HTML mais qui est du JavaScript.

**Important :** Le JSX n'est PAS du HTML ! C'est une syntaxe transformée en JavaScript par Vite.

#### Règles fondamentales du JSX

**1. Un seul élément racine**
```jsx
// ❌ ERREUR - Plusieurs racines
function Wrong() {
  return (
    <h1>Titre</h1>
    <p>Paragraphe</p>
  );
}

// ✅ CORRECT - Enveloppé dans un fragment
function Correct() {
  return (
    <>
      <h1>Titre</h1>
      <p>Paragraphe</p>
    </>
  );
}
```

**2. Attributs en camelCase**
```jsx
// HTML traditionnel
<div class="container" onclick="handleClick()">

// JSX (camelCase)
<div className="container" onClick={handleClick}>
```

**3. Expressions JavaScript entre accolades**
```jsx
const name = "Alice";
const age = 25;

return (
  <div>
    <h1>{name}</h1>
    <p>Age dans 5 ans : {age + 5}</p>
    <span>{age >= 18 ? "Majeur" : "Mineur"}</span>
  </div>
);
```

**4. Fermeture obligatoire des balises**
```jsx
// ❌ JSX invalide
<input type="text">
<img src="photo.jpg">

// ✅ JSX valide
<input type="text" />
<img src="photo.jpg" />
```

---

### 4. Les Props

Les **props** (properties) permettent de passer des données d'un composant parent à un composant enfant.

**Analogie :** Comme passer des paramètres à une fonction.
```jsx
// Composant Parent
function App() {
  return <WelcomeMessage name="Alice" age={25} />;
}

// Composant Enfant
function WelcomeMessage({ name, age }) {
  return (
    <div>
      <h2>Bienvenue {name} !</h2>
      <p>Vous avez {age} ans</p>
    </div>
  );
}
```

**Règle importante :** Les props sont **en lecture seule**. Un composant enfant ne peut jamais modifier ses props.

---

### 5. Afficher des listes avec `.map()`

Pour afficher une liste d'éléments, on utilise la méthode `.map()` :
```jsx
function StudentList() {
  const students = [
    { id: 1, name: "Alice", grade: 18 },
    { id: 2, name: "Bob", grade: 15 },
    { id: 3, name: "Charlie", grade: 16 }
  ];

  return (
    <ul>
      {students.map((student) => (
        <li key={student.id}>
          {student.name}: {student.grade}/20
        </li>
      ))}
    </ul>
  );
}
```

**⚠️ La prop `key` est obligatoire !**

Règles :
- Utiliser un identifiant unique (ID de la base de données)
- Ne PAS utiliser l'index du tableau si la liste peut changer
- La key doit être stable (pas de `Math.random()`)

---

### 6. Vite

**Vite** est un outil de build moderne qui remplace Create React App (CRA).

**Avantages :**
- ⚡ Démarrage ultra-rapide : < 1 seconde vs 30+ secondes pour CRA
- 🔥 Hot Module Replacement : Modifications instantanées
- 📦 Build optimisé : Production rapide et efficace
- 🎯 Simple : Configuration minimale

**Comment Vite est si rapide ?**

Vite utilise les modules ES natifs du navigateur. Au lieu de bundler tous les fichiers avant de démarrer, Vite sert les fichiers directement et laisse le navigateur les charger à la demande.

---

## 💻 Exercices réalisés

### Exercice 1 : Composant Badge 🏷️

**Objectif :** Créer un composant Badge pour afficher des étiquettes colorées.

**Props :**
- `text` : Le texte à afficher
- `color` : La couleur du badge (par défaut : "blue")

**Code du composant :**
```jsx
// src/components/Badge.jsx
function Badge({ text, color = "blue" }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '5px 10px',
      backgroundColor: color,
      color: 'white',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 'bold',
      marginLeft: '10px'
    }}>
      {text}
    </span>
  );
}

export default Badge;
```

**Utilisation :**
```jsx
<Badge text="Nouveau" color="green" />
<Badge text="Populaire" color="red" />
```

**Concepts appliqués :**
- Props avec valeurs par défaut
- Style inline en JavaScript
- Affichage conditionnel avec `&&`

---

### Exercice 2 : Liste de Produits 🛒

**Objectif :** Créer un système d'affichage de produits avec carte produit.

**Props du ProductCard :**
- `name` : Nom du produit
- `price` : Prix du produit
- `category` : Catégorie du produit

**Code du composant :**
```jsx
// src/components/ProductCard.jsx
function ProductCard({ name, price, category }) {
  return (
    <div style={{
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '15px',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3>{name}</h3>
        <span style={{
          backgroundColor: '#dbeafe',
          color: '#1e40af',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '12px'
        }}>
          {category}
        </span>
      </div>
      
      <div style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#10b981'
      }}>
        {price} DT
      </div>
      
      <button style={{
        marginTop: '15px',
        width: '100%',
        padding: '10px',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer'
      }}>
        Ajouter au panier
      </button>
    </div>
  );
}

export default ProductCard;
```

**Données d'exemple :**
```jsx
const products = [
  { id: 1, name: "Laptop HP", price: 1200, category: "Électronique" },
  { id: 2, name: "Souris Logitech", price: 25, category: "Accessoires" },
  { id: 3, name: "Clavier Mécanique", price: 85, category: "Accessoires" },
  { id: 4, name: "Écran 27 pouces", price: 450, category: "Électronique" },
  { id: 5, name: "Casque Audio", price: 120, category: "Audio" }
];
```

**Concepts appliqués :**
- Grid layout responsive
- Calcul du prix total avec `reduce()`
- Événements hover
- Flexbox pour la mise en page

---

### Exercice 3 : Système de Commentaires 💬

**Objectif :** Créer un système de commentaires avec deux composants : `CommentCard` et `CommentList`.

#### CommentCard

**Props :**
- `author` : Nom de l'auteur
- `text` : Texte du commentaire
- `likes` : Nombre de likes

**Code du composant :**
```jsx
// src/components/CommentCard.jsx
function CommentCard({ author, text, likes }) {
  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '15px',
      marginBottom: '15px',
      backgroundColor: '#ffffff'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px'
      }}>
        {/* Avatar avec initiale */}
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#3b82f6',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          marginRight: '12px'
        }}>
          {author.charAt(0).toUpperCase()}
        </div>
        
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 'bold' }}>{author}</div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            Il y a 2 heures
          </div>
        </div>
        
        {/* Likes */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}>
          <span>❤️</span>
          <span style={{ fontWeight: 'bold', color: '#ef4444' }}>
            {likes}
          </span>
        </div>
      </div>
      
      <p style={{ margin: '10px 0 0 52px' }}>{text}</p>
    </div>
  );
}

export default CommentCard;
```

#### CommentList (Bonus)

**Props :**
- `comments` : Tableau de commentaires
- `title` : Titre de la section

**Code du composant :**
```jsx
// src/components/CommentList.jsx
import CommentCard from './CommentCard';

function CommentList({ comments, title }) {
  const totalLikes = comments.reduce((sum, c) => sum + c.likes, 0);
  const avgLikes = comments.length > 0 
    ? Math.round(totalLikes / comments.length) 
    : 0;

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      {/* En-tête */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '20px',
        paddingBottom: '15px',
        borderBottom: '2px solid #e5e7eb'
      }}>
        <h2>💬 {title}</h2>
        <span style={{
          backgroundColor: '#dbeafe',
          color: '#1e40af',
          padding: '5px 15px',
          borderRadius: '20px'
        }}>
          {comments.length} commentaire{comments.length > 1 ? 's' : ''}
        </span>
      </div>
      
      {/* Liste des commentaires */}
      {comments.map((comment) => (
        <CommentCard
          key={comment.id}
          author={comment.author}
          text={comment.text}
          likes={comment.likes}
        />
      ))}
      
      {/* Statistiques */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-around'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {totalLikes}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            Total likes
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {comments.length}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            Commentaires
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {avgLikes}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            Moy. likes
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommentList;
```

**Concepts appliqués :**
- Composants imbriqués
- Passage de tableau complet en prop
- Calculs statistiques avec `reduce()`
- Avatar généré dynamiquement
- Pluriel conditionnel
- Architecture modulaire

---

## 🔑 Concepts clés à retenir

### Les 5 Piliers de ce TP

1. **Composants** : Fonctions qui retournent du JSX
```jsx
   function MonComposant() {
     return <div>Contenu</div>;
   }
```

2. **JSX** : Syntaxe ressemblant à HTML dans JavaScript
```jsx
   <h1>{variable}</h1>
   <div className="class" />
```

3. **Props** : Passage de données parent → enfant
```jsx
   <Enfant name="Alice" age={25} />
```

4. **Listes** : Utiliser `.map()` avec `key`
```jsx
   {items.map(item => <li key={item.id}>{item.name}</li>)}
```

5. **Structure** : Diviser en composants réutilisables

---

## 🛠️ Commandes utiles
```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build pour la production
npm run build

# Prévisualiser le build de production
npm run preview

# Linter (si configuré)
npm run lint
```

---

## 🌐 Technologies utilisées

| Technologie | Version | Description |
|-------------|---------|-------------|
| [React](https://react.dev/) | 18.x | Bibliothèque UI |
| [Vite](https://vitejs.dev/) | 5.x | Build tool rapide |
| [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) | ES6+ | Langage de programmation |
| [Node.js](https://nodejs.org/) | 16+ | Environnement d'exécution |
| [npm](https://www.npmjs.com/) | 8+ | Gestionnaire de paquets |

---

## 📊 Récapitulatif des exercices

| Exercice | Composant(s) | Concepts | Difficulté |
|----------|-------------|----------|------------|
| **1 - Badge** | Badge | Props par défaut, style inline | ⭐ Débutant |
| **2 - Produits** | ProductCard | Grid layout, calculs, hover | ⭐⭐ Intermédiaire |
| **3 - Commentaires** | CommentCard + CommentList | Imbrication, stats avancées | ⭐⭐⭐ Avancé |

---

## 📝 Travail à rendre

Votre compte rendu doit inclure :

1. ✅ Le code de vos 3 composants : Header, Footer, Article
2. ✅ Le code de votre App.jsx avec la liste d'articles
3. ✅ Une explication **avec VOS MOTS** du rôle de la prop `key`
4. ✅ Une capture d'écran de votre application fonctionnelle

**Échéance :** La veille de la prochaine séance à 23h59

⚠️ Ce travail est **obligatoire** et **noté**.

---

## 🎓 Explication : Le rôle de la prop `key`

La prop `key` est **essentielle** en React lors de l'affichage de listes.

### Pourquoi ?

React utilise la `key` pour identifier de manière unique chaque élément dans une liste. Cela lui permet de :

1. **Optimiser les performances** : React sait exactement quel élément a changé
2. **Préserver l'état** : Les composants avec state conservent leurs valeurs
3. **Éviter les bugs** : Prévient les comportements inattendus lors de réordonnancement

### Règles importantes :

- ✅ **Utiliser un ID unique** (de la base de données)
- ❌ **Ne pas utiliser l'index** si la liste peut changer d'ordre
- ❌ **Ne pas utiliser** `Math.random()` (pas stable)

### Exemple :
```jsx
// ✅ CORRECT
{students.map((student) => (
  <StudentCard key={student.id} {...student} />
))}

// ❌ INCORRECT
{students.map((student, index) => (
  <StudentCard key={index} {...student} />
))}
```

### Analogie :

Imaginez une classe d'étudiants. Si vous les identifiez par leur numéro de place (index), et qu'ils changent de place, vous ne saurez plus qui est qui ! Mais si vous utilisez leur numéro d'étudiant (ID unique), vous pourrez toujours les identifier correctement.

---

## 🚀 Prochaines étapes

La semaine prochaine, nous verrons :

- 🔄 **State** avec `useState`
- ⚡ **Interactivité** : boutons, formulaires, événements
- 🎯 **Gestion d'état** : Rendre nos composants dynamiques
- 🔥 **Effets** avec `useEffect`

---

## 👥 Auteurs

**Enseignants :**
- Abdelweheb GUEDDES
- Mohamed Ben Jazia

**Institution :**
École Polytechnique de Sousse

**Date :** 27 octobre 2025

---

## 📚 Ressources supplémentaires

- [Documentation officielle React](https://react.dev/)
- [Documentation Vite](https://vitejs.dev/)
- [MDN Web Docs - JavaScript](https://developer.mozilla.org/fr/docs/Web/JavaScript)
- [React DevTools](https://react.dev/learn/react-developer-tools)

---

## 📜 Licence

Ce projet est réalisé dans un cadre pédagogique à l'École Polytechnique de Sousse.

---

## 🙏 Remerciements

Merci d'avoir suivi ce TP ! N'hésitez pas à expérimenter et à créer vos propres composants.

**Bon courage pour la suite du cours MERN ! 🚀**

---

<div align="center">

**Made with ❤️ and ⚛️ React**

</div>