import React, { useState, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import html2pdf from 'html2pdf.js';
import { marked } from 'marked';
import { 
  FaDownload, 
  FaTrash,
  FaRocket, 
  FaBook, 
  FaCode, 
  FaTasks,
  FaGraduationCap,
  FaLightbulb,
  FaChartLine
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import ChatBot from './ChatBot';
import { API_URL } from '../config/api';

const RoadmapPage = () => {
  const [formData, setFormData] = useState({
    topic: '',
    level: 'beginner',
    duration: '3',
  });
  const [roadmap, setRoadmap] = useState(null);


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const roadmapRef = useRef(null);

  // Reset form
  const handleClear = () => {

    setRoadmap(null);
    setFormData({ topic: '', level: 'beginner', duration: '3' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRoadmap(null);

    try {
      const response = await axios.post(`${API_URL}/api/generate-roadmap`, formData);
      
      if (response.data.success) {
        setRoadmap(response.data.data);

      } else {
        throw new Error(response.data.error || 'Failed to generate roadmap');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.details || err.response?.data?.error || err.message || 'Failed to generate roadmap. Please try again.';
      setError(errorMessage);
      console.error('Error generating roadmap:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!roadmapRef.current) return;

    const element = roadmapRef.current;
    const opt = {
      margin: 10,
      filename: `${formData.topic.toLowerCase().replace(/\s+/g, '-')}-learning-roadmap.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(element).set(opt).save();
  };

  const getIconForHeading = (text) => {
    if (!text) return <FaChartLine className="text-indigo-500" />;
    
    const lowerText = text.toLowerCase();
    if (lowerText.includes('fundamentals')) return <FaGraduationCap className="text-blue-500" />;
    if (lowerText.includes('resources')) return <FaBook className="text-emerald-500" />;
    if (lowerText.includes('project')) return <FaCode className="text-purple-500" />;
    if (lowerText.includes('practice')) return <FaTasks className="text-amber-500" />;
    if (lowerText.includes('advanced')) return <FaLightbulb className="text-yellow-500" />;
    
    return <FaRocket className="text-indigo-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Animated Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Build Your Learning Path
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            AI-powered roadmap to master any skill efficiently
          </p>
          <div className="mt-6 h-1 w-20 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mx-auto"></div>
        </motion.div>

        {/* Glowing Form Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative bg-white rounded-xl shadow-xl overflow-hidden mb-12"
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-200 rounded-full filter blur-3xl opacity-30"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-200 rounded-full filter blur-3xl opacity-30"></div>
          
          <div className="relative z-10 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Generate Your Roadmap
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                  What skill do you want to master?
                </label>
                <input
                  type="text"
                  id="topic"
                  name="topic"
                  value={formData.topic}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                  placeholder="e.g., React, Machine Learning, UX Design"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
                    Current Skill Level
                  </label>
                  <select
                    id="level"
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                    Timeline (months)
                  </label>
                  <select
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                  >
                    <option value="1">1 Month</option>
                    <option value="3">3 Months</option>
                    <option value="6">6 Months</option>
                    <option value="12">12 Months</option>
                  </select>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  'Generate My Roadmap'
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>

        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-lg"
          >
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {roadmap && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="flex justify-end gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClear}
                className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200"
              >
                <FaTrash className="text-red-500" />
                Reset
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={downloadPDF}
                className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200"
              >
                <FaDownload className="text-indigo-500" />
                Download PDF
              </motion.button>
            </div>

            <div 
              ref={roadmapRef} 
              className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100"
            >
              {/* Roadmap Header */}
              <div className="p-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <h1 className="text-3xl font-bold mb-2">{formData.topic} Roadmap</h1>
                <div className="flex flex-wrap gap-3 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm">
                    {formData.level.charAt(0).toUpperCase() + formData.level.slice(1)} Level
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm">
                    {formData.duration} Month{formData.duration !== '1' ? 's' : ''} Plan
                  </span>
                </div>
                <p className="opacity-90">Your personalized learning journey to mastery</p>
              </div>

              {/* Roadmap Content */}
              <div className="p-8">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({node, ...props}) => (
                      <h1 className="text-2xl font-bold text-gray-800 mb-6" {...props} />
                    ),
                    h2: ({node, ...props}) => (
                      <div className="mt-12 mb-6 flex items-center gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                          {getIconForHeading(props.children)}
                        </div>
                        <h2 className="text-xl font-bold text-gray-800" {...props} />
                      </div>
                    ),
                    h3: ({node, ...props}) => (
                      <h3 className="text-lg font-semibold text-gray-800 mt-8 mb-4 flex items-center gap-3">
                        <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
                        {props.children}
                      </h3>
                    ),
                    p: ({node, ...props}) => (
                      <p className="text-gray-700 mb-6 leading-relaxed" {...props} />
                    ),
                    ul: ({node, ...props}) => (
                      <ul className="space-y-3 mb-6 pl-5" {...props} />
                    ),
                    li: ({node, ...props}) => (
                      <li className="text-gray-700 relative pl-5">
                        <span className="absolute left-0 top-2 w-2 h-2 bg-indigo-300 rounded-full"></span>
                        {props.children}
                      </li>
                    ),
                    a: ({node, ...props}) => (
                      <a 
                        href={props.href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
                      >
                        {props.children}
                      </a>
                    ),
                    strong: ({node, ...props}) => (
                      <strong className="font-semibold text-gray-800" {...props} />
                    ),
                    hr: ({node, ...props}) => (
                      <hr className="my-8 border-t border-gray-200" {...props} />
                    )
                  }}
                >
                  {roadmap}
                </ReactMarkdown>
              </div>
            </div>
          </motion.div>
        )}
        <ChatBot />
      </div>
    </div>
  );
};

export default RoadmapPage;