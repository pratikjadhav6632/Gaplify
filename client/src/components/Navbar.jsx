import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaHome,FaAtlas  } from 'react-icons/fa';
import { HiAcademicCap } from 'react-icons/hi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: <FaHome className="w-4 h-4" /> },
    { path: '/skills-analysis', label: 'Skills Analysis',  protected: true },
    { path: '/trending-skills', label: 'Trending Skills',  protected: true },
    { path: '/roadmap', label: 'Roadmap', protected: true },
    { path: '/resource-hub', label: 'Resources', protected: true },
    { path: '/mentors', label: 'Mentors', protected: true },
    { path: '/history', label: 'History', protected: true }
  ];

  const filteredNavLinks = navLinks.filter(link => !link.protected || user);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-medium border-b border-gray-100' 
        : 'bg-white shadow-soft'
    }`}>
      <div className="container-responsive">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-white text-xl lg:text-2xl font-bold shadow-soft group-hover:shadow-glow transition-all duration-300">
              <HiAcademicCap />
            </div>
            <div className="flex flex-col">
              <span className="text-xl lg:text-2xl font-display font-bold gradient-text">Gaplify</span>
              <span className="text-xs text-gray-500 hidden sm:block">AI Career Bridge</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {filteredNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path) 
                    ? 'nav-link-active bg-primary-50 text-primary-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {user ? (
              <>
                {/* Cart */}
                <Link
                  to="/cart"
                  className="relative flex items-center p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 group"
                >
                  <FaAtlas className="w-5 h-5" />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-bounce-in">
                      {cart.length}
                    </span>
                  )}
                  <div className="tooltip-content">Library ({cart.length})</div>
                </Link>

                {/* Profile */}
                <Link 
                  to="/profile" 
                  className="flex items-center space-x-2 p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 group"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  <FaUser className="w-5 h-5 " />
                  </div>
                 
                </Link>

               
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-ghost btn-sm"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn btn-primary btn-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <FaTimes className="w-6 h-6" />
            ) : (
              <FaBars className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 animate-fade-in-down">
            <div className="flex flex-col space-y-2">
              {filteredNavLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(link.path) 
                      ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="mr-3 text-lg">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
              
              {user && (
                <>
                  <div className="border-t border-gray-100 pt-4 mt-4">
                   
                    
                    <Link
                      to="/cart"
                      className="flex items-center justify-between px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center">
                        <FaAtlas className="w-5 h-5 mr-3" />
                        <span>Library</span>
                      </div>
                      {cart.length > 0 && (
                        <span className="bg-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                          {cart.length}
                        </span>
                      )}
                    </Link>
                    
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaUser className="w-5 h-5 mr-3" />
                      <span>Profile</span>
                    </Link>
                    
                  
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;