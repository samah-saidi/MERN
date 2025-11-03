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


// import Header from './components/Header';
// import Article from './components/Article';
// import Footer from './components/Footer';


// function App() {
//   const articles = [
//     {
//       id: 1,
//       title: "Introduction à React",
//       author: "Alice",
//       content:
//         "React est une bibliothèque JavaScript pour construire des interfaces utilisateur modernes et réactives.",
//     },
//     {
//       id: 2,
//       title: "Qu’est-ce que Vite ?",
//       author: "Bob",
//       content:
//         "Vite est un outil de build ultra-rapide qui améliore drastiquement l’expérience de développement.",
//     },
//     {
//       id: 3,
//       title: "Les Composants en React",
//       author: "Charlie",
//       content:
//         "Les composants sont les briques de base de React. Ils permettent de diviser l’interface en morceaux réutilisables.",
//     },
//     {
//       id: 4,
//       title: "Le JSX en Pratique",
//       author: "Alice",
//       content:
//         "JSX est une syntaxe qui ressemble à HTML mais qui est en fait du JavaScript transformé.",
//     },
//   ];

//   const currentYear = new Date().getFullYear();

//   return (
//     <div
//       style={{
//         minHeight: '100vh',
//         display: 'flex',
//         flexDirection: 'column',
//       }}
//     >
//       <div
//         style={{
//           maxWidth: '800px',
//           margin: '0 auto',
//           padding: '20px',
//           flex: 1,
//         }}
//       >
//         <Header
//           title="Mon Blog React"
//           subtitle="Apprendre React avec des exemples pratiques"
//         />

//         <div
//           style={{
//             marginBottom: '20px',
//             padding: '15px',
//             backgroundColor: '#f0f9ff',
//             borderRadius: '8px',
//           }}
//         >
//           <strong>{articles.length}</strong> articles disponibles
//         </div>

//         {articles.map((article) => (
//           <Article
//             key={article.id}
//             title={article.title}
//             author={article.author}
//             content={article.content}
//           />
//         ))}
//       </div>

//       <Footer author="École Polytechnique Sousse" year={currentYear} />
//     </div>
//   );
// }

// export default App;


// // exercice 1 
// import Header from './components/Header';
// import Article from './components/Article';
// import Footer from './components/Footer';
// import Badge from './components/Badge';

// function App() {
//   const articles = [
//     {
//       id: 1,
//       title: "Introduction à React",
//       author: "Alice",
//       content: "React est une bibliothèque JavaScript pour construire des interfaces utilisateur modernes et réactives.",
//       isNew: true,
//       isPopular: false
//     },
//     {
//       id: 2,
//       title: "Qu'est-ce que Vite ?",
//       author: "Bob",
//       content: "Vite est un outil de build ultra-rapide qui améliore drastiquement l'expérience de développement.",
//       isNew: false,
//       isPopular: true
//     },
//     {
//       id: 3,
//       title: "Les Composants en React",
//       author: "Charlie",
//       content: "Les composants sont les briques de base de React. Ils permettent de diviser l'interface en morceaux réutilisables.",
//       isNew: true,
//       isPopular: true
//     },
//     {
//       id: 4,
//       title: "Le JSX en Pratique",
//       author: "Alice",
//       content: "JSX est une syntaxe qui ressemble à HTML mais qui est en fait du JavaScript transformé.",
//       isNew: false,
//       isPopular: false
//     }
//   ];

//   const currentYear = new Date().getFullYear();

//   return (
//     <div style={{
//       minHeight: '100vh',
//       display: 'flex',
//       flexDirection: 'column'
//     }}>
//       <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', flex: 1 }}>
//         <Header
//           title="Mon Blog React"
//           subtitle="Apprendre React avec des exemples pratiques"
//         />

//         <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
//           <strong>{articles.length}</strong> articles disponibles
//         </div>

