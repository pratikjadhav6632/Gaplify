import React, { useState, useRef, useEffect, useMemo } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import html2pdf from 'html2pdf.js';
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
  const loadingMessages = [
    'Contacting AI engine...',
    'Fetching learning resources...',
    'Analyzing skill requirements...',
    'Crafting personalized roadmap...',
    'Almost there...'
  ];
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  // Split roadmap markdown into sections (each starts with ## ) so we can render them as separate cards
  const roadmapSections = useMemo(() => {
    if (!roadmap) return [];
    // Ensure each section keeps its heading by re-adding the delimiter
    const parts = roadmap.split(/\n(?=## )/g);
    return parts.filter(Boolean);
  }, [roadmap]);
  const [error, setError] = useState(null);
  const roadmapRef = useRef(null);

  // Rotate loader messages
  useEffect(() => {
    let intervalId;
    if (loading) {
      intervalId = setInterval(() => {
        setLoadingMessageIndex(prev => (prev + 1) % loadingMessages.length);
      }, 2000); // change message every 2s
    } else {
      setLoadingMessageIndex(0);
    }
    return () => clearInterval(intervalId);
  }, [loading]);

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
                  <div className="flex items-center gap-3">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {loadingMessages[loadingMessageIndex]}
                  </div>
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
              <div className="p-8 space-y-12">
                {roadmapSections.map((section, idx) => {
                  const titleMatch = section.match(/^##\s+(.+)/m);
                  const title = titleMatch ? titleMatch[1].trim() : `Section ${idx + 1}`;
                  const body = titleMatch ? section.replace(/^##\s+.+\n?/, '') : section;
                  return (
                    <div key={idx} className="grid sm:grid-cols-[auto,1fr] gap-6">
                      {/* Timeline Rail */}
                      <div className="flex flex-col items-center">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex items-center justify-center font-semibold">
                          {idx + 1}
                        </div>
                        {idx < roadmapSections.length - 1 && (
                          <div className="flex-1 w-px bg-purple-200"></div>
                        )}
                      </div>

                      {/* Card */}
                      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-shadow duration-300">
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                          {title}
                        </h3>
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: ({ node, ...props }) => (
                              <h1
                                className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
                              {...props}
                              />
                            ),
                            h2: ({ node, ...props }) => (
                              <div className="group mt-16 mb-8 flex items-center gap-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                  {getIconForHeading(props.children)}
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900" {...props} />
                              </div>
                            ),
                            h3: ({ node, ...props }) => (
                              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mt-10 mb-5 flex items-center gap-3">
                                <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
                                {props.children}
                              </h3>
                            ),
                            p: ({ node, ...props }) => (
                              <p className="text-gray-600 mb-6 leading-relaxed" {...props} />
                            ),
                            ul: ({ node, ...props }) => (
                              <ul className="space-y-3 mb-6 pl-6 border-l-2 border-indigo-100" {...props} />
                            ),
                            li: ({ node, ...props }) => (
                              <li className="flex items-start gap-3 text-gray-700">
                                {/* <FaCheckCircle className="text-purple-500 mt-1 flex-shrink-0" /> */}
                                <span>{props.children}</span>
                              </li>
                            ),
                            blockquote: ({ node, ...props }) => (
                              <blockquote className="pl-4 border-l-4 border-purple-300 italic text-gray-600 my-6" {...props} />
                            ),
                            strong: ({ node, ...props }) => (
                              <strong className="font-semibold text-gray-800" {...props} />
                            ),
                            code: ({ node, ...props }) => (
                              <code className="inline-block bg-gray-100 px-1.5 py-1 rounded-md text-sm font-mono text-purple-600" {...props} />
                            ),
                            pre: ({ node, ...props }) => (
                              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm" {...props} />
                            ),
                            hr: ({ node, ...props }) => (
                              <hr className="my-12 border-t-2 border-dotted border-indigo-200" {...props} />
                            )
                          }}
                        >
                          {body}
                        </ReactMarkdown>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
        <ChatBot />

          {loading && (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/70 backdrop-blur-md">
              <svg className="animate-spin h-12 w-12 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-6 text-lg font-medium text-indigo-700 animate-pulse">
                {loadingMessages[loadingMessageIndex]}
              </p>
            </div>
          )}
      </div>
    </div>
  );
};

export default RoadmapPage;