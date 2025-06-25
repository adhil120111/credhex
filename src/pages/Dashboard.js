// src/pages/Dashboard.js
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [certificates, setCertificates] = useState([]);
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  // Fetch uploaded certificates
  const fetchCertificates = async (uid) => {
    const { data, error } = await supabase.storage
      .from('certificates')
      .list(`${uid}/`, { limit: 100 });

    if (error) {
      alert('Error fetching certificates: ' + error.message);
    } else {
      setCertificates(data);
    }
  };

  // Upload new certificate
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !userId) return;

    const filePath = `${userId}/${file.name}`;
    const { error } = await supabase.storage
      .from('certificates')
      .upload(filePath, file);

    if (error) {
      alert('Upload failed: ' + error.message);
    } else {
      fetchCertificates(userId);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // On load: get user and fetch their certs
  useEffect(() => {
    const getUserAndData = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        const uid = data.user.id;
        setUserId(uid);
        fetchCertificates(uid);
      } else {
        navigate('/login');
      }
    };

    getUserAndData();
  }, [navigate]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>CredHex Vault</h2>
      <input type="file" accept="application/pdf" onChange={handleUpload} />

      <h3>Your Uploaded Certificates:</h3>
      <ul>
        {certificates.map((cert) => (
          <li key={cert.name}>
            <a
              href={`https://broseasswahrbiglvplk.supabase.co/storage/v1/object/public/certificates/${userId}/${cert.name}`}
              target="_blank"
              rel="noreferrer"
            >
              {cert.name}
            </a>
          </li>
        ))}
      </ul>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;
