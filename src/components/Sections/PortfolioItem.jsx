import React from 'react';

function PortfolioItem({ title, description, link, linkText }) {
  return (
    <div className="portfolio-item">
      <h3>{title}</h3>
      <p>{description}</p>
      <a href={link} target="_blank" rel="noopener noreferrer">{linkText}</a>
    </div>
  );
}

export default PortfolioItem;