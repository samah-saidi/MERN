function Badge({ text, color = "blue" }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '5px 10px',
        backgroundColor: color,
        color: 'white',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 'bold',
      }}
    >
      {text}
    </span>
  );
}

export default Badge;
