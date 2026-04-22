import React from 'react';

const Header = ({ mode, setMode }) => {
  return (
    <header style={{
      padding: '24px 20px',
      background: '#6D28D9',
      color: 'white',
      borderRadius: '0 0 24px 24px',
      boxShadow: '0 4px 12px rgba(109, 40, 217, 0.2)'
    }}>
      <div style={{ fontSize: '10px', fontWeight: '900', letterSpacing: '2px', opacity: 0.8, marginBottom: '4px' }}>
        BACKUP ASSISTANT V1.0
      </div>
      <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '900', textTransform: 'uppercase' }}>
        Smart AI Continuity
      </h1>
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        {['retail', 'fnb'].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              padding: '6px 16px',
              borderRadius: '20px',
              border: 'none',
              fontSize: '12px',
              fontWeight: '900',
              cursor: 'pointer',
              textTransform: 'uppercase',
              backgroundColor: mode === m ? 'white' : 'rgba(255,255,255,0.2)',
              color: mode === m ? '#6D28D9' : 'white',
              transition: '0.3s'
            }}
          >
            {m}
          </button>
        ))}
      </div>
    </header>
  );
};

export default Header;
