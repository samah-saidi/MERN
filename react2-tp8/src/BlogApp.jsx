import { useState, useEffect } from 'react';

function BlogApp() {
  // États principaux
  const [articles, setArticles] = useState(() => {
    const saved = localStorage.getItem('blog-articles');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 1,
        title: "Introduction à React",
        author: "Alice",
        content: "React est une bibliothèque JavaScript puissante pour créer des interfaces utilisateur modernes et réactives. Elle utilise un DOM virtuel pour optimiser les performances.",
        likes: 5,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        title: "Les Hooks en détail",
        author: "Bob",
        content: "Les hooks révolutionnent React en permettant d'utiliser l'état et d'autres fonctionnalités sans écrire de classe. useState, useEffect et useReducer sont essentiels.",
        likes: 3,
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];
  });

  // États de filtrage et tri
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAuthor, setFilterAuthor] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date' ou 'likes'

  // États du formulaire
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');

  // Sauvegarder dans localStorage
  useEffect(() => {
    localStorage.setItem('blog-articles', JSON.stringify(articles));
  }, [articles]);

  // Fonctions de gestion
  const addArticle = () => {
    if (!title.trim() || !author.trim() || !content.trim()) {
      alert('Tous les champs sont obligatoires');
      return;
    }

    const newArticle = {
      id: Date.now(),
      title,
      author,
      content,
      likes: 0,
      createdAt: new Date().toISOString()
    };

    setArticles([newArticle, ...articles]);
    setTitle('');
    setAuthor('');
    setContent('');
    setShowForm(false);
  };

  const handleLike = (id) => {
    setArticles(articles.map(article =>
      article.id === id
        ? { ...article, likes: article.likes + 1}
        : article
    ));
  };

  const handleDelete = (id) => {
    if (window.confirm('Supprimer cet article ?')) {
      setArticles(articles.filter(article => article.id !== id));
    }
  };

  // Filtrage et tri
  let filteredArticles = articles;

  // Recherche
  if (searchTerm) {
    filteredArticles = filteredArticles.filter(article =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Filtre par auteur
  if (filterAuthor) {
    filteredArticles = filteredArticles.filter(article =>
      article.author === filterAuthor
    );
  }

  // Tri
  filteredArticles = [...filteredArticles].sort((a, b) => {
    if (sortBy === 'likes') {
      return b.likes - a.likes;
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // Liste unique des auteurs
  const authors = [...new Set(articles.map(a => a.author))];

  return (
    <div style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '20px'
    }}>
      <h1 style={{ textAlign: 'center', color: '#2c3e50' }}>
        📝 Mon Blog React Interactif
      </h1>

      {/* Barre d'actions */}
      <div style={{
        backgroundColor: '#ecf0f1',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '20px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr auto',
          gap: '10px',
          marginBottom: '15px'
        }}>
          {/* Recherche */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Rechercher..."
            style={{
              padding: '10px',
              border: '1px solid #bdc3c7',
              borderRadius: '5px',
              fontSize: '14px'
            }}
          />

          {/* Filtre auteur */}
          <select
            value={filterAuthor}
            onChange={(e) => setFilterAuthor(e.target.value)}
            style={{
              padding: '10px',
              border: '1px solid #bdc3c7',
              borderRadius: '5px',
              fontSize: '14px'
            }}
          >
            <option value="">Tous les auteurs</option>
            {authors.map(author => (
              <option key={author} value={author}>
                {author}
              </option>
            ))}
          </select>

          {/* Tri */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '10px',
              border: '1px solid #bdc3c7',
              borderRadius: '5px',
              fontSize: '14px'
            }}
          >
            <option value="date">📅 Plus récents</option>
            <option value="likes">❤️ Plus likés</option>
          </select>

          {/* Bouton ajouter */}
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {showForm ? '❌ Annuler' : '➕ Nouvel Article'}
          </button>
        </div>

        <div style={{ fontSize: '14px', color: '#7f8c8d' }}>
          {filteredArticles.length} article(s) affiché(s) sur {articles.length}
        </div>
      </div>

      {/* Formulaire d'ajout */}
      {showForm && (
        <div style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '20px',
          border: '2px solid #27ae60'
        }}>
          <h3>✍️ Nouvel Article</h3>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre..."
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px'
            }}
          />
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Auteur..."
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px'
            }}
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Contenu..."
            rows="5"
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '14px',
              fontFamily: 'inherit'
            }}
          />
          <button
            onClick={addArticle}
            style={{
              padding: '12px 24px',
              backgroundColor: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            📤 Publier
          </button>
        </div>
      )}

      {/* Liste des articles */}
      <div>
        {filteredArticles.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#95a5a6', padding: '40px' }}>
            📭 Aucun article trouvé
          </p>
        ) : (
          filteredArticles.map(article => (
            <article
              key={article.id}
              style={{
                backgroundColor: 'white',
                padding: '20px',
                marginBottom: '20px',
                borderRadius: '10px',
                border: '1px solid #ddd'
              }}
            >
              <h2 style={{ color: '#2c3e50', marginTop: 0 }}>
                {article.title}
              </h2>
              <p style={{
                color: '#7f8c8d',
                fontSize: '14px',
                marginBottom: '15px'
              }}>
                👤 Par {article.author} | 📅 {
                  new Date(article.createdAt).toLocaleDateString('fr-FR')
                }
              </p>
              <p style={{ lineHeight: '1.6', color: '#34495e' }}>
                {article.content}
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginTop: '15px',
                paddingTop: '15px',
                borderTop: '1px solid #ecf0f1'
              }}>
                <button
                  onClick={() => handleLike(article.id)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  ❤️ {article.likes}
                </button>
                <button
                  onClick={() => handleDelete(article.id)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginLeft: 'auto'
                  }}
                >
                  🗑️ Supprimer
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

export default BlogApp;