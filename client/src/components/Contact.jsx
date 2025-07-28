import { useState } from 'react';
import ChatBot from './ChatBot';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Contact = () => {

  const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) {
      return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }
    
    return user ? children : <Navigate to="/contact" />;
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    setStatus({
      type: 'success',
      message: 'Thank you for your message! We will get back to you soon.',
    });
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
            <p className="text-gray-600 mb-6">
              Have questions or feedback? We'd love to hear from you. Fill out the form
              and we'll get back to you as soon as possible.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-gray-600">example@email.com</p>
              </div>
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p className="text-gray-600">(123) 456-7890</p>
              </div>
              <div>
                <h3 className="font-semibold">Address</h3>
                <p className="text-gray-600">123 Web Dev Street<br />Tech City, TC 12345</p>
              </div>
            </div>
          </div>
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {status.message && (
                <div
                  className={`p-4 rounded-md ${
                    status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {status.message}
                </div>
              )}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  placeholder="Enter your name"
                  onChange={handleChange}
                  className="input  border rounded-md w-full p-3"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input  border rounded-md w-full p-3"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  placeholder="Enter your message"
                  onChange={handleChange}
                  rows="4"
                  className="input  border rounded-md w-full p-3"
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary bg-blue-500 text-white p-3 rounded-md justify-center flex w-full">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
      <PrivateRoute>

      <ChatBot />
      </PrivateRoute>
    </div>
  );
};

export default Contact; 