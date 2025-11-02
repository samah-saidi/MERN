function CommentCard({ author, text, likes }) {
  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '10px 15px',
        marginBottom: '10px',
        backgroundColor: '#fefefe',
      }}
    >
      <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{author}</p>
      <p style={{ margin: '0 0 5px 0' }}>{text}</p>
      <p style={{ margin: 0, color: '#888', fontSize: '12px' }}>
        {likes} likes
      </p>
    </div>
  );
}

export default CommentCard;
