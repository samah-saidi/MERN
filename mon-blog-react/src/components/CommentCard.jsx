// function CommentCard({ author, text, likes }) {
//   return (
//     <div
//       style={{
//         border: '1px solid #ddd',
//         borderRadius: '8px',
//         padding: '10px 15px',
//         marginBottom: '10px',
//         backgroundColor: '#fefefe',
//       }}
//     >
//       <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{author}</p>
//       <p style={{ margin: '0 0 5px 0' }}>{text}</p>
//       <p style={{ margin: 0, color: '#888', fontSize: '12px' }}>
//         {likes} likes
//       </p>
//     </div>
//   );
// }

// export default CommentCard;


function CommentCard({ author, text, likes }) {
  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '15px',
      marginBottom: '15px',
      backgroundColor: '#ffffff'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px'
      }}>
        {/* Avatar */}
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#3b82f6',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          marginRight: '12px'
        }}>
          {author.charAt(0).toUpperCase()}
        </div>
        
        {/* Nom et likes */}
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 'bold', color: '#1f2937' }}>
            {author}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            Il y a 2 heures
          </div>
        </div>
        
        {/* Bouton likes */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '5px 12px',
          backgroundColor: '#f3f4f6',
          borderRadius: '20px',
          cursor: 'pointer'
        }}>
          <span style={{ fontSize: '16px' }}>❤️</span>
          <span style={{ fontWeight: 'bold', color: '#ef4444' }}>
            {likes}
          </span>
        </div>
      </div>
      
      {/* Texte du commentaire */}
      <p style={{
        margin: '10px 0 0 52px',
        color: '#374151',
        lineHeight: '1.5'
      }}>
        {text}
      </p>
    </div>
  );
}

export default CommentCard;