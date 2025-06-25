import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import CertificateCard from '../components/CertificateCard';
import UploadZone from '../components/UploadZone';

function Dashboard() {
  const [certificates, setCertificates] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Fetch uploaded certificates
  const fetchCertificates = async (uid) => {
    try {
      const { data, error } = await supabase.storage
        .from('certificates')
        .list(`${uid}/`, { 
          limit: 100,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        console.error('Error fetching certificates:', error);
      } else {
        setCertificates(data || []);
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
    }
  };

  // Upload new certificate
  const handleUpload = async (file) => {
    if (!file || !user) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a valid file type (PDF, JPG, PNG, DOC, DOCX)');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setIsUploading(true);

    try {
      const timestamp = new Date().getTime();
      const fileName = `${timestamp}_${file.name}`;
      const filePath = `${user.id}/${fileName}`;
      
      const { error } = await supabase.storage
        .from('certificates')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        alert('Upload failed: ' + error.message);
      } else {
        await fetchCertificates(user.id);
        alert('Certificate uploaded successfully!');
      }
    } catch (error) {
      alert('Upload failed: ' + error.message);
    }
    
    setIsUploading(false);
  };

  // Delete certificate
  const handleDelete = async (fileName) => {
    if (!user) return;

    try {
      const filePath = `${user.id}/${fileName}`;
      const { error } = await supabase.storage
        .from('certificates')
        .remove([filePath]);

      if (error) {
        alert('Delete failed: ' + error.message);
      } else {
        await fetchCertificates(user.id);
        alert('Certificate deleted successfully!');
      }
    } catch (error) {
      alert('Delete failed: ' + error.message);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // Filter certificates based on search term
  const filteredCertificates = certificates.filter(cert =>
    cert.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // On load: get user and fetch their certs
  useEffect(() => {
    const getUserAndData = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (data?.user) {
          setUser(data.user);
          await fetchCertificates(data.user.id);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error getting user:', error);
        navigate('/login');
      }
      setIsLoading(false);
    };

    getUserAndData();
  }, [navigate]);

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh' }}>
        <Header />
        <div className="container" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: 'calc(100vh - 80px)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <span className="material-icons" style={{ 
              fontSize: '48px', 
              color: '#3B82F6',
              marginBottom: '16px',
              display: 'block',
              animation: 'spin 1s linear infinite'
            }}>
              hourglass_empty
            </span>
            <p style={{ color: '#6B7280' }}>Loading your certificates...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header user={user} onLogout={handleLogout} />
      
      <div className="container" style={{ padding: '40px 20px' }}>
        <div className="fade-in">
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ 
              fontSize: '32px', 
              fontWeight: '700', 
              marginBottom: '8px',
              background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Certificate Vault
            </h1>
            <p style={{ color: '#6B7280', fontSize: '16px' }}>
              Securely store and manage your digital certificates
            </p>
          </div>

          <UploadZone onUpload={handleUpload} isUploading={isUploading} />

          <div className="card" style={{ marginTop: '32px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '24px',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600' }}>
                Your Certificates ({filteredCertificates.length})
              </h2>
              
              <div style={{ position: 'relative', minWidth: '250px' }}>
                <span className="material-icons" style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9CA3AF',
                  fontSize: '20px'
                }}>
                  search
                </span>
                <input
                  type="text"
                  className="input"
                  placeholder="Search certificates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: '44px' }}
                />
              </div>
            </div>

            {filteredCertificates.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px 20px',
                color: '#6B7280'
              }}>
                <span className="material-icons" style={{ 
                  fontSize: '64px', 
                  color: '#D1D5DB',
                  marginBottom: '16px',
                  display: 'block'
                }}>
                  {searchTerm ? 'search_off' : 'folder_open'}
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>
                  {searchTerm ? 'No certificates found' : 'No certificates yet'}
                </h3>
                <p>
                  {searchTerm 
                    ? 'Try adjusting your search terms'
                    : 'Upload your first certificate to get started'
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1">
                {filteredCertificates.map((cert) => (
                  <CertificateCard
                    key={cert.name}
                    certificate={cert}
                    userId={user.id}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;