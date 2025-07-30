import { Link } from 'react-router-dom';
import { FaTwitter, FaLinkedin, FaGithub, FaEnvelope, FaPhone, FaMapMarkerAlt, FaRocket, FaGraduationCap } from 'react-icons/fa';
import { HiAcademicCap, HiSparkles } from 'react-icons/hi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container-responsive py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-white text-xl font-bold mr-4">
                <HiAcademicCap />
              </div>
              <div>
                <h3 className="text-2xl font-bold gradient-text">Gaplify</h3>
                <p className="text-sm text-gray-400">AI Career Bridge</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Empowering learners with AI-driven guidance and personalized career development resources.
            </p>
            <p className="text-gray-400 italic text-sm">
              "Bridging the gap between ambition and achievement."
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200">
                <FaLinkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200">
                <FaGithub className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <FaRocket className="w-5 h-5 mr-2 text-primary-500" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-primary-400 transition-colors duration-200 flex items-center">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/skills-analysis" className="text-gray-300 hover:text-primary-400 transition-colors duration-200 flex items-center">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                  Skills Analysis
                </Link>
              </li>
              <li>
                <Link to="/roadmap" className="text-gray-300 hover:text-primary-400 transition-colors duration-200 flex items-center">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                  Learning Roadmap
                </Link>
              </li>
              <li>
                <Link to="/resource-hub" className="text-gray-300 hover:text-primary-400 transition-colors duration-200 flex items-center">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                  Resource Hub
                </Link>
              </li>
              <li>
                <Link to="/mentors" className="text-gray-300 hover:text-primary-400 transition-colors duration-200 flex items-center">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                  Mentors
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <HiAcademicCap className="w-5 h-5 mr-2 text-secondary-500" />
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-secondary-400 transition-colors duration-200 flex items-center">
                  <span className="w-2 h-2 bg-secondary-500 rounded-full mr-3"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-secondary-400 transition-colors duration-200 flex items-center">
                  <span className="w-2 h-2 bg-secondary-500 rounded-full mr-3"></span>
                  Contact
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-secondary-400 transition-colors duration-200 flex items-center">
                  <span className="w-2 h-2 bg-secondary-500 rounded-full mr-3"></span>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-secondary-400 transition-colors duration-200 flex items-center">
                  <span className="w-2 h-2 bg-secondary-500 rounded-full mr-3"></span>
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-secondary-400 transition-colors duration-200 flex items-center">
                  <span className="w-2 h-2 bg-secondary-500 rounded-full mr-3"></span>
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <FaGraduationCap className="w-5 h-5 mr-2 text-accent-500" />
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FaEnvelope className="w-5 h-5 text-accent-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 font-medium">Email</p>
                  <p className="text-gray-400 text-sm">gaplify@gmail.com</p>
                </div>
              </li>
            
              <li className="flex items-start">
                <FaMapMarkerAlt className="w-5 h-5 text-accent-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 font-medium">Address</p>
                  <p className="text-gray-400 text-sm">Pune , India</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-md">
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <HiSparkles className="w-5 h-5 mr-2 text-primary-500" />
              Stay Updated
            </h4>
            <p className="text-gray-400 mb-4 text-sm">
              Get the latest career insights and learning resources delivered to your inbox.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button className="px-6 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-r-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} Gaplify. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 