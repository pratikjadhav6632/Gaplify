import React, { useState, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import html2pdf from 'html2pdf.js';
import { marked } from 'marked';
import ChatBot from './ChatBot';

const RoadmapPage = () => {
  const [formData, setFormData] = useState({
    topic: '',
    level: 'beginner', // beginner, intermediate, advanced
    duration: '3', // months
  });
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const roadmapRef = useRef(null);

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
      const response = await axios.post('http://localhost:5000/api/generate-roadmap', formData);
      
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

    // Create a wrapper for PDF content
    const pdfWrapper = document.createElement('div');
    pdfWrapper.style.background = '#fff';
    pdfWrapper.style.padding = '40px';
    pdfWrapper.style.borderRadius = '18px';
    pdfWrapper.style.boxShadow = '0 2px 16px rgba(80, 80, 120, 0.08)';
    pdfWrapper.style.maxWidth = '800px';
    pdfWrapper.style.margin = '0 auto';
    pdfWrapper.style.fontFamily = 'Inter, Arial, sans-serif';
    pdfWrapper.style.color = '#1f2937';

    // Header Branding
    const header = document.createElement('div');
    header.style.textAlign = 'center';
    header.style.marginBottom = '40px';
    header.style.paddingBottom = '20px';
    header.style.borderBottom = '2px solid #e0e7ff';
    header.innerHTML = `
      <div style="font-size:2.5rem;font-weight:800;letter-spacing:-1px;color:#6366f1;display:inline-block;margin-bottom:12px;">Skill Bridge AI</div>
      <div style="font-size:1.2rem;color:#6366f1;margin-bottom:16px;font-weight:500;">Your AI-powered learning companion</div>
    `;
    pdfWrapper.appendChild(header);

    // Main Content
    const pdfContent = document.createElement('div');
    pdfContent.style.fontSize = '14px';
    pdfContent.style.lineHeight = '1.6';

    // Add roadmap title
    const roadmapTitle = document.createElement('h1');
    roadmapTitle.textContent = `Learning Roadmap: ${formData.topic}`;
    roadmapTitle.style.fontSize = '24px';
    roadmapTitle.style.fontWeight = '700';
    roadmapTitle.style.color = '#4f46e5';
    roadmapTitle.style.margin = '0 0 30px 0';
    roadmapTitle.style.textAlign = 'center';
    roadmapTitle.style.padding = '0 0 20px 0';
    roadmapTitle.style.borderBottom = '2px solid #e0e7ff';
    pdfContent.appendChild(roadmapTitle);

    // Add metadata
    const metadata = document.createElement('div');
    metadata.style.marginBottom = '30px';
    metadata.style.padding = '15px';
    metadata.style.background = '#f8fafc';
    metadata.style.borderRadius = '8px';
    metadata.innerHTML = `
      <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
        <span style="font-weight:600;color:#4b5563;">Current Level:</span>
        <span style="color:#1f2937;">${formData.level.charAt(0).toUpperCase() + formData.level.slice(1)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;">
        <span style="font-weight:600;color:#4b5563;">Duration:</span>
        <span style="color:#1f2937;">${formData.duration} Month${formData.duration !== '1' ? 's' : ''}</span>
      </div>
    `;
    pdfContent.appendChild(metadata);

    // Add the AI-generated roadmap content
    if (roadmap) {
      const contentDiv = document.createElement('div');
      contentDiv.innerHTML = marked.parse(roadmap);
      
      // Style the parsed content
      const styleSheet = document.createElement('style');
      styleSheet.textContent = `
        h2 { font-size: 20px; color: #4f46e5; margin: 25px 0 15px 0; font-weight: 600; }
        h3 { font-size: 16px; color: #1f2937; margin: 20px 0 10px 0; font-weight: 600; }
        h4 { font-size: 14px; color: #374151; margin: 15px 0 10px 0; font-weight: 600; }
        p { margin: 10px 0; color: #4b5563; }
        ul, ol { margin: 10px 0; padding-left: 20px; }
        li { margin: 8px 0; color: #4b5563; }
        a { color: #6366f1; text-decoration: none; }
        strong { color: #1f2937; }
        em { color: #4b5563; }
      `;
      contentDiv.appendChild(styleSheet);
      pdfContent.appendChild(contentDiv);
    }
    pdfWrapper.appendChild(pdfContent);

    // Footer Branding
    const footer = document.createElement('div');
    footer.style.textAlign = 'center';
    footer.style.marginTop = '40px';
    footer.style.paddingTop = '20px';
    footer.style.borderTop = '2px solid #e0e7ff';
    footer.style.fontSize = '12px';
    footer.style.color = '#6b7280';
    footer.innerHTML = `
      <div style="margin-bottom:8px;">Generated by <span style="font-weight:600;color:#6366f1;">Skill Bridge AI</span></div>
      <div style="font-style:italic;">Your AI-powered learning companion</div>
    `;
    pdfWrapper.appendChild(footer);

    const opt = {
      margin: [20, 20, 20, 20],
      filename: `${formData.topic.toLowerCase().replace(/\s+/g, '-')}-learning-roadmap.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        letterRendering: true
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait'
      }
    };

    html2pdf().set(opt).from(pdfWrapper).save();
  };

  const renderRoadmapSection = (content, type) => {
    const sectionStyles = {
      overview: 'bg-gradient-to-r from-blue-50 to-indigo-50',
      monthly: 'bg-gradient-to-r from-purple-50 to-pink-50',
      skills: 'bg-gradient-to-r from-green-50 to-teal-50',
      project: 'bg-gradient-to-r from-yellow-50 to-orange-50',
      resources: 'bg-gradient-to-r from-red-50 to-pink-50'
    };

    return (
      <div className={`${sectionStyles[type]} rounded-xl p-6 mb-6 border border-opacity-20 shadow-lg`}>
        {content}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 mb-8 border border-indigo-100">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-8 text-center">
            Generate Learning Roadmap
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                  What do you want to learn?
                </label>
                <input
                  type="text"
                  id="topic"
                  name="topic"
                  value={formData.topic}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  placeholder="e.g., Web Development, Machine Learning, Data Science"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Current Level
                  </label>
                  <select
                    id="level"
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                    Learning Duration (months)
                  </label>
                  <select
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  >
                    <option value="1">1 Month</option>
                    <option value="3">3 Months</option>
                    <option value="6">6 Months</option>
                    <option value="12">12 Months</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </span>
              ) : (
                'Generate Roadmap'
              )}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {roadmap && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={downloadPDF}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
              </button>
            </div>

            <div ref={roadmapRef} className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-indigo-100">
              <div className="prose prose-indigo max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({node, ...props}) => (
                      <div className="relative mb-12">
                        <div className="absolute -top-4 -left-4 w-8 h-8 bg-indigo-600 rounded-full opacity-20"></div>
                        <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-purple-600 rounded-full opacity-20"></div>
                        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-8 text-center relative z-10" {...props} />
                      </div>
                    ),
                    h2: ({node, ...props}) => {
                      const text = props.children[0];
                      let sectionType = 'overview';
                      
                      if (text.includes('Monthly')) sectionType = 'monthly';
                      else if (text.includes('Skills')) sectionType = 'skills';
                      else if (text.includes('Project')) sectionType = 'project';
                      else if (text.includes('Resources')) sectionType = 'resources';

                      return (
                        <div className="relative">
                          <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-indigo-600 rounded-full"></div>
                          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 flex items-center gap-2 pl-2" {...props} />
                        </div>
                      );
                    },
                    h3: ({node, ...props}) => (
                      <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3 flex items-center">
                        <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
                        {props.children}
                      </h3>
                    ),
                    h4: ({node, ...props}) => (
                      <h4 className="text-lg font-semibold text-gray-700 mt-4 mb-2 flex items-center">
                        <span className="w-1.5 h-1.5 bg-indigo-300 rounded-full mr-2"></span>
                        {props.children}
                      </h4>
                    ),
                    p: ({node, ...props}) => (
                      <p className="text-gray-600 mb-4 leading-relaxed" {...props} />
                    ),
                    ul: ({node, ...props}) => (
                      <ul className="list-none pl-6 mb-4 space-y-2" {...props} />
                    ),
                    ol: ({node, ...props}) => (
                      <ol className="list-decimal pl-6 mb-4 space-y-2 marker:text-indigo-600" {...props} />
                    ),
                    li: ({node, ...props}) => (
                      <li className="text-gray-600 flex items-start group">
                        <span className="w-1.5 h-1.5 bg-indigo-200 rounded-full mt-2 mr-2 group-hover:bg-indigo-400 transition-colors"></span>
                        <span {...props} />
                      </li>
                    ),
                    a: ({node, ...props}) => (
                      <a 
                        className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium underline decoration-2 underline-offset-2 hover:decoration-indigo-500 transition-all duration-200 group" 
                        target="_blank"
                        rel="noopener noreferrer"
                        {...props}
                      >
                        {props.children}
                        <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ),
                    strong: ({node, ...props}) => (
                      <strong className="font-semibold text-gray-800" {...props} />
                    ),
                    em: ({node, ...props}) => (
                      <em className="text-gray-700 italic" {...props} />
                    ),
                  }}
                >
                  {roadmap}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
      <ChatBot />
    </div>
  );
};

export default RoadmapPage; 