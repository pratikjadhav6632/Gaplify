import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Gaplify.in</h3>
            <p className="text-gray-300 mb-2">
              Empowering learners with AI-driven guidance and resources.
            </p>
            <p className="text-gray-400 italic">
              "Bridging the gap between ambition and achievement."
            </p>
          </div>
        
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-gray-300 hover:text-white transition-colors">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">About Us</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/About" className="text-gray-300 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/Contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/Privacy & policies" className="text-gray-300 hover:text-white transition-colors">
                  Privacy & Policies
                </Link>
              </li>
            </ul>
          </div>
    
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Email: example@email.com</li>
              <li>Phone: (123) 456-7890</li>
              <li>Address: 123 Web Dev Street</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} Gaplify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 