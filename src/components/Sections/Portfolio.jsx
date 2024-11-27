import React from 'react';
import PortfolioItem from './PortfolioItem';

function Portfolio() {
  const projects = [
    {
      title: 'Project 1',
      description: 'Short description of the project.',
      link: 'https://github.com/yourrepo',
      linkText: 'View on GitHub'
    },
    {
      title: 'Project 2',
      description: 'Short description of the project.',
      link: 'https://yourprojectlink.com',
      linkText: 'Visit Project'
    }
  ];

  return (
    <section id="portfolio" className="section">
      <h2>Portfolio</h2>
      <div className="portfolio-items">
        {projects.map((project, index) => (
          <PortfolioItem key={index} {...project} />
        ))}
      </div>
    </section>
  );
}

export default Portfolio;