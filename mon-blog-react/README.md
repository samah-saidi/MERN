# 📘 Cours MERN -- Semaine 6 : Introduction à React et Vite

**École Polytechnique Sousse**\
**Formateurs : Abdelweheb Gueddes & Mohamed Ben Jazia**\
🗓️ *27 octobre 2025*

------------------------------------------------------------------------

## 🎯 Objectifs Pédagogiques

À la fin de cette séance, vous serez capables de : - Comprendre la
différence entre une **MPA (Multi-Page Application)** et une **SPA
(Single Page Application)** - Expliquer le rôle de **React** dans le
développement frontend moderne - Maîtriser la syntaxe **JSX** - Créer
des **composants réutilisables** - Utiliser les **props** pour
communiquer entre composants - Initialiser un projet React avec
**Vite** - Afficher des listes dynamiques avec `.map()` - Structurer une
application React selon les bonnes pratiques

------------------------------------------------------------------------

## 🧠 Partie 1 --- Concepts Théoriques

### ⚙️ 1. MPA vs SPA

    MPA (Multi-Page App)                     SPA (Single-Page App)
    ┌────────────┐                           ┌────────────┐
    │  index.html│──────┐                    │ index.html │
    └────────────┘      │                    └────────────┘
         │               │                           │
         ▼               │                           ▼
    ┌────────────┐   ┌────────────┐         ┌────────────────────┐
    │ page1.html │   │ page2.html │  ===>   │ React met à jour le│
    └────────────┘   └────────────┘         │ contenu dynamiquement│
                                            └────────────────────┘

➡️ **SPA** = pas de rechargement complet, meilleure expérience
utilisateur.

------------------------------------------------------------------------

### ⚛️ 2. React : la bibliothèque UI

React = **bibliothèque déclarative** basée sur des **composants**.

``` jsx
function Greeting() {
  return <h1>Bonjour le monde !</h1>;
}
```

**Avantages :** - Réutilisable ♻️ - Lisible 👀 - Composable 🧩

------------------------------------------------------------------------

### 💡 3. JSX : JavaScript + XML

Le JSX permet d'écrire du code proche du HTML à l'intérieur de
JavaScript.

``` jsx
const element = <h1>Hello React!</h1>;
```

#### 🔸 Règles fondamentales

-   Un seul élément racine\
-   Attributs en `camelCase`\
-   Balises toujours fermées\
-   JavaScript entre `{}`

------------------------------------------------------------------------

### 🧩 4. Props : Communication Parent → Enfant

    App.jsx ──────► Article.jsx
     (parent)        (enfant)
          └─────── props ───────►

``` jsx
function Article({ title, author }) {
  return <h2>{title} - {author}</h2>;
}
```

------------------------------------------------------------------------

### 🔁 5. Afficher une liste avec .map()

``` jsx
const students = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" }
];

<ul>
  {students.map(s => <li key={s.id}>{s.name}</li>)}
</ul>
```

**Attention :** toujours donner une `key` unique à chaque élément.

------------------------------------------------------------------------

### ⚡ 6. Vite : L'outil de build rapide

Commandes principales :

``` bash
npm create vite@latest mon-blog-react -- --template react
cd mon-blog-react
npm install
npm run dev
```

Accédez à <http://localhost:5173>

------------------------------------------------------------------------

## 🧩 Partie 2 --- Atelier Pratique

### Étape 1 : Créer le projet

``` bash
npm create vite@latest mon-blog-react -- --template react
cd mon-blog-react
npm install
npm run dev
```

### Étape 2 : Nettoyer et préparer le projet

-   Supprimez le contenu inutile de `src/App.jsx`
-   Créez le dossier `src/components`

------------------------------------------------------------------------

### Étape 3 : Créer les composants principaux

#### 🔹 Header.jsx

``` jsx
function Header({ title, subtitle }) {
  return (
    <header style={{
      backgroundColor: '#3b82f6',
      color: 'white',
      padding: '30px 20px',
      textAlign: 'center',
      borderRadius: '8px',
      marginBottom: '30px'
    }}>
      <h1>{title}</h1>
      {subtitle && <p style={{ opacity: 0.9 }}>{subtitle}</p>}
    </header>
  );
}
export default Header;
```

#### 🔹 Article.jsx

