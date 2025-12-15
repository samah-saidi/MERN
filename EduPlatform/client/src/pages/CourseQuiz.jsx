import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function CourseQuiz() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [difficulty, setDifficulty] = useState('moyen');
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchCourse();
  }, [id, isAuthenticated]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/courses/${id}`);
      setCourse(res.data);
    } catch {
      setError('Cours non trouvé');
    } finally {
      setLoading(false);
    }
  };

  const generateQuiz = async () => {
    try {
      setGenerating(true);
      setError('');
      setQuiz(null);
      setShowResults(false);
      setSelectedAnswers({});
      setCurrentQuestion(0);
      const res = await api.post(`/ai/generate-quiz/${id}`, { numberOfQuestions, difficulty });
      setQuiz(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la génération');
    } finally {
      setGenerating(false);
    }
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const calculateScore = () => {
    if (!quiz) return { correct: 0, total: 0, percentage: 0 };
    let correct = 0;
    quiz.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) correct++;
    });
    return { correct, total: quiz.questions.length, percentage: Math.round((correct / quiz.questions.length) * 100) };
  };

  if (loading) return <div style={{textAlign:'center',padding:'50px'}}>Chargement...</div>;

  return (
    <div style={{maxWidth:'800px',margin:'0 auto',padding:'30px'}}>
      <Link to={`/courses/${id}`} style={{color:'#3498db',textDecoration:'none'}}>← Retour au cours</Link>
      <div style={{textAlign:'center',margin:'20px 0'}}>
        <h1>🎯 Quiz Interactif</h1>
        {course && <p style={{color:'#666'}}>{course.title}</p>}
      </div>

      {!quiz ? (
        <div style={{backgroundColor:'white',borderRadius:'10px',padding:'40px',boxShadow:'0 2px 5px rgba(0,0,0,0.1)',textAlign:'center'}}>
          <h2>⚙️ Configuration du Quiz</h2>
          <div style={{margin:'25px 0'}}>
            <label style={{display:'block',marginBottom:'10px',fontWeight:'bold'}}>Nombre de questions:</label>
            <div style={{display:'flex',justifyContent:'center',gap:'12px'}}>
              {[3,5,10].map(n => (
                <button key={n} onClick={() => setNumberOfQuestions(n)}
                  style={{padding:'10px 20px',border:`1px solid ${numberOfQuestions===n?'#3498db':'#ccc'}`,
                  borderRadius:'5px',backgroundColor:numberOfQuestions===n?'#3498db':'white',
                  color:numberOfQuestions===n?'white':'#333',cursor:'pointer'}}>{n}</button>
              ))}
            </div>
          </div>
          <div style={{margin:'25px 0'}}>
            <label style={{display:'block',marginBottom:'10px',fontWeight:'bold'}}>Difficulté:</label>
            <div style={{display:'flex',justifyContent:'center',gap:'12px'}}>
              {['facile','moyen','difficile'].map(d => (
                <button key={d} onClick={() => setDifficulty(d)}
                  style={{padding:'10px 20px',border:`1px solid ${difficulty===d?'#3498db':'#ccc'}`,
                  borderRadius:'5px',backgroundColor:difficulty===d?'#3498db':'white',
                  color:difficulty===d?'white':'#333',cursor:'pointer'}}>
                  {d==='facile'?'🟢':d==='moyen'?'🟡':'🔴'} {d}
                </button>
              ))}
            </div>
          </div>
          <button onClick={generateQuiz} disabled={generating}
            style={{marginTop:'20px',padding:'15px 30px',backgroundColor:generating?'#95a5a6':'#3498db',
            color:'white',border:'none',borderRadius:'5px',fontSize:'1.1rem',fontWeight:'600',cursor:generating?'not-allowed':'pointer'}}>
            {generating ? 'Génération...' : '✨ Générer le Quiz'}
          </button>
          {error && <p style={{color:'#e74c3c',marginTop:'15px'}}>{error}</p>}
        </div>
      ) : showResults ? (
        <div style={{backgroundColor:'white',borderRadius:'10px',padding:'40px',boxShadow:'0 2px 5px rgba(0,0,0,0.1)',textAlign:'center'}}>
          {(() => {
            const score = calculateScore();
            const color = score.percentage >= 70 ? '#2ecc71' : score.percentage >= 50 ? '#f39c12' : '#e74c3c';
            return (
              <>
                <div style={{width:'150px',height:'150px',border:`6px solid ${color}`,borderRadius:'50%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',margin:'0 auto 20px'}}>
                  <span style={{fontSize:'2.5rem',fontWeight:'bold',color}}>{score.percentage}%</span>
                  <span style={{color:'#888'}}>{score.correct}/{score.total}</span>
                </div>
                <h2 style={{color}}>{score.percentage >= 70 ? '🎉 Excellent !' : score.percentage >= 50 ? '💪 Pas mal !' : '📚 Continuez !'}</h2>
                <div style={{textAlign:'left',marginTop:'30px'}}>
                  {quiz.questions.map((q, i) => (
                    <div key={q.id} style={{padding:'15px',backgroundColor:'#f8f9fa',borderRadius:'5px',marginBottom:'10px',borderLeft:`4px solid ${selectedAnswers[q.id]===q.correctAnswer?'#2ecc71':'#e74c3c'}`}}>
                      <p><strong>Q{i+1}:</strong> {q.question}</p>
                      <p>Votre réponse: {q.options[selectedAnswers[q.id]] || 'Non répondu'}</p>
                      {selectedAnswers[q.id] !== q.correctAnswer && <p style={{color:'#2ecc71'}}>✓ {q.options[q.correctAnswer]}</p>}
                      <p style={{color:'#3498db',fontSize:'0.9rem'}}>💡 {q.explanation}</p>
                    </div>
                  ))}
                </div>
                <button onClick={() => {setQuiz(null);setShowResults(false);setSelectedAnswers({});}} 
                  style={{marginTop:'20px',padding:'15px 30px',backgroundColor:'#3498db',color:'white',border:'none',borderRadius:'5px',cursor:'pointer',fontWeight:'bold'}}>
                  🔄 Nouveau Quiz
                </button>
              </>
            );
          })()}
        </div>
      ) : (
        <div style={{backgroundColor:'white',borderRadius:'10px',padding:'40px',boxShadow:'0 2px 5px rgba(0,0,0,0.1)'}}>
          <div style={{marginBottom:'20px'}}>
            <div style={{height:'8px',backgroundColor:'#f0f0f0',borderRadius:'4px'}}>
              <div style={{height:'100%',width:`${((currentQuestion+1)/quiz.questions.length)*100}%`,backgroundColor:'#3498db',borderRadius:'4px'}}></div>
            </div>
            <span style={{color:'#666',fontSize:'0.9rem'}}>Question {currentQuestion+1}/{quiz.questions.length}</span>
          </div>
          <h2 style={{marginBottom:'25px'}}>{quiz.questions[currentQuestion].question}</h2>
          <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
            {quiz.questions[currentQuestion].options.map((opt, i) => (
              <button key={i} onClick={() => handleAnswerSelect(quiz.questions[currentQuestion].id, i)}
                style={{padding:'15px 20px',border:`1px solid ${selectedAnswers[quiz.questions[currentQuestion].id]===i?'#3498db':'#e0e0e0'}`,
                borderRadius:'5px',backgroundColor:selectedAnswers[quiz.questions[currentQuestion].id]===i?'rgba(52, 152, 219, 0.1)':'white',
                cursor:'pointer',textAlign:'left',display:'flex',alignItems:'center',gap:'15px'}}>
                <span style={{width:'30px',height:'30px',borderRadius:'50%',backgroundColor:'#f0f0f0',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'600',color:'#555'}}>{String.fromCharCode(65+i)}</span>
                {opt}
              </button>
            ))}
          </div>
          <div style={{display:'flex',justifyContent:'space-between',marginTop:'30px',paddingTop:'20px',borderTop:'1px solid #f0f0f0'}}>
            <button onClick={() => setCurrentQuestion(p => Math.max(0, p-1))} disabled={currentQuestion===0}
              style={{padding:'10px 20px',backgroundColor:'#ecf0f1',border:'none',borderRadius:'5px',cursor:currentQuestion===0?'not-allowed':'pointer',color:'#333',opacity:currentQuestion===0?0.5:1}}>← Précédent</button>
            {currentQuestion === quiz.questions.length - 1 ? (
              <button onClick={() => setShowResults(true)} disabled={Object.keys(selectedAnswers).length !== quiz.questions.length}
                style={{padding:'10px 20px',backgroundColor:Object.keys(selectedAnswers).length===quiz.questions.length?'#2ecc71':'#ccc',color:'white',border:'none',borderRadius:'5px',cursor:Object.keys(selectedAnswers).length===quiz.questions.length?'pointer':'not-allowed',fontWeight:'bold'}}>Terminer ✓</button>
            ) : (
              <button onClick={() => setCurrentQuestion(p => p+1)} style={{padding:'10px 20px',backgroundColor:'#3498db',color:'white',border:'none',borderRadius:'5px',cursor:'pointer',fontWeight:'bold'}}>Suivant →</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseQuiz;