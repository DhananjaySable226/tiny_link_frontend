import React, { useState } from 'react';

const LinkForm = ({ onAddLink }) => {
  const [longUrl, setLongUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setMessage('');
    setError('');
    setGeneratedCode('');
    setCopied(false);
    
    if (!longUrl) {
      setError('Please enter a URL');
      return;
    }
    
    try {
      setLoading(true);
      const result = await onAddLink({ longUrl, customCode: customCode || undefined });
      
      if (result.success) {
        setMessage('Link created successfully!');
        setGeneratedCode(result.code);
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

  const handleCopyShortUrl = () => {
    const shortUrl = `${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}/${generatedCode}`;
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
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
        
        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Short Link'}
          </button>
          
          {generatedCode && (
            <button 
              type="button"
              className="copy-short-url-button"
              onClick={handleCopyShortUrl}
            >
              {copied ? '✓ Copied!' : 'Copy Short URL'}
            </button>
          )}
        </div>
        
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        
        {generatedCode && (
          <div className="generated-url-display">
            <strong>Your Short URL:</strong>
            <span className="generated-url">
              {`${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}/${generatedCode}`}
            </span>
          </div>
        )}
      </form>
    </div>
  );
};

export default LinkForm;