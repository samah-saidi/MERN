import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

function EditProfile() {
  const [formData, setFormData] = useState({ bio: "", website: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user?._id) return;

    try {
      const response = await api.get(`/users/${user._id}/profile`);
      setFormData({
        bio: response.data.bio || "",
        website: response.data.website || "",
      });
    } catch (error) {
      console.error("Erreur lors du chargement du profil:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      await api.put(`/users/${user._id}/profile`, formData);
      setMessage("Profil mis à jour avec succès !");
      setTimeout(() => navigate("/profile"), 1500);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Erreur lors de la mise à jour"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        Chargement...
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "50px auto",
        padding: "30px",
        backgroundColor: "white",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h1 style={{ marginBottom: "30px", color: "#2c3e50" }}>
        Éditer mon profil
      </h1>

      {message && (
        <div
          style={{
            padding: "15px",
            marginBottom: "20px",
            backgroundColor: message.includes("succès") ? "#d4edda" : "#f8d7da",
            color: message.includes("succès") ? "#155724" : "#721c24",
            borderRadius: "5px",
            border: `1px solid ${
              message.includes("succès") ? "#c3e6cb" : "#f5c6cb"
            }`,
          }}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="bio"
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold",
              color: "#2c3e50",
            }}
          >
            Biographie :
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Décrivez-vous en quelques lignes..."
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              minHeight: "120px",
              fontFamily: "inherit",
              fontSize: "14px",
              resize: "vertical",
            }}
          />
          <small style={{ color: "#999" }}>
            Maximum 500 caractères
          </small>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="website"
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold",
              color: "#2c3e50",
            }}
          >
            Site web (optionnel) :
          </label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://exemple.com"
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "30px",
          }}
        >
          <button
            type="submit"
            disabled={submitting}
            style={{
              flex: 1,
              padding: "12px",
              backgroundColor: "#27ae60",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: submitting ? "not-allowed" : "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              opacity: submitting ? 0.6 : 1,
            }}
          >
            {submitting ? "Mise à jour..." : "Enregistrer"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/profile")}
            style={{
              flex: 1,
              padding: "12px",
              backgroundColor: "#95a5a6",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;
