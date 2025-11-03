// function ProductCard({ name, price, category }) {
//   return (
//     <div
//       style={{
//         border: '1px solid #ddd',
//         borderRadius: '8px',
//         padding: '15px',
//         marginBottom: '10px',
//         backgroundColor: '#f9f9f9',
//       }}
//     >
//       <h2 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>{name}</h2>
//       <p style={{ margin: '0 0 5px 0', color: '#666' }}>
//         Catégorie : {category}
//       </p>
//       <p style={{ margin: 0, fontWeight: 'bold' }}>Prix : ${price}</p>
//     </div>
//   );
// }

// export default ProductCard;


function ProductCard({ name, price, category }) {
  return (
    <div style={{
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '15px',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px'
      }}>
        <h3 style={{ margin: 0, color: '#1f2937', fontSize: '1.25rem' }}>
          {name}
        </h3>
        <span style={{
          backgroundColor: '#dbeafe',
          color: '#1e40af',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          {category}
        </span>
      </div>
      
      <div style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#10b981',
        marginTop: '10px'
      }}>
        {price} DT
      </div>
      
      <button style={{
        marginTop: '15px',
        width: '100%',
        padding: '10px',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold'
      }}>
        Ajouter au panier
      </button>
    </div>
  );
}

export default ProductCard;