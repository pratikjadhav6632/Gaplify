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
import PremiumModal from './PremiumModal';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config/api';

const RoadmapPage = () => {
  const { user, setUser } = useAuth();
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);
  const [premiumLoading, setPremiumLoading] = useState(false);
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

  // --- Custom Table Extraction Logic ---
  // Extract the Monthly Summary Table section and parse it into rows/columns
  const extractMonthlySummaryTable = (markdown) => {
    if (!markdown) return null;
    const tableStart = markdown.indexOf('### Monthly Summary Table');
    if (tableStart === -1) return null;
    // Find the next header (## or ###) after the table
    const rest = markdown.slice(tableStart);
    const nextHeader = rest.search(/\n#{2,3} /);
    const tableSection = nextHeader === -1 ? rest : rest.slice(0, nextHeader);
    // Find the first markdown table in this section
    const tableMatch = tableSection.match(/\|(.|\n)*?\|\s*\n/);
    if (!tableMatch) return null;
    const tableText = tableMatch[0];
    // Parse markdown table to array of rows
    const rows = tableText.trim().split('\n').filter(Boolean).map(row => row.split('|').map(cell => cell.trim()).filter(Boolean));
    // Remove header separator row (---)
    if (rows.length > 1 && rows[1].every(cell => /^-+$/.test(cell))) rows.splice(1, 1);
    return rows;
  };

  // Remove the Monthly Summary Table section from the markdown
  const removeMonthlySummaryTable = (markdown) => {
    if (!markdown) return markdown;
    const tableStart = markdown.indexOf('### Monthly Summary Table');
    if (tableStart === -1) return markdown;
    const rest = markdown.slice(tableStart);
    const nextHeader = rest.search(/\n#{2,3} /);
    const before = markdown.slice(0, tableStart);
    const after = nextHeader === -1 ? '' : rest.slice(nextHeader);
    return before + after;
  };

  const monthlySummaryRows = useMemo(() => extractMonthlySummaryTable(roadmap), [roadmap]);
  const roadmapWithoutTable = useMemo(() => removeMonthlySummaryTable(roadmap), [roadmap]);

  // Split roadmap markdown into sections (each starts with ## ) so we can render them as separate cards
  const roadmapSections = useMemo(() => {
    if (!roadmapWithoutTable) return [];
    // Ensure each section keeps its heading by re-adding the delimiter
    const parts = roadmapWithoutTable.split(/\n(?=## )/g);
    return parts.filter(Boolean);
  }, [roadmapWithoutTable]);

  // --- End Custom Table Extraction Logic ---

  // MonthlySummaryTable component
  const MonthlySummaryTable = ({ rows }) => {
    if (!rows || rows.length < 2) return null;
    const headers = rows[0];
    const dataRows = rows.slice(1);
    return (
      <div className="overflow-x-auto my-6 rounded-lg border border-gray-400">
        <table className="min-w-full bg-white text-xs xs:text-sm sm:text-base border-collapse">
          <thead className="bg-indigo-50">
            <tr>
              {headers.map((header, i) => (
                <th key={i} className="px-3 py-2 font-semibold text-gray-700 text-left border border-gray-400 whitespace-nowrap">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row, i) => (
              <tr key={i} className="odd:bg-white even:bg-indigo-50">
                {row.map((cell, j) => (
                  <td key={j} className="px-3 py-2 align-top border border-gray-400 whitespace-pre-line break-words">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  const [error, setError] = useState(null);
  const roadmapRef = useRef(null);

  // Rotate loader messages
  useEffect(() => {
    let intervalId;
    if (loading) {
      intervalId = setInterval(() => {
        setLoadingMessageIndex(prev => (prev + 1) % loadingMessages.length);
      }, 3000); // change message every 2s
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
      // Detect usage limit error for free users (HTTP 403)
      if (
        err.response &&
        err.response.status === 403 &&
        err.response.data &&
        typeof err.response.data.message === 'string' &&
        err.response.data.message.toLowerCase().includes('free plan limit')
      ) {
        setPremiumModalOpen(true);
      }
      const errorMessage = err.response?.data?.details || err.response?.data?.error || err.message || 'Failed to generate roadmap. Please try again.';
      setError(errorMessage);
      console.error('Error generating roadmap:', err);
    } finally {
      setLoading(false);
    }
  };

  // Razorpay payment logic (adapted from Mentors/ChatBot)
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBuyPremium = async () => {
    setPremiumLoading(true);
    const res = await loadRazorpayScript();
    if (!res) {
      alert('Failed to load Razorpay SDK.');
      setPremiumLoading(false);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post('/api/payment/create-order', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!data.success) throw new Error('Order creation failed');
      const order = data.order;
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Gaplify',
        description: 'Premium Plan',
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post('/api/payment/verify', {
              order_id: order.id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature
            }, {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (verifyRes.data.success) {
              const userData = JSON.parse(localStorage.getItem('user'));
              userData.planType = 'premium';
              localStorage.setItem('user', JSON.stringify(userData));
              setUser(userData);
              alert('Congratulations! You are now a premium user.');
              window.location.reload();
              setPremiumModalOpen(false);
            } else {
              alert('Payment verification failed.');
            }
          } catch (err) {
            alert('Payment verification failed.');
          }
          setPremiumLoading(false);
        },
        prefill: {
          email: user?.email,
        },
        theme: {
          color: '#2563eb',
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert('Something went wrong, please try again.');
      setPremiumLoading(false);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-6 px-2 sm:px-4 md:px-6 lg:px-8">
      <div className="w-full max-w-5xl mx-auto">
        {/* Animated Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-14 md:mb-16"
        >
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 sm:mb-4 bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Build Your Learning Path
          </h1>
          <p className="text-base xs:text-lg sm:text-xl text-gray-600 max-w-xs xs:max-w-md sm:max-w-2xl mx-auto">
            AI-powered roadmap to master any skill efficiently
          </p>
          <div className="mt-4 sm:mt-6 h-1 w-16 sm:w-20 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mx-auto"></div>
        </motion.div>

        {/* Glowing Form Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative bg-white rounded-xl shadow-xl overflow-hidden mb-8 sm:mb-10 md:mb-12"
        >
          <div className="absolute -top-20 -right-20 w-40 h-40 xs:w-56 xs:h-56 sm:w-64 sm:h-64 bg-purple-200 rounded-full filter blur-3xl opacity-30"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 xs:w-56 xs:h-56 sm:w-64 sm:h-64 bg-indigo-200 rounded-full filter blur-3xl opacity-30"></div>
          
          <div className="relative z-10 p-4 xs:p-6 sm:p-8">
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

              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
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
            {/* Render Monthly Summary Table if present */}
            {monthlySummaryRows && (
              <MonthlySummaryTable rows={monthlySummaryRows} />
            )}
            <div className="flex flex-col xs:flex-row justify-end gap-2 xs:gap-3 items-end xs:items-center w-full mt-2 mb-4 xs:mb-0">
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
              className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 w-full"
            >
              {/* Roadmap Header */}
              <div className="p-4 xs:p-6 sm:p-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold mb-1 xs:mb-2">{formData.topic} Roadmap</h1>
                <div className="flex flex-wrap gap-2 xs:gap-3 mb-2 xs:mb-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm">
                    {formData.level.charAt(0).toUpperCase() + formData.level.slice(1)} Level
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm">
                    {formData.duration} Month{formData.duration !== '1' ? 's' : ''} Plan
                  </span>
                </div>
                <p className="opacity-90 text-xs xs:text-sm sm:text-base">Your personalized learning journey to mastery</p>
              </div>

              {/* Roadmap Content */}
              <div className="p-4 xs:p-6 sm:p-8 space-y-8 xs:space-y-10 sm:space-y-12 overflow-x-auto">
                {roadmapSections.map((section, idx) => {
                  const titleMatch = section.match(/^##\s+(.+)/m);
                  const title = titleMatch ? titleMatch[1].trim() : `Section ${idx + 1}`;
                  const body = titleMatch ? section.replace(/^##\s+.+\n?/, '') : section;
                  return (
                    <div key={idx} className="flex flex-col sm:grid sm:grid-cols-[auto,1fr] gap-4 xs:gap-6">
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
                      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-4 xs:p-6 sm:p-8 hover:shadow-xl transition-shadow duration-300 w-full">
                        <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 mb-2 xs:mb-4">
                          {title}
                        </h3>
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: ({ node, ...props }) => (
                              <h1
                                className="text-2xl xs:text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 xs:mb-6 sm:mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent break-words"
                                {...props}
                              />
                            ),
                            h2: ({ node, ...props }) => (
                              <div className="group mt-8 xs:mt-12 sm:mt-16 mb-4 xs:mb-6 sm:mb-8 flex flex-col xs:flex-row items-start xs:items-center gap-3 xs:gap-4">
                                <div className="flex-shrink-0 w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                  {getIconForHeading(props.children)}
                                </div>
                                <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 break-words" {...props} />
                              </div>
                            ),
                            h3: ({ node, ...props }) => (
                              <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mt-6 xs:mt-8 sm:mt-10 mb-2 xs:mb-4 flex items-center gap-2 xs:gap-3">
                                <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
                                {props.children}
                              </h3>
                            ),
                            p: ({ node, ...props }) => (
                              <p className="text-gray-600 mb-4 xs:mb-5 sm:mb-6 leading-relaxed text-sm xs:text-base" {...props} />
                            ),
                            ul: ({ node, ...props }) => (
                              <ul className="space-y-2 xs:space-y-3 mb-4 xs:mb-6 pl-4 xs:pl-6 border-l-2 border-indigo-100" {...props} />
                            ),
                            li: ({ node, ...props }) => (
                              <li className="flex items-start gap-2 xs:gap-3 text-gray-700 text-sm xs:text-base">
                                <span>{props.children}</span>
                              </li>
                            ),
                            blockquote: ({ node, ...props }) => (
                              <blockquote className="pl-2 xs:pl-4 border-l-4 border-purple-300 italic text-gray-600 my-4 xs:my-6" {...props} />
                            ),
                            strong: ({ node, ...props }) => (
                              <strong className="font-semibold text-gray-800" {...props} />
                            ),
                            code: ({ node, ...props }) => (
                              <code className="inline-block bg-gray-100 px-1 py-0.5 xs:px-1.5 xs:py-1 rounded-md text-xs xs:text-sm font-mono text-purple-600 break-words" {...props} />
                            ),
                            pre: ({ node, ...props }) => (
                              <pre className="bg-gray-900 text-gray-100 p-2 xs:p-4 rounded-lg overflow-x-auto text-xs xs:text-sm" {...props} />
                            ),
                            hr: ({ node, ...props }) => (
                              <hr className="my-6 xs:my-8 sm:my-12 border-t-2 border-dotted border-indigo-200" {...props} />
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

        <PremiumModal
          open={premiumModalOpen}
          onClose={() => setPremiumModalOpen(false)}
          onBuyPremium={handleBuyPremium}
          loading={premiumLoading}
        />

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
