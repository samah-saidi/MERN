function ProductCard({ name, price, category }) {
  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '10px',
        backgroundColor: '#f9f9f9',
      }}
    >
      <h2 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>{name}</h2>
      <p style={{ margin: '0 0 5px 0', color: '#666' }}>
        Catégorie : {category}
      </p>
      <p style={{ margin: 0, fontWeight: 'bold' }}>Prix : ${price}</p>
    </div>
  );
}

export default ProductCard;
