import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const StatsPage = () => {
  const { code } = useParams();
  const [linkStats, setLinkStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/links/${code}`);
        setLinkStats(response.data);
        setError(null);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError('Link not found');
        } else {
          setError('Failed to fetch link stats');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [code]);

  const handleCopy = () => {
    const shortUrl = `${window.location.origin}/${code}`;
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="stats-page">
        <div className="container">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stats-page">
        <div className="container">
          <div className="error-message">{error}</div>
          <Link to="/" className="back-link">← Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="stats-page">
      <div className="container">
        <Link to="/" className="back-link">← Back to Dashboard</Link>
        
        <div className="stats-header">
          <h2>Link Statistics</h2>
          <div className="short-url-display">
            <span>{`${window.location.origin}/${code}`}</span>
            <button onClick={handleCopy} className="copy-button">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
        
        <div className="stats-card">
          <div className="stat-item">
            <h3>Short Code</h3>
            <p>{linkStats.code}</p>
          </div>
          
          <div className="stat-item">
            <h3>Original URL</h3>
            <p className="long-url">{linkStats.long_url}</p>
          </div>
          
          <div className="stat-item">
            <h3>Total Clicks</h3>
            <p className="click-count">{linkStats.total_clicks || 0}</p>
          </div>
          
          <div className="stat-item">
            <h3>Created At</h3>
            <p>{formatDate(linkStats.created_at)}</p>
          </div>
          
          <div className="stat-item">
            <h3>Last Clicked</h3>
            <p>{formatDate(linkStats.last_clicked)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;