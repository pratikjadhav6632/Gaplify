import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import axios from 'axios';
import FacebookPixel from './components/FacebookPixel';

// Structured Data Markup
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Gaplify",
  "description": "AI-powered career development platform bridging the gap between ambition and achievement",
  "url": "https://www.gaplify.com",
  "logo": "https://www.gaplify.com/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-555-0123",
    "contactType": "customer service"
  },
  "sameAs": [
    "https://www.linkedin.com/company/gaplify",
    "https://twitter.com/gaplify",
    "https://www.instagram.com/gaplify/",
    "https://www.facebook.com/gaplify"
  ]
};


import { API_URL } from './config/api';

// Configure axios to use the backend base URL for every request
axios.defaults.baseURL = API_URL;

import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import Signup from './components/Signup';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import SkillsAnalysis from './components/SkillsAnalysis';
import RoadmapPage from './components/RoadmapPage';
import TrendingSkills from './components/TrendingSkills';
import History from './components/History';
import ResourceHub from './pages/ResourceHub';
import Cart from './pages/Cart';
import Blog from './components/Blog';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Mentors from './components/Mentors';
import Profile from './pages/Profile';
import initAnimations from './utils/animations';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsConditions from './pages/legal/TermsConditions';
import FAQ from './pages/legal/FAQ';
import Feedback from './pages/Feedback';

// Set up axios interceptor to automatically include auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 responses globally
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="loading-spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  useEffect(() => {
    // Initialize animations when the app loads
    initAnimations();
    
    // Add structured data to the document
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <FacebookPixel />
        <Router>
          <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <main className="flex-1 relative">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/"
                  element={
                    <Home />
                  }
                />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route
                  path="/skills-analysis"
                  element={
                    <PrivateRoute>
                      <SkillsAnalysis />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/roadmap"
                  element={
                    <PrivateRoute>
                      <RoadmapPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/trending-skills"
                  element={
                    <PrivateRoute>
                      <TrendingSkills />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/resource-hub"
                  element={
                    <PrivateRoute>
                      <ResourceHub />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/blog"
                  element={
                    <PrivateRoute>
                      <Blog />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/blog/:slug"
                  element={
                    <PrivateRoute>
                      <Blog />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <PrivateRoute>
                      <Cart />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/mentors"
                  element={
                    <PrivateRoute>
                      <Mentors />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/history"
                  element={
                    <PrivateRoute>
                      <History />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />
                      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/terms-and-conditions" element={<TermsConditions />} />
                <Route path="/faq" element={<FAQ />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
