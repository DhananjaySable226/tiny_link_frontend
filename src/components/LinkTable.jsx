import React, { useState } from 'react';

const LinkTable = ({ links, onDeleteLink }) => {
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopy = (code) => {
    // Get the full short URL with domain
    const shortUrl = `${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}/${code}`;
    navigator.clipboard.writeText(shortUrl);
    setCopiedCode(code);
    
    // Reset copied status after 2 seconds
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  const handleVisit = (code) => {
    // Open the redirect URL in a new tab
    const redirectUrl = `${window.location.protocol}//${window.location.hostname}:3001/${code}`;
    window.open(redirectUrl, '_blank');
  };

  const handleUrlClick = (e, code) => {
    // Prevent default link behavior
    e.preventDefault();
    // Use the redirect URL instead of direct URL to count clicks
    const redirectUrl = `${window.location.protocol}//${window.location.hostname}:3001/${code}`;
    window.open(redirectUrl, '_blank');
  };

  const truncateUrl = (url, maxLength = 50) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getShortUrl = (code) => {
    return `${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}/${code}`;
  };

  if (links.length === 0) {
    return (
      <div className="empty-state">
        <p>No links found. Create your first short link!</p>
      </div>
    );
  }

  return (
    <div className="link-table-container">
      <table className="link-table">
        <thead>
          <tr>
            <th>Short Code</th>
            <th>Short URL</th>
            <th>Original URL</th>
            <th>Total Clicks</th>
            <th>Created At</th>
            <th>Last Clicked</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {links.map((link) => (
            <tr key={link.code}>
              <td>
                <div className="short-code-cell">
                  <span className="short-code">{link.code}</span>
                </div>
              </td>
              <td>
                <div className="short-url-cell">
                  <span className="short-url-text" title={getShortUrl(link.code)}>
                    {getShortUrl(link.code)}
                  </span>
                  <button 
                    className="copy-button"
                    onClick={() => handleCopy(link.code)}
                    title="Copy short URL"
                  >
                    {copiedCode === link.code ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
              </td>
              <td>
                <div className="url-cell">
                  <a 
                    href={link.long_url} 
                    onClick={(e) => handleUrlClick(e, link.code)}
                    className="url-link"
                    title={link.long_url}
                  >
                    {truncateUrl(link.long_url, 60)}
                  </a>
                </div>
              </td>
              <td>
                <span className="click-count-badge">{link.total_clicks || 0}</span>
              </td>
              <td>{formatDate(link.created_at)}</td>
              <td>{formatDate(link.last_clicked)}</td>
              <td>
                <div className="action-buttons">
                  <button 
                    className="visit-button"
                    onClick={() => handleVisit(link.code)}
                    title="Test redirect (opens in new tab)"
                  >
                    Visit
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => onDeleteLink(link.code)}
                  >
                    Delete
                  </button>
                  <a 
                    href={`/code/${link.code}`} 
                    className="stats-link"
                  >
                    Stats
                  </a>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LinkTable;