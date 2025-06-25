import React from 'react';

function CertificateCard({ certificate, userId, onDelete }) {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'picture_as_pdf';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'image';
      case 'doc':
      case 'docx':
        return 'description';
      default:
        return 'insert_drive_file';
    }
  };

  const certificateUrl = `https://broseasswahrbiglvplk.supabase.co/storage/v1/object/public/certificates/${userId}/${certificate.name}`;

  return (
    <div className="card fade-in" style={{
      padding: '20px',
      transition: 'all 0.2s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
          borderRadius: '12px',
          padding: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '48px',
          height: '48px'
        }}>
          <span className="material-icons" style={{ color: 'white', fontSize: '24px' }}>
            {getFileIcon(certificate.name)}
          </span>
        </div>
        
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            marginBottom: '4px',
            wordBreak: 'break-word'
          }}>
            {certificate.name}
          </h3>
          
          <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', color: '#6B7280' }}>
              <span className="material-icons" style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '4px' }}>
                storage
              </span>
              {formatFileSize(certificate.metadata?.size || 0)}
            </span>
            <span style={{ fontSize: '12px', color: '#6B7280' }}>
              <span className="material-icons" style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '4px' }}>
                schedule
              </span>
              {formatDate(certificate.created_at)}
            </span>
          </div>
          
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <a
              href={certificateUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
              style={{ fontSize: '12px', padding: '8px 16px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="material-icons" style={{ fontSize: '16px' }}>visibility</span>
              View
            </a>
            
            <a
              href={certificateUrl}
              download={certificate.name}
              className="btn btn-secondary"
              style={{ fontSize: '12px', padding: '8px 16px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="material-icons" style={{ fontSize: '16px' }}>download</span>
              Download
            </a>
            
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('Are you sure you want to delete this certificate?')) {
                    onDelete(certificate.name);
                  }
                }}
                className="btn btn-danger"
                style={{ fontSize: '12px', padding: '8px 16px' }}
              >
                <span className="material-icons" style={{ fontSize: '16px' }}>delete</span>
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CertificateCard;