//         {articles.map((article) => (
//           <article key={article.id} style={{
//             border: '1px solid #ddd',
//             padding: '20px',
//             marginBottom: '20px',
//             borderRadius: '8px'
//           }}>
//             <h2>
//               {article.title}
//               {article.isNew && <Badge text="Nouveau" color="green" />}
//               {article.isPopular && <Badge text="Populaire" color="red" />}
//             </h2>
//             <p style={{ color: '#666', fontSize: '14px' }}>
//               Par {article.author}
//             </p>
//             <p>{article.content}</p>
//           </article>
//         ))}
//       </div>

//       <Footer
//         author="Ecole Polytechnique Sousse"
//         year={currentYear}
//       />
//     </div>
//   );
// }

// export default App;

// // exercice 2 ProductCard

// import Header from './components/Header';
// import Footer from './components/Footer';
// import ProductCard from './components/ProductCard';

// function App() {
//   const products = [
//     { id: 1, name: "Laptop HP", price: 1200, category: "Électronique" },
//     { id: 2, name: "Souris Logitech", price: 25, category: "Accessoires" },
//     { id: 3, name: "Clavier Mécanique", price: 85, category: "Accessoires" },
//     { id: 4, name: "Écran 27 pouces", price: 450, category: "Électronique" },
//     { id: 5, name: "Casque Audio", price: 120, category: "Audio" }
//   ];

//   const currentYear = new Date().getFullYear();

//   // Calculer le prix total
//   const totalPrice = products.reduce((sum, product) => sum + product.price, 0);

//   return (
//     <div style={{
//       minHeight: '100vh',
//       display: 'flex',
//       flexDirection: 'column',
//       backgroundColor: '#f9fafb'
//     }}>
//       <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', flex: 1 }}>
//         <Header
//           title="🛒 Ma Boutique en Ligne"
//           subtitle="Découvrez nos meilleurs produits"
//         />

//         <div style={{ 
//           marginBottom: '25px', 
//           padding: '20px', 
//           backgroundColor: '#ffffff', 
//           borderRadius: '10px',
//           boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center'
//         }}>
//           <div>
//             <strong style={{ fontSize: '1.2rem' }}>{products.length}</strong> produits disponibles
//           </div>
//           <div style={{ fontSize: '1.1rem', color: '#10b981', fontWeight: 'bold' }}>
//             Total: {totalPrice} DT
//           </div>
//         </div>

//         <div style={{
//           display: 'grid',
//           gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
//           gap: '20px'
//         }}>
//           {products.map((product) => (
//             <ProductCard
//               key={product.id}
//               name={product.name}
//               price={product.price}
//               category={product.category}
//             />
//           ))}
//         </div>
//       </div>

//       <Footer
//         author="Ecole Polytechnique Sousse"
//         year={currentYear}
//       />
//     </div>
//   );
// }

// export default App;

//exercice 3 commentaires

import Header from './components/Header';
import Footer from './components/Footer';
import CommentList from './components/CommentList';

function App() {
  const comments = [
    {
      id: 1,
      author: "Alice Dupont",
      text: "Excellent article ! J'ai enfin compris comment fonctionnent les props en React. Les exemples sont très clairs et bien expliqués. Merci beaucoup !",
      likes: 24
    },
    {
      id: 2,
      author: "Bob Martin",
      text: "Super tutoriel ! Par contre, j'ai une question : est-ce qu'on peut passer des fonctions en props aussi ?",
      likes: 15
    },
    {
      id: 3,
      author: "Charlie Leroy",
      text: "Merci pour ce cours ! Vite est vraiment impressionnant comparé à Create React App. Le temps de démarrage est incroyable 🚀",
      likes: 31
    },
    {
      id: 4,
      author: "Diana Prince",
      text: "J'adore la façon dont vous expliquez les concepts avec des analogies. Ça rend React beaucoup plus accessible pour les débutants.",
      likes: 19
    }
  ];

  const currentYear = new Date().getFullYear();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f3f4f6'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', flex: 1 }}>
        <Header
          title="Espace Commentaires"
          subtitle="Partagez vos avis sur nos articles React"
        />

        <CommentList 
          comments={comments}
          title="Commentaires de l'article"
        />
      </div>

      <Footer
        author="Ecole Polytechnique Sousse"
        year={currentYear}
      />
    </div>
  );
}

export default App;