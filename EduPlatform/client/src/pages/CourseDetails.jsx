import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Swal from 'sweetalert2';

function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCourseData();
  }, [id]);

  const loadCourseData = () => {
    // Charger le cours
    api.get(`/courses/${id}`)
      .then(res => setCourse(res.data))
      .catch(err => console.error(err));

    // Charger les reviews
    api.get(`/courses/${id}/reviews`)
      .then(res => {
        setReviews(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await api.post(`/courses/${id}/enroll`);
      Swal.fire({
        icon: 'success',
        title: 'Succès!',
        text: 'Inscription au cours réussie!',
        confirmButtonColor: '#27ae60'
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Erreur lors de l\'inscription au cours',
        confirmButtonColor: '#e74c3c'
      });
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setSubmitting(true);

    try {
      const response = await api.post(`/courses/${id}/reviews`, reviewForm);
      
      Swal.fire({
        icon: 'success',
        title: 'Avis publié!',
        text: 'Votre avis a été publié avec succès.',
        confirmButtonColor: '#27ae60'
      });

      setReviewForm({ rating: 5, comment: '' });
      setReviews([response.data, ...reviews]);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Erreur lors de la publication de l\'avis';
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: errorMsg,
        confirmButtonColor: '#e74c3c'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !course) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Chargement...</div>;
  }

  return (
    <div style={{ padding: '30px', maxWidth: '900px', margin: '0 auto' }}>
      <h1>{course.title}</h1>
      <p style={{ fontSize: '18px', color: '#666', marginTop: '15px' }}>
        {course.description}
      </p>

      <div style={{
        marginTop: '20px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '10px'
      }}>
        <p><strong>Instructeur:</strong> {course.instructor}</p>
        <p><strong>Étudiants inscrits:</strong> {course.students.length}</p>
      </div>

      <button
        onClick={handleEnroll}
        style={{
          marginTop: '20px',
          padding: '15px 30px',
          backgroundColor: '#27ae60',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        S'inscrire au cours
      </button>

      <h2 style={{ marginTop: '40px' }}>Avis des étudiants</h2>

      {/* Formulaire d'ajout de review */}
      {isAuthenticated && (
        <div style={{
          marginTop: '20px',
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '10px',
          border: '2px solid #9b59b6'
        }}>
          <h3 style={{ marginBottom: '15px' }}>Laisser un avis</h3>
          <form onSubmit={handleReviewSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label
                htmlFor="rating"
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 'bold'
                }}
              >
                Note: {reviewForm.rating} / 5
              </label>
              <input
                id="rating"
                type="range"
                min="1"
                max="5"
                value={reviewForm.rating}
                onChange={(e) => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}
                style={{ width: '100%' }}
              />
              <div style={{ color: '#f39c12', fontSize: '24px', marginTop: '5px' }}>
                {'★'.repeat(reviewForm.rating)}{'☆'.repeat(5 - reviewForm.rating)}
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label
                htmlFor="comment"
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: 'bold'
                }}
              >
                Commentaire
              </label>
              <textarea
                id="comment"
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                rows="4"
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '14px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontFamily: 'inherit'
                }}
                placeholder="Partagez votre expérience avec ce cours..."
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: '12px 24px',
                backgroundColor: submitting ? '#95a5a6' : '#9b59b6',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: submitting ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              {submitting ? 'Publication...' : 'Publier l\'avis'}
            </button>
          </form>
        </div>
      )}

      {/* Liste des reviews */}
      <div style={{ marginTop: '20px' }}>
        {reviews.length === 0 ? (
          <p style={{ color: '#999' }}>Aucun avis pour le moment</p>
        ) : (
          reviews.map(review => (
            <div key={review._id} style={{
              padding: '15px',
              marginTop: '15px',
              backgroundColor: 'white',
              borderRadius: '5px',
              border: '1px solid #ddd'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: '#f39c12', fontSize: '20px' }}>
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </div>
                {review.user && (
                  <span style={{ fontSize: '14px', color: '#666' }}>
                    par {review.user.username}
                  </span>
                )}
              </div>
              {review.comment && (
                <p style={{ marginTop: '10px' }}>{review.comment}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CourseDetails;