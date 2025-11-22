import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_BASE_URL } from '../config';

function RedirectHandler() {
  const { code } = useParams();

  useEffect(() => {
    // Redirect to backend for short code handling
    window.location.href = `${API_BASE_URL}/${code}`;
  }, [code]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontSize: '1.5rem'
    }}>
      Redirecting...
    </div>
  );
}

export default RedirectHandler;
