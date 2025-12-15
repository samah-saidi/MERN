import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function ProfileEdit() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bio: '',
    website: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [profileExists, setProfileExists] = useState(false);
  
  // Bio Generator states
  const [showBioGenerator, setShowBioGenerator] = useState(false);
  const [bioForm, setBioForm] = useState({
    interests: '',
    experience: '',
    goals: ''
  });
  const [generatingBio, setGeneratingBio] = useState(false);

  useEffect(() => {
    api.get(`/users/${user.id}/profile`)
      .then(res => {
        setFormData({
          bio: res.data.bio || '',
          website: res.data.website || ''
        });
        setProfileExists(true);
        setLoading(false);
      })
      .catch(() => {
        setProfileExists(false);
        setLoading(false);
      });
  }, [user.id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleBioFormChange = (e) => {
    setBioForm({
      ...bioForm,
      [e.target.name]: e.target.value
    });
  };

  const generateBio = async () => {
    if (!bioForm.interests || !bioForm.experience) {
      setMessage('Veuillez remplir au moins les intérêts et l\'expérience');
      return;
    }

    setGeneratingBio(true);
    setMessage('');

    try {
      const res = await api.post('/ai/generate-bio', bioForm);
      setFormData(prev => ({
        ...prev,
        bio: res.data.data.bio
      }));
      setShowBioGenerator(false);
      setMessage('Bio générée avec succès ! Vous pouvez la modifier avant de sauvegarder.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur lors de la génération de la bio');
    } finally {
      setGeneratingBio(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      if (profileExists) {
        await api.put(`/users/${user.id}/profile`, formData);
        setMessage('Profil mis à jour avec succès !');
      } else {
        await api.post(`/users/${user.id}/profile`, formData);
        setMessage('Profil créé avec succès !');
        setProfileExists(true);
      }
      
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        Chargement...
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', maxWidth: '700px', margin: '0 auto' }}>
      <h1>Éditer mon profil</h1>

      <form onSubmit={handleSubmit} style={{ marginTop: '30px' }}>
        <div style={{ marginBottom: '25px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label
              htmlFor="bio"
              style={{
                fontWeight: 'bold',
                color: '#2c3e50'
              }}
            >
              Bio
            </label>
            <button
              type="button"
              onClick={() => setShowBioGenerator(!showBioGenerator)}
              style={{
                padding: '8px 16px',
                backgroundColor: showBioGenerator ? '#95a5a6' : '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {showBioGenerator ? 'Fermer' : '✨ Générer avec IA'}
            </button>
          </div>

          {/* Bio Generator Panel */}
          {showBioGenerator && (
            <div style={{
              padding: '20px',
              backgroundColor: '#f8f9ff',
              borderRadius: '12px',
              marginBottom: '15px',
              border: '2px solid #3498db'
            }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#3498db' }}>
                🤖 Générateur de Bio IA
              </h4>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>
                Remplissez les informations ci-dessous pour générer une bio professionnelle personnalisée.
              </p>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                  🎯 Vos intérêts *
                </label>
                <input
                  type="text"
                  name="interests"
                  value={bioForm.interests}
                  onChange={handleBioFormChange}
                  placeholder="Ex: développement web, machine learning, design UI/UX"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                  💼 Votre expérience *
                </label>
                <input
                  type="text"
                  name="experience"
                  value={bioForm.experience}
                  onChange={handleBioFormChange}
                  placeholder="Ex: 3 ans en développement, étudiant en informatique"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                  🎓 Vos objectifs (optionnel)
                </label>
                <input
                  type="text"
                  name="goals"
                  value={bioForm.goals}
                  onChange={handleBioFormChange}
                  placeholder="Ex: devenir expert full-stack, créer ma startup"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <button
                type="button"
                onClick={generateBio}
                disabled={generatingBio}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: generatingBio ? '#a0a0a0' : '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: generatingBio ? 'not-allowed' : 'pointer',
                  fontSize: '15px',
                  fontWeight: '600'
                }}
              >
                {generatingBio ? '⏳ Génération en cours...' : '✨ Générer ma bio'}
              </button>
            </div>
          )}

          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            required
            rows="5"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              border: '2px solid #ddd',
              borderRadius: '8px',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
            placeholder="Parlez-nous de vous..."
          />
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label
            htmlFor="website"
            style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: 'bold',
              color: '#2c3e50'
            }}
          >
            Site Web (optionnel)
          </label>
          <input
            id="website"
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              border: '2px solid #ddd',
              borderRadius: '8px'
            }}
            placeholder="https://example.com"
          />
        </div>

        {message && (
          <div
            style={{
              padding: '15px',
              marginBottom: '20px',
              backgroundColor: message.includes('succès') ? '#d4edda' : '#f8d7da',
              color: message.includes('succès') ? '#155724' : '#721c24',
              borderRadius: '8px',
              border: `1px solid ${message.includes('succès') ? '#c3e6cb' : '#f5c6cb'}`
            }}
          >
            {message}
          </div>
        )}

        <div style={{ display: 'flex', gap: '15px' }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              flex: 1,
              padding: '15px 30px',
              backgroundColor: saving ? '#95a5a6' : '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/profile')}
            style={{
              flex: 1,
              padding: '15px 30px',
              backgroundColor: '#95a5a6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProfileEdit;