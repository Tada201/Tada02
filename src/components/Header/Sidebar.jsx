import React from 'react';
import Navigation from './Navigation';

function Sidebar() {
  return (
    <div className="sidebar">
      <img src="/profile.jpg" alt="Profile" className="profile-pic" />
      <Navigation />
    </div>
  );
}

export default Sidebar;