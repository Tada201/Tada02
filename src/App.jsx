import React, { useEffect } from 'react';
import Sidebar from './components/Header/Sidebar';
import HeroContent from './components/Header/HeroContent';
import About from './components/Sections/About';
import Portfolio from './components/Sections/Portfolio';
import Resume from './components/Sections/Resume';
import Footer from './components/Footer';
import { setupIntersectionObserver } from './utils/animations';

function App() {
  useEffect(() => {
    setupIntersectionObserver();
  }, []);

  return (
    <>
      <header className="hero">
        <Sidebar />
        <HeroContent />
      </header>

      <main>
        <About />
        <Portfolio />
        <Resume />
      </main>
      
      <Footer />
    </>
  );
}

export default App;