import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: "👋 Bonjour ! Je suis votre assistant virtuel. Posez-moi des questions sur nos cours ou notre plateforme !",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Charger la liste des cours pour le contexte optionnel
    api.get('/courses')
      .then(res => setCourses(res.data))
      .catch(err => console.error('Erreur lors du chargement des cours:', err));
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const payload = {
        question: input,
        ...(selectedCourse && { courseId: selectedCourse })
      };

      const res = await api.post('/ai/chatbot', payload);
      
      const botMessage = {
        type: 'bot',
        content: res.data.data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        type: 'bot',
        content: "😅 Désolé, je n'ai pas pu traiter votre demande. Veuillez réessayer.",
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    "Quels cours recommandez-vous pour un débutant ?",
    "Comment m'inscrire à un cours ?",
    "Quels sont les cours les mieux notés ?",
    "Combien de temps dure un cours en moyenne ?"
  ];

  const handleSuggestedQuestion = (question) => {
    setInput(question);
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatContainer}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerInfo}>
            <div style={styles.botAvatar}>🤖</div>
            <div>
              <h2 style={styles.headerTitle}>Assistant IA</h2>
              <span style={styles.headerStatus}>
                <span style={styles.statusDot}></span>
                En ligne
              </span>
            </div>
          </div>
          <div style={styles.courseSelector}>
            <label style={styles.selectorLabel}>Contexte cours:</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              style={styles.select}
            >
              <option value="">Général</option>
              {courses.map(course => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Messages */}
        <div style={styles.messagesContainer}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                ...styles.messageWrapper,
                justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              {msg.type === 'bot' && (
                <div style={styles.messageBotAvatar}>🤖</div>
              )}
              <div
                style={{
                  ...styles.message,
                  ...(msg.type === 'user' ? styles.userMessage : styles.botMessage),
                  ...(msg.isError && styles.errorMessage)
                }}
              >
                <p style={styles.messageContent}>{msg.content}</p>
                <span style={styles.messageTime}>
                  {msg.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          
          {loading && (
            <div style={styles.messageWrapper}>
              <div style={styles.messageBotAvatar}>🤖</div>
              <div style={styles.typingIndicator}>
                <span style={styles.typingDot}></span>
                <span style={{...styles.typingDot, animationDelay: '0.2s'}}></span>
                <span style={{...styles.typingDot, animationDelay: '0.4s'}}></span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length <= 2 && (
          <div style={styles.suggestionsContainer}>
            <p style={styles.suggestionsTitle}>💡 Questions suggérées:</p>
            <div style={styles.suggestionsGrid}>
              {suggestedQuestions.map((q, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(q)}
                  style={styles.suggestionButton}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div style={styles.inputContainer}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Posez votre question..."
            style={styles.input}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            style={loading || !input.trim() ? styles.sendButtonDisabled : styles.sendButton}
          >
            {loading ? '...' : '➤'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    padding: '30px',
    minHeight: 'calc(100vh - 100px)',
    backgroundColor: '#f0f2f5',
  },
  chatContainer: {
    width: '100%',
    maxWidth: '800px',
    backgroundColor: 'white',
    borderRadius: '24px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#3498db',
    padding: '20px 25px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '15px',
  },
  headerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  botAvatar: {
    width: '50px',
    height: '50px',
    backgroundColor: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.8rem',
  },
  headerTitle: {
    color: 'white',
    margin: 0,
    fontSize: '1.3rem',
  },
  headerStatus: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#4ade80',
    borderRadius: '50%',
  },
  courseSelector: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  selectorLabel: {
    color: 'white',
    fontSize: '0.9rem',
  },
  select: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '0.9rem',
    cursor: 'pointer',
    maxWidth: '200px',
  },
  messagesContainer: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
    backgroundColor: '#f8f9fa',
    minHeight: '400px',
    maxHeight: '500px',
  },
  messageWrapper: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '10px',
    marginBottom: '15px',
  },
  messageBotAvatar: {
    width: '35px',
    height: '35px',
    backgroundColor: '#3498db',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    flexShrink: 0,
    color: 'white'
  },
  message: {
    maxWidth: '70%',
    padding: '12px 18px',
    borderRadius: '18px',
    position: 'relative',
  },
  userMessage: {
    backgroundColor: '#3498db',
    color: 'white',
    borderBottomRightRadius: '4px',
  },
  botMessage: {
    backgroundColor: 'white',
    color: '#333',
    borderBottomLeftRadius: '4px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  errorMessage: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
  },
  messageContent: {
    margin: 0,
    lineHeight: 1.5,
    whiteSpace: 'pre-wrap',
  },
  messageTime: {
    fontSize: '0.7rem',
    opacity: 0.7,
    display: 'block',
    marginTop: '5px',
    textAlign: 'right',
  },
  typingIndicator: {
    backgroundColor: 'white',
    padding: '15px 20px',
    borderRadius: '18px',
    display: 'flex',
    gap: '5px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  typingDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#3498db',
    borderRadius: '50%',
    animation: 'bounce 1s infinite',
  },
  suggestionsContainer: {
    padding: '15px 20px',
    borderTop: '1px solid #e9ecef',
    backgroundColor: 'white',
  },
  suggestionsTitle: {
    fontSize: '0.9rem',
    color: '#666',
    marginBottom: '10px',
  },
  suggestionsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  suggestionButton: {
    padding: '8px 14px',
    backgroundColor: '#f0f0f0',
    border: '1px solid #e0e0e0',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    color: '#555',
    transition: 'all 0.2s ease',
  },
  inputContainer: {
    display: 'flex',
    padding: '20px',
    gap: '12px',
    borderTop: '1px solid #e9ecef',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    padding: '15px 20px',
    border: '2px solid #e9ecef',
    borderRadius: '25px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.3s ease',
  },
  sendButton: {
    width: '50px',
    height: '50px',
    backgroundColor: '#3498db',
    border: 'none',
    borderRadius: '50%',
    color: 'white',
    fontSize: '1.3rem',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  },
  sendButtonDisabled: {
    width: '50px',
    height: '50px',
    backgroundColor: '#ccc',
    border: 'none',
    borderRadius: '50%',
    color: 'white',
    fontSize: '1.3rem',
    cursor: 'not-allowed',
  },
};

// Add CSS animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes bounce {
    0%, 60%, 100% { transform: translateY(0); }
    30% { transform: translateY(-5px); }
  }
`;
document.head.appendChild(styleSheet);

export default Chatbot;