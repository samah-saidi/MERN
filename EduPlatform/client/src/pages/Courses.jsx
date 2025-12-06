import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function Courses() {
  const [allCourses, setAllCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 10;

  useEffect(() => {
    api.get('/courses')
      .then(res => {
        setAllCourses(res.data);
        setFilteredCourses(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Filtrer les cours par titre
    const filtered = allCourses.filter(course =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCourses(filtered);
    setCurrentPage(1); // Réinitialiser à la première page
  }, [searchQuery, allCourses]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Chargement...</div>;
  }

  // Calculer les indices pour la pagination
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Liste des Cours</h1>

      {/* Barre de recherche */}
      <div style={{ marginTop: '20px', marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="🔍 Rechercher un cours par titre..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '15px 20px',
            fontSize: '16px',
            border: '2px solid #9b59b6',
            borderRadius: '10px',
            outline: 'none'
          }}
        />
        {searchQuery && (
          <p style={{ marginTop: '10px', color: '#666' }}>
            {filteredCourses.length} cours trouvé{filteredCourses.length > 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Liste des cours (paginée) */}
      {currentCourses.length === 0 ? (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          backgroundColor: '#f8f9fa',
          borderRadius: '10px'
        }}>
          <p style={{ color: '#999', fontSize: '18px' }}>
            Aucun cours trouvé pour "{searchQuery}"
          </p>
        </div>
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {currentCourses.map(course => (
              <div key={course._id} style={{
                padding: '20px',
                backgroundColor: 'white',
                borderRadius: '10px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}>
                <h3>{course.title}</h3>
                <p style={{ color: '#666', marginTop: '10px' }}>
                  {course.description.substring(0, 100)}...
                </p>
                <p style={{ marginTop: '10px', fontWeight: 'bold' }}>
                  Instructeur: {course.instructor}
                </p>
                <p style={{ color: '#9b59b6' }}>
                  {course.students.length} étudiants inscrits
                </p>

                <Link
                  to={`/courses/${course._id}`}
                  style={{
                    display: 'inline-block',
                    marginTop: '15px',
                    padding: '10px 20px',
                    backgroundColor: '#9b59b6',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '5px'
                  }}
                >
                  Voir détails
                </Link>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{
              marginTop: '40px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px'
            }}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '10px 20px',
                  backgroundColor: currentPage === 1 ? '#95a5a6' : '#9b59b6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold'
                }}
              >
                ← Précédent
              </button>

              <span style={{
                padding: '10px 20px',
                backgroundColor: '#ecf0f1',
                borderRadius: '5px',
                fontWeight: 'bold'
              }}>
                Page {currentPage} sur {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '10px 20px',
                  backgroundColor: currentPage === totalPages ? '#95a5a6' : '#9b59b6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Suivant →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Courses;