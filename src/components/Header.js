import React from 'react';

function Header({ user, onLogout }) {
  return (
    <header style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      padding: '16px 0',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="material-icons" style={{ 
            fontSize: '32px', 
            color: '#3B82F6',
            background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            verified
          </span>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: '700',
            background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            CredHex
          </h1>
        </div>
        
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ color: '#6B7280', fontSize: '14px' }}>
              {user.email}
            </span>
            <button className="btn btn-secondary" onClick={onLogout}>
              <span className="material-icons">logout</span>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;