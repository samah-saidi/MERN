import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function PersonalizedCourses() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchSuggestions();
  }, [isAuthenticated]);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get(`/ai/personalized-courses/${user.id}`);
      setSuggestions(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des suggestions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ fontSize: '2rem', marginBottom: '20px' }}>🤖</div>
        <p style={{ fontSize: '1.2rem', color: '#333' }}>Analyse de votre profil en cours...</p>
        <p style={{ color: '#666', marginTop: '10px' }}>Notre IA prépare des recommandations personnalisées</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '30px', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⚠️</div>
        <p style={{ color: '#e74c3c', fontSize: '1.1rem', marginBottom: '20px' }}>{error}</p>
        <button 
            onClick={fetchSuggestions} 
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
    <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#1a1a2e', margin: 0 }}>🎯 Cours Recommandés</h1>
        <p style={{ color: '#666', fontSize: '1.1rem', marginTop: '10px' }}>
          Suggestions pour {suggestions?.userName || user?.username}
        </p>
      </header>

      {suggestions?.recommendations?.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <span style={{ fontSize: '4rem' }}>🎉</span>
          <h2>Félicitations !</h2>
          <p>Vous êtes inscrit à tous les cours disponibles.</p>
          <Link to="/courses" style={{
            display: 'inline-block',
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#3498db',
            color: 'white',
            borderRadius: '5px',
            textDecoration: 'none'
          }}>Voir mes cours</Link>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', marginBottom: '30px' }}>
            {suggestions?.recommendations?.map((rec, index) => (
              <div key={index} style={{
                backgroundColor: 'white',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                position: 'relative',
                padding: '25px'
              }}>
                <div style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    backgroundColor: '#2ecc71',
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    textAlign: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                }}>
                  {rec.matchScore}% Match
                </div>
                
                <div>
                  <h3 style={{ fontSize: '1.4rem', color: '#1a1a2e', marginBottom: '8px', paddingRight: '80px' }}>{rec.courseTitle}</h3>
                  <p style={{ color: '#3498db', marginBottom: '15px', fontWeight: '500' }}>par {rec.instructor}</p>
                  <p style={{ color: '#555', lineHeight: 1.6, marginBottom: '20px' }}>{rec.description?.substring(0, 120)}...</p>
                  
                  <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '5px', marginBottom: '15px' }}>
                    <h4 style={{ color: '#1a1a2e', fontSize: '1rem', marginBottom: '8px', marginTop: 0 }}>💡 Pourquoi ce cours ?</h4>
                    <p style={{ color: '#555', margin: 0, lineHeight: 1.5 }}>{rec.reason}</p>
                  </div>

                  {rec.benefits && (
                    <div style={{ marginBottom: '20px' }}>
                      <h4 style={{ color: '#1a1a2e', fontSize: '1rem', marginBottom: '10px' }}>✨ Bénéfices</h4>
                      <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        {rec.benefits.map((benefit, i) => (
                          <li key={i} style={{ color: '#555', marginBottom: '5px' }}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Link to={`/courses/${rec.courseId}`} style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '10px',
                    backgroundColor: '#3498db',
                    color: 'white',
                    borderRadius: '5px',
                    textDecoration: 'none',
                    fontWeight: '600'
                  }}>
                    Voir le cours →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {suggestions?.generalAdvice && (
            <div style={{
                backgroundColor: 'white',
                borderRadius: '10px',
                padding: '25px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                marginBottom: '30px',
                borderLeft: '4px solid #3498db'
            }}>
              <h3 style={{ color: '#1a1a2e', marginBottom: '15px', marginTop: 0 }}>🎓 Conseil personnalisé</h3>
              <p style={{ color: '#555', lineHeight: 1.7, margin: 0 }}>{suggestions.generalAdvice}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default PersonalizedCourses;