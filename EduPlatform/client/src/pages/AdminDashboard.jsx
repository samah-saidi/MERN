import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchInsights();
  }, [isAuthenticated, user, navigate]);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/ai/platform-insights');
      setInsights(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des insights');
    } finally {
      setLoading(false);
    }
  };

  const formatMarkdown = (text) => {
    if (!text) return '';
    return text
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('## ')) {
          return (
            <h3 key={index} style={{
              color: '#3498db',
              fontSize: '1.2rem',
              marginTop: '25px',
              marginBottom: '10px',
              borderLeft: '4px solid #3498db',
              paddingLeft: '15px'
            }}>
              {line.replace('## ', '')}
            </h3>
          );
        }
        if (line.startsWith('- ')) {
          return (
            <li key={index} style={{
              marginLeft: '20px',
              marginBottom: '8px',
              color: '#444'
            }}>
              {line.replace('- ', '')}
            </li>
          );
        }
        if (line.match(/^\d+\./)) {
          return (
            <li key={index} style={{
              marginLeft: '20px',
              marginBottom: '8px',
              color: '#444'
            }}>
              {line.replace(/^\d+\.\s*/, '')}
            </li>
          );
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        return (
          <p key={index} style={{ marginBottom: '10px', color: '#555' }}>
            {line}
          </p>
        );
      });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ fontSize: '2rem', marginBottom: '20px' }}>🤖</div>
        <p style={{ fontSize: '1.2rem', color: '#333' }}>Génération du rapport IA en cours...</p>
        <p style={{ color: '#666', marginTop: '10px' }}>Cela peut prendre quelques secondes</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '30px', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⚠️</div>
        <h2 style={{ color: '#e74c3c', marginBottom: '10px' }}>Erreur</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>{error}</p>
        <button
          onClick={fetchInsights}
          style={{
            padding: '10px 20px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#1a1a2e', margin: 0 }}>📊 Dashboard Admin</h1>
        <p style={{ color: '#666', fontSize: '1.1rem', marginTop: '10px' }}>
          Insights IA sur l'ensemble de la plateforme
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '20px',
        marginTop: '30px'
      }}>
        <div style={{
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '10px',
          textAlign: 'center',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #3498db'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📚</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1a1a2e' }}>{insights?.stats?.totalCourses || 0}</div>
          <div style={{ color: '#666' }}>Cours Actifs</div>
        </div>

        <div style={{
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '10px',
          textAlign: 'center',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #2ecc71'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>👥</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1a1a2e' }}>{insights?.stats?.totalUsers || 0}</div>
          <div style={{ color: '#666' }}>Utilisateurs</div>
        </div>

        <div style={{
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '10px',
          textAlign: 'center',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #f39c12'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⭐</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1a1a2e' }}>{insights?.stats?.totalReviews || 0}</div>
          <div style={{ color: '#666' }}>Commentaires</div>
        </div>

        <div style={{
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '10px',
          textAlign: 'center',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #9b59b6'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📊</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1a1a2e' }}>{insights?.stats?.averageRating || 'N/A'}</div>
          <div style={{ color: '#666' }}>Note Moyenne</div>
        </div>
      </div>

      {/* AI Report */}
      <div style={{
        marginTop: '30px',
        padding: '30px',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2px solid #f0f0f0',
          paddingBottom: '15px',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: 0, paddingLeft: '10px', borderLeft: '4px solid #3498db' }}> Raport d'Analyse IA</h2>
          {insights?.generatedAt && (
            <span style={{ color: '#888', fontSize: '0.9rem' }}>
              Généré le {new Date(insights.generatedAt).toLocaleString('fr-FR')}
            </span>
          )}
        </div>
        <div style={{ lineHeight: 1.8, color: '#333' }}>
          {formatMarkdown(insights?.insights)}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;