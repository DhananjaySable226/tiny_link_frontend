import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LinkForm from './LinkForm';
import LinkTable from './LinkTable';
import { API_BASE_URL } from '../config';

const Dashboard = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchLinks = async (showLoader = false) => {
    try {
      if (showLoader) {
        setLoading(true);
      }
      const response = await axios.get(`${API_BASE_URL}/api/links`);
      setLinks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch links');
      console.error('Error fetching links:', err);
    } finally {
      if (showLoader) {
        setLoading(false);
      }
      setIsInitialLoad(false);
    }
  };

  const deleteLink = async (code) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/links/${code}`);
      fetchLinks(false);
    } catch (err) {
      setError('Failed to delete link');
      console.error('Error deleting link:', err);
    }
  };

  const addLink = async (linkData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/links`, linkData);
      fetchLinks(false);
      return { success: true, code: response.data.code };
    } catch (err) {
      if (err.response && err.response.status === 409) {
        return { success: false, error: 'Shortcode already exists' };
      }
      return { success: false, error: 'Failed to create link' };
    }
  };

  useEffect(() => {
    fetchLinks(true);
    
    const intervalId = setInterval(() => {
      fetchLinks(false); 
    }, 10000);
    
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      if (!isInitialLoad) {
        fetchLinks(false); 
      }
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [isInitialLoad]);

  return (
    <div className="dashboard">
      <div className="container">
        <h2>URL Shortener Dashboard</h2>
        
        <LinkForm onAddLink={addLink} />
        
        {error && <div className="error-message">{error}</div>}
        
        {loading && isInitialLoad ? (
          <div className="loading">Loading...</div>
        ) : (
          <LinkTable links={links} onDeleteLink={deleteLink} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;