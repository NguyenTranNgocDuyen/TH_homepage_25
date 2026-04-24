import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ManagementSection from './components/ManagementSection';

function ScrollHandler() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

function App() {
  const homeScreen = (
    <>
      <HomePage />
      <ManagementSection />
    </>
  );

  return (
    <BrowserRouter>
      <ScrollHandler />
      <div className="app-shell">
        <div className="page-glow page-glow-left" />
        <div className="page-glow page-glow-right" />
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={homeScreen} />
            <Route path="/about-us" element={<AboutPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
