
function Article({ title, author, content }) {
  return (
    <article style={{
        border: '1px solid #ddd',
        padding: '20px',
        marginBottom: '20px',
        borderRadius: '8px',
    }}>
        <h2>{title}</h2>
        <p style={{ color: '#666', fontStyle: '14px' }}>
            Par {author}
        </p>
        <p>{content}</p>
    </article>
  );
}

export default Article;