import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav style={{
      backgroundColor: '#5f2a74ff',
      padding: '15px 30px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          Accueil
        </Link>
        <Link to="/courses" style={{ color: 'white', textDecoration: 'none' }}>
          Cours
        </Link>
                <Link to="/chatbot" style={{ color: 'white', textDecoration: 'none' }}>
          💬 Chatbot
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        {isAuthenticated ? (
          <>
            <Link to="/personalized-courses" style={{ color: 'white', textDecoration: 'none' }}>
              🎯 Cours Recommandés
            </Link>
            {user.role === 'admin' && (
              <Link to="/admin-dashboard" style={{ color: 'white', textDecoration: 'none' }}>
                📊 Dashboard
              </Link>
            )}
            <Link to="/profile" style={{ color: 'white', textDecoration: 'none' }}>
              Profil ({user.username})
            </Link>
            <Link to="/my-reviews" style={{ color: 'white', textDecoration: 'none' }}>
              Mes Reviews
            </Link>
            <button
              onClick={logout}
              style={{
                padding: '8px 16px',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>
              Connexion
            </Link>
            <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>
              Inscription
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;