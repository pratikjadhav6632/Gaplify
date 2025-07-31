import { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import ChatBot from './ChatBot';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Contact = () => {
  const { user, loading } = useAuth();
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    message: '' 
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  const PrivateRoute = ({ children }) => {
    if (loading) {
      return <div className="flex items-center justify-center min-h-screen text-sky-600">Loading...</div>;
    }
    return user ? children : <Navigate to="/login" />;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus({
      type: 'success',
      message: 'Thank you for reaching out! We will get back to you shortly.',
    });
    setFormData({ name: '', email: '', message: '' });
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen text-sky-600">Loading...</div>;

  return (
    <section className="bg-white min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-sky-100">
          <h1 className="text-4xl font-extrabold mb-8 text-center text-sky-600">Contact Us</h1>
          
          <div className="grid gap-16 lg:grid-cols-2">
            {/* Contact Details */}
            <div className="space-y-6 order-2 lg:order-1">
              <p className="text-gray-600 max-w-md">
                Have questions or feedback? We'd love to hear from you. Fill out the form and we'll respond as soon as possible.
              </p>

              <div className="flex items-start gap-4">
                <FaEnvelope className="text-sky-500 text-xl mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Email</h3>
                  <a href="mailto:gaplify@email.com" className="hover:underline text-sky-600">
                    gaplify@email.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FaPhone className="text-sky-500 text-xl mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Phone</h3>
                  <a href="tel:+11234567890" className="hover:underline text-sky-600">
                    +1 (123) 456-7890
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FaMapMarkerAlt className="text-sky-500 text-xl mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Address</h3>
                  <p className="text-gray-600">123 Web Dev Street<br />Tech City, TC 12345</p>
                </div>
              </div>

              <div className="flex gap-5 pt-2 text-2xl">
                <a href="#" aria-label="Facebook" className="hover:text-sky-500 transition-colors text-gray-500"><FaFacebook /></a>
                <a href="#" aria-label="Twitter" className="hover:text-sky-400 transition-colors text-gray-500"><FaTwitter /></a>
                <a href="#" aria-label="LinkedIn" className="hover:text-sky-600 transition-colors text-gray-500"><FaLinkedin /></a>
              </div>

              <div className="h-56 w-full overflow-hidden rounded-lg shadow-md mt-4 border border-sky-100">
                <iframe
                  title="Gaplify location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509814!2d144.95373531560326!3d-37.816279742610515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d43fb0e6f35%3A0xb25a31c1193c5e13!2sFederation%20Square!5e0!3m2!1sen!2sus!4v1614312394390!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  allowFullScreen=""
                  loading="lazy"
                  className="border-0"
                ></iframe>
              </div>
            </div>

            {/* Contact Form */}
            <div className="order-1 lg:order-2">
              <form onSubmit={handleSubmit} className="space-y-5">
                {status.message && (
                  <div className={`p-4 rounded-lg text-center ${status.type === 'success' ? 'bg-sky-100 text-sky-700' : 'bg-red-100 text-red-700'}`}>
                    {status.message}
                  </div>
                )}
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 transition-all"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 transition-all"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-700">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Enter your message"
                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-gray-800 transition-all"
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-sky-500 hover:bg-sky-600 font-semibold text-white transition-all duration-300 shadow-md hover:shadow-sky-200"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      <PrivateRoute>
        <ChatBot />
      </PrivateRoute>
    </section>
  );
};

export default Contact;