import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/skills-analysis', label: 'Skills Analysis', protected: true },
    { path: '/trending-skills', label: 'Trending Skills', protected: true },
    { path: '/roadmap', label: 'Learning Roadmap', protected: true },
    { path: '/resource-hub', label: 'Resource Hub', protected: true },
    { path: '/mentors', label: 'Mentors', protected: true },
    {path:'/history',label:'History',protected:true}
  ];

  const filteredNavLinks = navLinks.filter(link => !link.protected || user);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-gray-800">
            Gaplify
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {filteredNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={` hover:text-blue-800 transition-colors ${
                  isActive(link.path) ? 'text-blue-700 font-semibold' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <Link
                to="/cart"
                className="relative text-gray-600 hover:text-gray-800"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Link>
            )}
            {user ? (
              <>
                {/* Profile Icon */}
                <Link to="/profile" className="text-gray-600 hover:text-gray-800">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                  </svg>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`text-gray-600 bg-blue-700 p-3 border-1 rounded-lg text-white ${
                    isActive('/login') ? 'text-blue-600 font-semibold' : ''
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn btn-primary border-1 bg-blue-600 text-white p-3 rounded-lg"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-600 hover:text-gray-800"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              {filteredNavLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-gray-600 hover:text-gray-800 ${
                    isActive(link.path) ? 'text-blue-600 font-semibold' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {user && (
                <Link
                  to="/cart"
                  className="flex items-center text-gray-600 hover:text-gray-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>Cart</span>
                  {cart.length > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </Link>
              )}
              {user ? (
                <>
                  {/* Profile Icon for mobile */}
                  <Link to="/profile" className="text-gray-600 hover:text-gray-800 flex items-center" onClick={() => setIsMenuOpen(false)}>
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                    </svg>
                    <span className="ml-2">Profile</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`text-gray-600 hover:text-gray-800 ${
                      isActive('/login') ? 'text-blue-600 font-semibold' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="btn btn-primary w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
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