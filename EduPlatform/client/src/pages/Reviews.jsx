import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchUserReviews();
  }, [user]);

  const fetchUserReviews = async () => {
    if (!user?.id) return;

    try {
      const response = await api.get(`/reviews/user/${user.id}`);
      setReviews(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette review ?")) {
      return;
    }

    try {
      await api.delete(`/reviews/${reviewId}`);
      setReviews(reviews.filter((r) => r._id !== reviewId));
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
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
        maxWidth: "900px",
        margin: "0 auto",
        padding: "30px 20px",
      }}
    >
      <h1 style={{ color: "#2c3e50", marginBottom: "30px" }}>Mes Avis</h1>

      {reviews.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "50px",
            backgroundColor: "#ecf0f1",
            borderRadius: "10px",
          }}
        >
          <p style={{ fontSize: "18px", color: "#555" }}>
            Vous n'avez pas encore écrit d'avis
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {reviews.map((review) => (
            <div
              key={review._id}
              style={{
                padding: "20px",
                backgroundColor: "white",
                borderRadius: "10px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                borderLeft: "5px solid #9b59b6",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  marginBottom: "10px",
                }}
              >
                <div>
                  <h3 style={{ marginBottom: "5px", color: "#2c3e50" }}>
                    {review.course?.title || "Cours supprimé"}
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ color: "#f39c12", fontSize: "18px" }}>
                      {"⭐".repeat(review.rating)}
                    </span>
                    <span style={{ color: "#999" }}>({review.rating}/5)</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteReview(review._id)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#e74c3c",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Supprimer
                </button>
              </div>

              <p
                style={{
                  color: "#555",
                  lineHeight: "1.6",
                  marginTop: "10px",
                  fontStyle: review.comment ? "normal" : "italic",
                }}
              >
                {review.comment || "Pas de commentaire"}
              </p>

              <p
                style={{
                  marginTop: "15px",
                  fontSize: "12px",
                  color: "#999",
                }}
              >
                {new Date(review.createdAt).toLocaleDateString("fr-FR")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Reviews;