``` jsx
function Article({ title, author, content }) {
  return (
    <article style={{
      border: '1px solid #ddd',
      padding: '20px',
      marginBottom: '20px',
      borderRadius: '8px'
    }}>
      <h2>{title}</h2>
      <p style={{ color: '#666', fontSize: '14px' }}>Par {author}</p>
      <p>{content}</p>
    </article>
  );
}
export default Article;
```

#### 🔹 Footer.jsx

``` jsx
function Footer({ author, year }) {
  return (
    <footer style={{
      textAlign: 'center',
      padding: '20px',
      marginTop: '40px',
      borderTop: '2px solid #ddd',
      color: '#666'
    }}>
      <p>© {year} {author} — Tous droits réservés</p>
      <p style={{ fontSize: '14px', marginTop: '10px' }}>Créé avec React + Vite</p>
    </footer>
  );
}
export default Footer;
```

------------------------------------------------------------------------

### Étape 4 : App.jsx complet

``` jsx
import Header from './components/Header';
import Article from './components/Article';
import Footer from './components/Footer';

function App() {
  const articles = [
    { id: 1, title: "Introduction à React", author: "Alice", content: "React est une bibliothèque JavaScript..." },
    { id: 2, title: "Qu’est-ce que Vite ?", author: "Bob", content: "Vite est un outil de build ultra-rapide..." },
    { id: 3, title: "Les Composants en React", author: "Charlie", content: "Les composants sont les briques de base..." }
  ];

  const currentYear = new Date().getFullYear();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', flex: 1 }}>
        <Header title="Mon Blog React" subtitle="Apprendre React avec des exemples pratiques" />

        <div style={{ backgroundColor: '#f0f9ff', borderRadius: '8px', padding: '10px', marginBottom: '20px' }}>
          <strong>{articles.length}</strong> articles disponibles
        </div>

        {articles.map(article => (
          <Article key={article.id} title={article.title} author={article.author} content={article.content} />
        ))}
      </div>
      <Footer author="École Polytechnique Sousse" year={currentYear} />
    </div>
  );
}
export default App;
```

------------------------------------------------------------------------

## 🧮 Exercices Pratiques

### Exercice 1 --- Composant Badge

``` jsx
function Badge({ text, color = "blue" }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '5px 10px',
      backgroundColor: color,
      color: 'white',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 'bold'
    }}>
      {text}
    </span>
  );
}
export default Badge;
```

### Exercice 2 --- Liste de Produits

``` jsx
function ProductCard({ name, price, category }) {
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '15px',
      marginBottom: '10px',
      backgroundColor: '#f9f9f9',
    }}>
      <h2>{name}</h2>
      <p>Catégorie : {category}</p>
      <strong>Prix : ${price}</strong>
    </div>
  );
}
export default ProductCard;
```

### Exercice 3 --- Commentaires

``` jsx
function CommentCard({ author, text, likes }) {
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '15px',
      marginBottom: '10px',
      backgroundColor: '#f9f9f9',
    }}>
      <p><strong>{author}</strong></p>
      <p>{text}</p>
      <p style={{ color: '#666', fontSize: '12px' }}>👍 {likes} likes</p>
    </div>
  );
}

function CommentList({ comments }) {
  return (
    <div>
      {comments.map(c => <CommentCard key={c.id} author={c.author} text={c.text} likes={c.likes} />)}
    </div>
  );
}
```

------------------------------------------------------------------------

## 🧭 Concepts Clés à Retenir

  Concept         Description
  --------------- ---------------------------------------------
  🧱 Composants   Fonctions qui retournent du JSX
  🧩 JSX          Syntaxe proche du HTML dans du JavaScript
  🎯 Props        Passage de données parent → enfant
  🔁 .map()       Pour afficher des listes
  🧠 Structure    Diviser le code en composants réutilisables

------------------------------------------------------------------------

## 🏁 Conclusion

Vous maîtrisez désormais : - Les bases de React et JSX - La
communication par props - L'affichage dynamique avec `.map()` -
L'outillage moderne **Vite** pour créer et déployer vos apps

➡️ **Prochaine étape :** Découvrir le *State* (`useState`) pour rendre
vos composants interactifs !

------------------------------------------------------------------------

© 2025 -- École Polytechnique Sousse\
*Cours MERN Semaine 6 -- Introduction à React et Vite*
