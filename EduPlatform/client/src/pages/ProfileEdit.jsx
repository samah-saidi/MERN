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

  useEffect(() => {
    // Charger le profil existant
    api.get(`/users/${user.id}/profile`)
      .then(res => {
        setFormData({
          bio: res.data.bio || '',
          website: res.data.website || ''
        });
        setProfileExists(true);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        // Si le profil n'existe pas, on reste en mode création
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      if (profileExists) {
        // Mettre à jour le profil existant
        await api.put(`/users/${user.id}/profile`, formData);
        setMessage('Profil mis à jour avec succès !');
      } else {
        // Créer un nouveau profil
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
          <label
            htmlFor="bio"
            style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: 'bold',
              color: '#2c3e50'
            }}
          >
            Bio
          </label>
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