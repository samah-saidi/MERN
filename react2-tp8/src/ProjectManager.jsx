import { useReducer, useState, useEffect } from 'react';

// État initial
const initialState = {
  projects: [],
  statusFilter: 'all', // 'all', 'todo', 'doing', 'done'
  sortBy: 'deadline' // 'deadline', 'status', 'created'
};

// Reducer pour gérer l'état complexe
function projectReducer(state, action) {
  switch (action.type) {
    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [
          {
            id: Date.now(),
            ...action.payload,
            createdAt: new Date().toISOString(),
            timerMinutes: 25,
            timerSeconds: 0,
            timerActive: false
          },
          ...state.projects
        ]
      };

    case 'UPDATE_STATUS':
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.id
            ? { ...project, status: action.payload.status }
            : project
        )
      };

    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(project => project.id !== action.payload)
      };

    case 'SET_STATUS_FILTER':
      return {
        ...state,
        statusFilter: action.payload
      };

    case 'SET_SORT':
      return {
        ...state,
        sortBy: action.payload
      };

    case 'UPDATE_TIMER':
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.id
            ? {
                ...project,
                timerMinutes: action.payload.minutes,
                timerSeconds: action.payload.seconds,
                timerActive: action.payload.active
              }
            : project
        )
      };

    case 'LOAD_PROJECTS':
      return {
        ...state,
        projects: action.payload
      };

    default:
      return state;
  }
}

function ProjectManager() {
  const [state, dispatch] = useReducer(projectReducer, initialState);
  
  // États pour le formulaire
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  
  // État pour la recherche
  const [searchTerm, setSearchTerm] = useState('');

  // Charger les projets depuis localStorage
  useEffect(() => {
    const saved = localStorage.getItem('projects');
    if (saved) {
      dispatch({
        type: 'LOAD_PROJECTS',
        payload: JSON.parse(saved)
      });
    }
  }, []);

  // Sauvegarder les projets
  useEffect(() => {
    if (state.projects.length > 0) {
      localStorage.setItem('projects', JSON.stringify(state.projects));
    }
  }, [state.projects]);

  // Timers pour chaque projet
  useEffect(() => {
    const intervals = state.projects
      .filter(p => p.timerActive)
      .map(project => {
        return setInterval(() => {
          const { timerMinutes, timerSeconds } = project;
          
          if (timerSeconds === 0) {
            if (timerMinutes === 0) {
              alert(`⏰ Timer terminé pour "${project.title}" !`);
              dispatch({
                type: 'UPDATE_TIMER',
                payload: {
                  id: project.id,
                  minutes: 25,
                  seconds: 0,
                  active: false
                }
              });
            } else {
              dispatch({
                type: 'UPDATE_TIMER',
                payload: {
                  id: project.id,
                  minutes: timerMinutes - 1,
                  seconds: 59,
                  active: true
                }
              });
            }
          } else {
            dispatch({
              type: 'UPDATE_TIMER',
              payload: {
                id: project.id,
                minutes: timerMinutes,
                seconds: timerSeconds - 1,
                active: true
              }
            });
          }
        }, 1000);
      });

    return () => intervals.forEach(clearInterval);
  }, [state.projects]);

  // Ajouter un projet
  const addProject = () => {
    if (!title.trim() || !description.trim() || !deadline) {
      alert('Tous les champs sont obligatoires');
      return;
    }

    dispatch({
      type: 'ADD_PROJECT',
      payload: {
        title,
        description,
        deadline,
        status: 'todo'
      }
    });

    setTitle('');
    setDescription('');
    setDeadline('');
    setShowForm(false);
  };

  // Toggle timer
  const toggleTimer = (id) => {
    const project = state.projects.find(p => p.id === id);
    dispatch({
      type: 'UPDATE_TIMER',
      payload: {
        id,
        minutes: project.timerMinutes,
        seconds: project.timerSeconds,
        active: !project.timerActive
      }
    });
  };

  // Reset timer
  const resetTimer = (id) => {
    dispatch({
      type: 'UPDATE_TIMER',
      payload: {
        id,
        minutes: 25,
        seconds: 0,
        active: false
      }
    });
  };

  // Filtrage et tri
  let filteredProjects = state.projects;

  // Recherche
  if (searchTerm) {
    filteredProjects = filteredProjects.filter(project =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Filtre par statut
  if (state.statusFilter !== 'all') {
    filteredProjects = filteredProjects.filter(
      project => project.status === state.statusFilter
    );
  }

  // Tri
  filteredProjects = [...filteredProjects].sort((a, b) => {
    if (state.sortBy === 'deadline') {
      return new Date(a.deadline) - new Date(b.deadline);
    } else if (state.sortBy === 'status') {
      const statusOrder = { todo: 1, doing: 2, done: 3 };
      return statusOrder[a.status] - statusOrder[b.status];
    } else {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  // Statistiques
  const stats = {
    total: state.projects.length,
    todo: state.projects.filter(p => p.status === 'todo').length,
    doing: state.projects.filter(p => p.status === 'doing').length,
    done: state.projects.filter(p => p.status === 'done').length
  };

  const statusColors = {
    todo: '#e74c3c',
    doing: '#f39c12',
    done: '#27ae60'
  };

  const statusLabels = {
    todo: '📋 À faire',
    doing: '🚀 En cours',
    done: '✅ Terminé'
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ textAlign: 'center', color: '#2c3e50' }}>
        🎯 Gestionnaire de Projets
      </h1>

      {/* Statistiques */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '15px',
        marginBottom: '20px'
      }}>
        {[
          { label: 'Total', value: stats.total, color: '#3498db' },
          { label: 'À faire', value: stats.todo, color: '#e74c3c' },
          { label: 'En cours', value: stats.doing, color: '#f39c12' },
          { label: 'Terminé', value: stats.done, color: '#27ae60' }
        ].map((stat, i) => (
          <div key={i} style={{
            backgroundColor: stat.color,
            color: 'white',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '14px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Barre de contrôles */}
      <div style={{
        backgroundColor: '#ecf0f1',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '20px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr auto',
          gap: '10px',
          marginBottom: '10px'
        }}>
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

          <select
            value={state.statusFilter}
            onChange={(e) => dispatch({
              type: 'SET_STATUS_FILTER',
              payload: e.target.value
            })}
            style={{
              padding: '10px',
              border: '1px solid #bdc3c7',
              borderRadius: '5px',
              fontSize: '14px'
            }}
          >
            <option value="all">Tous les statuts</option>
            <option value="todo">À faire</option>
            <option value="doing">En cours</option>
            <option value="done">Terminé</option>
          </select>

          <select
            value={state.sortBy}
            onChange={(e) => dispatch({
              type: 'SET_SORT',
              payload: e.target.value
            })}
            style={{
              padding: '10px',
              border: '1px solid #bdc3c7',
              borderRadius: '5px',
              fontSize: '14px'
            }}
          >
            <option value="deadline">Par deadline</option>
            <option value="status">Par statut</option>
            <option value="created">Plus récents</option>
          </select>

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
            {showForm ? '❌' : '➕ Nouveau'}
          </button>
        </div>
        <div style={{ fontSize: '14px', color: '#7f8c8d' }}>
          {filteredProjects.length} projet(s) affiché(s)
        </div>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '20px',
          border: '2px solid #27ae60'
        }}>
          <h3>✨ Nouveau Projet</h3>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre du projet..."
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description..."
            rows="3"
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
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '14px'
            }}
          />
          <button
            onClick={addProject}
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
            ➕ Créer le projet
          </button>
        </div>
      )}

      {/* Liste des projets */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '20px'
      }}>
        {filteredProjects.length === 0 ? (
          <p style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            color: '#95a5a6',
            padding: '40px'
          }}>
            📭 Aucun projet trouvé
          </p>
        ) : (
          filteredProjects.map(project => (
            <div
              key={project.id}
              style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '10px',
                border: '1px solid #ddd',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <h3 style={{ color: '#2c3e50', marginTop: 0 }}>
                {project.title}
              </h3>
              <p style={{ color: '#7f8c8d', fontSize: '14px', flex: 1 }}>
                {project.description}
              </p>
              
              {/* Deadline */}
              <div style={{
                padding: '8px',
                backgroundColor: '#ecf0f1',
                borderRadius: '5px',
                marginBottom: '10px',
                fontSize: '13px'
              }}>
                📅 Deadline: {new Date(project.deadline).toLocaleDateString('fr-FR')}
              </div>

              {/* Statut */}
              <select
                value={project.status}
                onChange={(e) => dispatch({
                  type: 'UPDATE_STATUS',
                  payload: { id: project.id, status: e.target.value }
                })}
                style={{
                  padding: '8px',
                  backgroundColor: statusColors[project.status],
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  marginBottom: '10px',
                  fontWeight: 'bold'
                }}
              >
                <option value="todo">📋 À faire</option>
                <option value="doing">🚀 En cours</option>
                <option value="done">✅ Terminé</option>
              </select>

              {/* Timer Pomodoro */}
              <div style={{
                backgroundColor: '#34495e',
                color: 'white',
                padding: '15px',
                borderRadius: '5px',
                marginBottom: '10px',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  marginBottom: '10px',
                  color: project.timerActive ? '#e74c3c' : 'white'
                }}>
                  {String(project.timerMinutes).padStart(2, '0')}:
                  {String(project.timerSeconds).padStart(2, '0')}
                </div>
                <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                  <button
                    onClick={() => toggleTimer(project.id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: project.timerActive ? '#f39c12' : '#27ae60',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    {project.timerActive ? '⏸️' : '▶️'}
                  </button>
                  <button
                    onClick={() => resetTimer(project.id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#95a5a6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    🔄
                  </button>
                </div>
              </div>

              {/* Supprimer */}
              <button
                onClick={() => {
                  if (window.confirm('Supprimer ce projet ?')) {
                    dispatch({ type: 'DELETE_PROJECT', payload: project.id });
                  }
                }}
                style={{
                  padding: '8px',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                🗑️ Supprimer
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProjectManager;