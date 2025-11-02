// // App.jsx Avec Composant Article
// import Article from './components/Article';

// function App() {
//   return (
//     <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
//       <h1>Mon Blog React</h1>

//       <Article
//         title="Introduction à React"
//         author="Alice"
//         content="React est une bibliothèque JavaScript pour construire des interfaces ..."
//       />

//       <Article
//         title="Qu’est-ce que Vite ?"
//         author="Bob"
//         content="Vite est un outil de build ultra-rapide pour les projets frontend ..."
//       />
//     </div>
//   );
// }

// export default App;


// // App.jsx Avec liste d'articles
// import Article from './components/Article';

// function App() {
//   // Données d’articles
//   const articles = [
//     {
//       id: 1,
//       title: "Introduction à React",
//       author: "Alice",
//       content: "React est une bibliothèque JavaScript ..."
//     },
//     {
//       id: 2,
//       title: "Qu’est-ce que Vite ?",
//       author: "Bob",
//       content: "Vite est un outil de build ultra-rapide ..."
//     },
//     {
//       id: 3,
//       title: "Les Composants en React",
//       author: "Charlie",
//       content: "Les composants sont les briques de base ..."
//     }
//   ];

//   return (
//     <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
//       <h1>Mon Blog React</h1>
//       <p style={{ color: '#666' }}>
//         {articles.length} articles disponibles
//       </p>

//       {articles.map((article) => (
//         <Article
//           key={article.id}
//           title={article.title}
//           author={article.author}
//           content={article.content}
//         />
//       ))}
//     </div>
//   );
// }

// export default App;


import Header from './components/Header';
import Article from './components/Article';
import Footer from './components/Footer';


function App() {
  const articles = [
    {
      id: 1,
      title: "Introduction à React",
      author: "Alice",
      content:
        "React est une bibliothèque JavaScript pour construire des interfaces utilisateur modernes et réactives.",
    },
    {
      id: 2,
      title: "Qu’est-ce que Vite ?",
      author: "Bob",
      content:
        "Vite est un outil de build ultra-rapide qui améliore drastiquement l’expérience de développement.",
    },
    {
      id: 3,
      title: "Les Composants en React",
      author: "Charlie",
      content:
        "Les composants sont les briques de base de React. Ils permettent de diviser l’interface en morceaux réutilisables.",
    },
    {
      id: 4,
      title: "Le JSX en Pratique",
      author: "Alice",
      content:
        "JSX est une syntaxe qui ressemble à HTML mais qui est en fait du JavaScript transformé.",
    },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '20px',
          flex: 1,
        }}
      >
        <Header
          title="Mon Blog React"
          subtitle="Apprendre React avec des exemples pratiques"
        />

        <div
          style={{
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: '#f0f9ff',
            borderRadius: '8px',
          }}
        >
          <strong>{articles.length}</strong> articles disponibles
        </div>

        {articles.map((article) => (
          <Article
            key={article.id}
            title={article.title}
            author={article.author}
            content={article.content}
          />
        ))}
      </div>

      <Footer author="École Polytechnique Sousse" year={currentYear} />
    </div>
  );
}

export default App;
