import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div style={{
      padding: '50px',
      maxWidth: '1200px',
      margin: '0 auto',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '80vh'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>
        Bienvenue sur la plateforme de cours
      </h1>

      {isAuthenticated ? (
        <div>
          <p style={{ fontSize: '1.5rem', color: '#666', marginBottom: '30px' }}>
            Bonjour {user.username} ! Explorez nos cours disponibles.
          </p>
          <Link
            to="/courses"
            style={{
              display: 'inline-block',
              padding: '15px 30px',
              backgroundColor: '#9b59b6',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
              fontSize: '18px'
            }}
          >
            Voir les cours
          </Link>
        </div>
      ) : (
        <div>
          <p style={{ fontSize: '1.5rem', color: '#666', marginBottom: '30px' }}>
            Connectez-vous pour accéder à nos cours
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <Link
              to="/login"
              style={{
                display: 'inline-block',
                padding: '15px 30px',
                backgroundColor: '#9b59b6',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px',
                fontSize: '18px'
              }}
            >
              Se connecter
            </Link>
            <Link
              to="/register"
              style={{
                display: 'inline-block',
                padding: '15px 30px',
                backgroundColor: '#27ae60',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px',
                fontSize: '18px'
              }}
            >
              S'inscrire
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;