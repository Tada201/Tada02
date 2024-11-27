import React from 'react';

function Navigation() {
  return (
    <nav>
      <ul className="navbar">
        <li><a href="#about"><span>About</span></a></li>
        <li><a href="#portfolio"><span>Portfolio</span></a></li>
        <li><a href="#resume"><span>Resume</span></a></li>
      </ul>
    </nav>
  );
}

export default Navigation;