import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Login from './components/Login';
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
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Mentors from './components/Mentors';
import Profile from './pages/Profile';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <div className="container mx-auto">
                <Routes>
                  <Route path="/login" element={<Login />} />
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
                </Routes>
              </div>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
