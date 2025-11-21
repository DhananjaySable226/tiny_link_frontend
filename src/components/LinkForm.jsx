import React, { useState } from 'react';

const LinkForm = ({ onAddLink }) => {
  const [longUrl, setLongUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset messages
    setMessage('');
    setError('');
    
    // Validate URL
    if (!longUrl) {
      setError('Please enter a URL');
      return;
    }
    
    try {
      setLoading(true);
      const result = await onAddLink({ longUrl, customCode: customCode || undefined });
      
      if (result.success) {
        setMessage('Link created successfully!');
        // Reset form
        setLongUrl('');
        setCustomCode('');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An error occurred while creating the link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="link-form-container">
      <form onSubmit={handleSubmit} className="link-form">
        <div className="form-group">
          <label htmlFor="longUrl">Enter URL to shorten:</label>
          <input
            type="url"
            id="longUrl"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="https://example.com"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="customCode">Custom Short Code (optional):</label>
          <input
            type="text"
            id="customCode"
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            placeholder="e.g. mylink"
            pattern="[A-Za-z0-9]{6,8}"
            title="6-8 alphanumeric characters"
          />
          <small>Leave blank for auto-generated code (6-8 characters)</small>
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Short Link'}
        </button>
        
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
};

export default LinkForm;