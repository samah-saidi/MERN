import CommentCard from './CommentCard';

function CommentList({ comments, title }) {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      {/* En-tête */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '15px',
        borderBottom: '2px solid #e5e7eb'
      }}>
        <h2 style={{ margin: 0, color: '#1f2937' }}>
          💬 {title}
        </h2>
        <span style={{
          backgroundColor: '#dbeafe',
          color: '#1e40af',
          padding: '5px 15px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          {comments.length} commentaire{comments.length > 1 ? 's' : ''}
        </span>
      </div>
      
      {/* Liste des commentaires */}
      {comments.length > 0 ? (
        comments.map((comment) => (
          <CommentCard
            key={comment.id}
            author={comment.author}
            text={comment.text}
            likes={comment.likes}
          />
        ))
      ) : (
        <p style={{ textAlign: 'center', color: '#6b7280', padding: '20px' }}>
          Aucun commentaire pour le moment. Soyez le premier à commenter !
        </p>
      )}
      
      {/* Statistiques */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-around'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
            {comments.reduce((sum, c) => sum + c.likes, 0)}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            Total likes
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
            {comments.length}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            Commentaires
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
            {comments.length > 0 ? Math.round(comments.reduce((sum, c) => sum + c.likes, 0) / comments.length) : 0}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            Moy. likes
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommentList;