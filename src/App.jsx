import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
import { HelmetProvider, Helmet } from 'react-helmet-async';

import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

import Hero from './components/sections/Hero';
import BentoServices from './components/sections/BentoServices';

import Services from './pages/Services';
import Projects from './pages/Projects';
import About from './pages/About';
import Contact from './pages/Contact';

import Login from './pages/Login';
import Signup from './pages/Signup';
import UserPortal from './pages/UserPortal';
import AdminPortal from './pages/AdminPortal';

function HomePage() {
  return (
    <>
      <Helmet>
        <title>NexVion | Building the Future with AI</title>
        <meta 
          name="description" 
          content="We design intelligent, scalable software for businesses and individuals, from smart apps to AI agents that work while you sleep." 
        />
      </Helmet>
      
      {/* Page 1: Hero with 3D Celestial Planetary Sphere */}
      <Hero />

      {/* Page 2 & 3: Everything your business needs, How a project runs, Local businesses, and CTA */}
      <BentoServices />
    </>
  );
}

function NotFoundPage() {
  return (
    <div className="pt-48 pb-32 max-w-content mx-auto px-6 text-center">
      <h1 className="text-6xl font-black text-white">404</h1>
      <p className="mt-4 text-muted">The neural coordinate you are looking for does not exist.</p>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    let lenis;
    try {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      function raf(time) {
        lenis?.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    } catch (e) {
      console.warn('Lenis fallback:', e);
    }

    return () => lenis?.destroy();
  }, []);

  return (
    <HelmetProvider>
      <AuthProvider>
        <div className="min-h-screen bg-[#05070f] text-white selection:bg-[#fde047] selection:text-[#08060d] flex flex-col justify-between font-sans">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/services" element={<Services />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              {/* Authentication Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected Client Portal (Page 10) */}
              <Route
                path="/portal"
                element={
                  <ProtectedRoute>
                    <UserPortal />
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Portal (Page 11) */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminPortal />
                  </ProtectedRoute>
                }
              />

              {/* 404 Fallback */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </HelmetProvider>
  );
}
