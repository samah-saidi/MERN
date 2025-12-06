import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function Profile() {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charger les cours inscrits
    api.get(`/users/${user.id}/courses`)
      .then(res => {
        setEnrolledCourses(res.data);
      })
      .catch(err => {
        console.error(err);
      });

    // Charger le profil
    api.get(`/users/${user.id}/profile`)
      .then(res => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [user.id]);

  return (
    <div style={{ padding: '30px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Mon Profil</h1>
        <Link
          to="/profile/edit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#9b59b6',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
            fontWeight: 'bold'
          }}
        >
          Éditer le profil
        </Link>
      </div>

      <div style={{
        marginTop: '20px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
      }}>
        <p><strong>Nom d'utilisateur:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        
        {profile && (
          <>
            <p style={{ marginTop: '15px' }}>
              <strong>Bio:</strong>
            </p>
            <p style={{
              marginTop: '5px',
              padding: '10px',
              backgroundColor: '#f8f9fa',
              borderRadius: '5px',
              color: '#555'
            }}>
              {profile.bio}
            </p>

            {profile.website && (
              <p style={{ marginTop: '15px' }}>
                <strong>Site Web:</strong>{' '}
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#9b59b6' }}
                >
                  {profile.website}
                </a>
              </p>
            )}
          </>
        )}
      </div>

      <h2 style={{ marginTop: '40px' }}>Mes Cours</h2>

      {loading ? (
        <div>Chargement...</div>
      ) : enrolledCourses.length === 0 ? (
        <p style={{ color: '#999' }}>Vous n'êtes inscrit à aucun cours</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '20px',
          marginTop: '20px'
        }}>
          {enrolledCourses.map(course => (
            <div key={course._id} style={{
              padding: '15px',
              backgroundColor: 'white',
              borderRadius: '5px',
              border: '1px solid #ddd'
            }}>
              <h4>{course.title}</h4>
              <p style={{ fontSize: '14px', color: '#666' }}>
                {course.instructor}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;