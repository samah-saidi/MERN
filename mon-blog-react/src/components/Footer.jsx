function Footer({ author, year }) {
  return (
    <footer
      style={{
        textAlign: 'center',
        padding: '20px',
        marginTop: '40px',
        borderTop: '2px solid #ddd',
        color: '#666',
      }}
    >
      <p>
        © {year} {author} — Tous droits réservés
      </p>
      <p style={{ fontSize: '14px', marginTop: '10px' }}>
        Créé avec React + Vite
      </p>
    </footer>
  );
}

export default Footer;
