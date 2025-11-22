import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

function RedirectHandler() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    let redirected = false;
    
    const performRedirect = async () => {
      if (redirected) return;
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/links/${code}`);
        
        if (response.ok) {
          redirected = true;
          window.location.href = `${API_BASE_URL}/${code}`;
        } else if (response.status === 404) {
          setError('Link not found');
          setTimeout(() => navigate('/'), 3000);
        } else {
          setError('Error loading link');
          setTimeout(() => navigate('/'), 3000);
        }
      } catch (err) {
        setError('Failed to connect to server');
        setTimeout(() => navigate('/'), 3000);
      }
    };
    
    performRedirect();
  }, [code, navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontSize: '1.5rem',
      gap: '1rem'
    }}>
      {error ? (
        <>
          <div>❌ {error}</div>
          <div style={{ fontSize: '1rem' }}>Redirecting to home...</div>
        </>
      ) : (
        <div>Redirecting...</div>
      )}
    </div>
  );
}

export default RedirectHandler;
