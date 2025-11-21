import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LinkForm from './LinkForm';
import LinkTable from './LinkTable';

const Dashboard = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Fetch all links
  const fetchLinks = async (showLoader = false) => {
    try {
      if (showLoader) {
        setLoading(true);
      }
      const response = await axios.get('/api/links');
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

  // Delete a link
  const deleteLink = async (code) => {
    try {
      await axios.delete(`/api/links/${code}`);
      // Refresh the links list
      fetchLinks(false);
    } catch (err) {
      setError('Failed to delete link');
      console.error('Error deleting link:', err);
    }
  };

  // Add a new link
  const addLink = async (linkData) => {
    try {
      await axios.post('/api/links', linkData);
      // Refresh the links list
      fetchLinks(false);
      return { success: true };
    } catch (err) {
      if (err.response && err.response.status === 409) {
        return { success: false, error: 'Shortcode already exists' };
      }
      return { success: false, error: 'Failed to create link' };
    }
  };

  useEffect(() => {
    fetchLinks(true); // Show loader on initial load
    
    // Auto-refresh every 10 seconds to show updated click counts
    const intervalId = setInterval(() => {
      fetchLinks(false); // Don't show loader on auto-refresh
    }, 10000); // Changed from 3000ms to 10000ms (10 seconds)
    
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Listen for when user returns to the page (focus event)
  useEffect(() => {
    const handleFocus = () => {
      if (!isInitialLoad) {
        fetchLinks(false); // Don't show loader when returning to page
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