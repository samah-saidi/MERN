import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function MyReviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/users/${user.id}/reviews`)
      .then(res => {
        setReviews(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [user.id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        Chargement...
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>Mes Reviews</h1>
      <p style={{ color: '#666', marginTop: '10px' }}>
        Toutes les critiques que vous avez publiées
      </p>

      {reviews.length === 0 ? (
        <div style={{
          marginTop: '40px',
          padding: '40px',
          backgroundColor: '#f8f9fa',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#999', fontSize: '18px' }}>
            Vous n'avez pas encore publié de critique
          </p>
          <Link
            to="/courses"
            style={{
              display: 'inline-block',
              marginTop: '20px',
              padding: '12px 24px',
              backgroundColor: '#9b59b6',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
              fontWeight: 'bold'
            }}
          >
            Parcourir les cours
          </Link>
        </div>
      ) : (
        <div style={{ marginTop: '30px' }}>
          {reviews.map(review => (
            <div
              key={review._id}
              style={{
                marginBottom: '20px',
                padding: '20px',
                backgroundColor: 'white',
                borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '1px solid #e0e0e0'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '15px'
              }}>
                <div style={{ flex: 1 }}>
                  <Link
                    to={`/courses/${review.course._id}`}
                    style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: '#2c3e50',
                      textDecoration: 'none'
                    }}
                  >
                    {review.course.title}
                  </Link>
                  <p style={{ color: '#666', marginTop: '5px', fontSize: '14px' }}>
                    Instructeur: {review.course.instructor}
                  </p>
                </div>
                <div style={{
                  color: '#f39c12',
                  fontSize: '24px',
                  marginLeft: '20px'
                }}>
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </div>
              </div>

              {review.comment && (
                <p style={{
                  marginTop: '15px',
                  color: '#555',
                  lineHeight: '1.6',
                  fontSize: '16px',
                  padding: '15px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '5px',
                  borderLeft: '3px solid #9b59b6'
                }}>
                  {review.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyReviews;