import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config/api';
import { FaPaperPlane, FaUser, FaEnvelope, FaRegCommentDots, FaHeading } from 'react-icons/fa';

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      await axios.post(`${API_URL}/api/feedback`, formData);
      setSuccess('Thank you for your feedback!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to send feedback. Please try again.'
      );
    }
    setLoading(false);
  };

  const inputStyle =
    'w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white/70 backdrop-blur-sm';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-primary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8 p-10 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-primary-600 flex items-center justify-center gap-3">
            <FaRegCommentDots className="w-8 h-8" /> Share Your Feedback
          </h2>
          <p className="mt-2 text-gray-600">We value your thoughts and suggestions to improve Gaplify!</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="sr-only">Name</label>
              <div className="relative">
                <FaUser className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className={`${inputStyle} pl-10`}
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <div className="relative">
                <FaEnvelope className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className={`${inputStyle} pl-10`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="subject" className="sr-only">Subject</label>
            <div className="relative">
              <FaHeading className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400" />
              <input
                id="subject"
                name="subject"
                type="text"
                required
                className={`${inputStyle} pl-10`}
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label htmlFor="message" className="sr-only">Message</label>
            <textarea
              id="message"
              name="message"
              rows={6}
              required
              className={inputStyle}
              placeholder="Your message..."
              value={formData.message}
              onChange={handleChange}
            ></textarea>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}
          <button
            type="submit"
            className="w-full btn btn-primary btn-lg flex items-center justify-center gap-2 group"
            disabled={loading}
          >
            {loading ? 'Sending...' : (
              <>
                <FaPaperPlane className="w-5 h-5 group-hover:animate-bounce" /> Send Feedback
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
