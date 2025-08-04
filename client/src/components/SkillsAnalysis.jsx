import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ChatBot from './ChatBot';
import axios from 'axios';
import { API_URL } from '../config/api';
import { FaPlus, FaTrash, FaChartLine, FaRoad, FaClock, FaLightbulb, FaGraduationCap, FaRocket } from 'react-icons/fa';
import { TbTargetArrow, TbBrain, TbTrendingUp } from 'react-icons/tb';
import { HiAcademicCap } from 'react-icons/hi';

const SkillsAnalysis = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState([{ name: '', proficiency: 'Beginner' }]);



  // Prefill existing skills with deduplication
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const { data } = await axios.get(`${API_URL}/api/users/skills`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (data.skills && Array.isArray(data.skills) && data.skills.length) {
          // Deduplicate skills by name (case-insensitive)
          const uniqueSkillsMap = new Map();
          data.skills.forEach(skill => {
            if (skill?.name) {
              const key = skill.name.trim().toLowerCase();
              if (!uniqueSkillsMap.has(key)) {
                uniqueSkillsMap.set(key, skill);
              }
            }
          });
          
          const uniqueSkills = Array.from(uniqueSkillsMap.values());
          
          // Only update state if we have skills to display
          if (uniqueSkills.length > 0) {
            setSkills(uniqueSkills);
          } else {
            // If no skills, ensure we have at least one empty field
            setSkills([{ name: '', proficiency: 'Beginner' }]);
          }
        }
      } catch (err) {
        console.error('Error fetching saved skills', err);
        // Ensure we always have at least one skill field
        setSkills([{ name: '', proficiency: 'Beginner' }]);
      }
    };
    
    fetchSkills();
  }, []);
  
  const [targetRole, setTargetRole] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [duplicateError, setDuplicateError] = useState('');
  const loadingMessages = [
    'Evaluating your skills...',
    'Identifying gaps...',
    'Mapping to career roles...',
    'Fetching growth resources...',
    'Almost done...'
  ];
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [error, setError] = useState('');

  const handleAddSkill = () => {
    // Check if the last skill is empty before adding a new one
    if (skills.length > 0 && !skills[skills.length - 1].name.trim()) {
      setDuplicateError('Please fill in the current skill before adding a new one');
      return;
    }
    
    // Check if the last skill is a duplicate
    if (skills.length > 0) {
      const lastSkill = skills[skills.length - 1];
      const isDuplicate = skills.slice(0, -1).some(skill => 
        skill.name.trim().toLowerCase() === lastSkill.name.trim().toLowerCase()
      );
      
      if (isDuplicate) {
        setDuplicateError('This skill has already been added');
        return;
      }
    }
    
    setSkills([...skills, { name: '', proficiency: 'Beginner' }]);
    setDuplicateError('');
  };

  const handleSkillChange = (index, field, value) => {
    const newSkills = [...skills];
    
    // If changing the skill name, check for duplicates
    if (field === 'name') {
      const trimmedValue = value.trim();
      const normalizedValue = trimmedValue.toLowerCase();
      
      // Check for duplicates in other fields
      const isDuplicate = newSkills.some((skill, i) => 
        i !== index && 
        skill.name.trim().toLowerCase() === normalizedValue &&
        normalizedValue !== ''
      );
      
      if (isDuplicate) {
        setDuplicateError('This skill has already been added');
        return;
      } else {
        setDuplicateError('');
      }
      
      // Update the value
      newSkills[index][field] = value;
    } else {
      newSkills[index][field] = value;
    }
    
    setSkills(newSkills);
  };

  const handleRemoveSkill = (index) => {
    const newSkills = skills.filter((_, i) => i !== index);
    setSkills(newSkills);
  };

  // Rotate loader messages
  useEffect(() => {
    let intervalId;
    if (loading) {
      intervalId = setInterval(() => {
        setLoadingMessageIndex(prev => (prev + 1) % loadingMessages.length);
      }, 2000);
    } else {
      setLoadingMessageIndex(0);
    }
    return () => clearInterval(intervalId);
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Configure axios headers
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      // Fire both requests in parallel to cut total waiting time
      const skillsPromise = axios.post(`${API_URL}/api/users/skills`, {
        skills
      }, config);

      const analysisPromise = axios.post(`${API_URL}/api/analysis/career`, {
        skills,
        targetRole
      }, config);

      // Wait primarily for analysis – this is what the user cares about
      const analysisResponse = await analysisPromise;
      setAnalysis(analysisResponse.data);

      // Handle skill-persistence result without blocking UI
      skillsPromise
        .then(res => {
          if (!res.data.success) {
            console.warn('Skill update failed:', res.data.message);
          }
        })
        .catch(err => {
          console.warn('Error updating skills:', err);
        });
    } catch (err) {
      console.error('Error details:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'An error occurred while updating skills or analyzing career path'
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-responsive">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in-up">
            <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
              <TbTargetArrow className="w-4 h-4 mr-2" />
              Skills Analysis
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
              Analyze Your
              <span className="gradient-text block">Career Path</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get personalized insights into your skills gap and a roadmap to your dream career
            </p>
          </div>

          <div className="card p-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Skills Section */}
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-white mr-4">
                    <TbBrain className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">Your Skills</h2>
                    <p className="text-gray-600">Add your current skills and proficiency levels</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {skills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200"
                    >
                      <div className="flex-1">
                        <input
                          type="text"
                          value={skill.name}
                          onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                          placeholder="Enter skill name (e.g., JavaScript, Project Management, Design)"
                          className={`form-input w-full text-base ${duplicateError ? 'border-error-500' : ''}`}
                          required
                          onFocus={() => setDuplicateError('')}
                        />
                        {duplicateError && (
                          <p className="mt-1 text-sm text-error-600">{duplicateError}</p>
                        )}
                      </div>
                      <div className="w-full md:w-48">
                        <select
                          value={skill.proficiency}
                          onChange={(e) => handleSkillChange(index, 'proficiency', e.target.value)}
                          className="form-input w-full text-base"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                       
                        {duplicateError && (
                          <p className="text-sm text-error-600 text-center">{duplicateError}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(index)}
                        className="p-2 text-error-600 hover:text-error-700 hover:bg-error-50 rounded-lg transition-colors duration-200 self-end md:self-auto"
                        disabled={skills.length === 1}
                        aria-label="Remove skill"
                      >
                        <FaTrash className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
                
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="btn btn-outline btn-sm mt-4 group"
                >
                  <FaPlus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-200" />
                  Add Another Skill
                </button>
              </div>

              {/* Target Role Selection */}
              <div className="border-t border-gray-200 pt-8">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-secondary-500 to-accent-500 rounded-xl flex items-center justify-center text-white mr-4">
                    <FaRocket className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">Target Role</h2>
                    <p className="text-gray-600">What position are you aiming for?</p>
                  </div>
                </div>
                
                <div>
                  <label className="form-label">
                    Target Role
                  </label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g., Senior Frontend Developer, DevOps Engineer, Product Manager, Data Scientist"
                    className="form-input text-lg"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Be specific about the role you want to achieve. You can enter any role from any industry.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="border-t border-gray-200 pt-8">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-full group"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {loadingMessages[loadingMessageIndex]}
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <TbTrendingUp className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                      Analyze Career Path
                    </div>
                  )}
                </button>
              </div>
            </form>

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 bg-error-50 border border-error-200 rounded-xl">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-error-500 rounded-full mr-3"></div>
                  <p className="text-error-700 font-medium">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* Analysis Results */}
          {analysis && (
            <div className="mt-8 space-y-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-2">Your Career Analysis</h2>
                <p className="text-gray-600">Here's your personalized career roadmap</p>
              </div>
              
              {/* Skills Gap Analysis */}
              <div className="card p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-white mr-4">
                    <FaChartLine className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900">Skills Gap Analysis</h3>
                    <p className="text-gray-600">Skills you need to develop for your target role</p>
                  </div>
                </div>
                
                <div className="grid gap-4">
                  {analysis.skillsGap.map((gap, index) => (
                    <div key={index} className="p-6 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl border border-primary-100">
                      <h4 className="font-semibold text-primary-800 text-lg mb-2">{gap.skill}</h4>
                      <p className="text-gray-700 leading-relaxed">{gap.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Learning Roadmap */}
              <div className="card p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-accent-500 rounded-xl flex items-center justify-center text-white mr-4">
                    <FaRoad className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900">Learning Roadmap</h3>
                    <p className="text-gray-600">Step-by-step guide to achieve your career goals</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {analysis.roadmap.map((step, index) => (
                    <div key={index} className="relative">
                      <div className="flex items-start">
                        <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-success-600 text-white rounded-full flex items-center justify-center font-bold text-lg mr-6 flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-success-800 text-xl mb-3">{step.title}</h4>
                          <p className="text-gray-700 leading-relaxed mb-4">{step.description}</p>
                          
                          {step.resources && step.resources.length > 0 && (
                            <div className="bg-white p-6 rounded-xl border border-gray-200">
                              <div className="flex items-center mb-4">
                                <FaLightbulb className="w-5 h-5 text-warning-500 mr-2" />
                                <h5 className="font-semibold text-gray-900">Recommended Learning Resources</h5>
                              </div>
                              <div className="grid gap-2 mb-4">
                                {step.resources.map((resource, idx) => (
                                  <div key={idx} className="flex items-center p-3 bg-gray-50 rounded-lg">
                                    <FaGraduationCap className="w-4 h-4 text-primary-600 mr-3" />
                                    <span className="text-gray-700">{resource.name}</span>
                                  </div>
                                ))}
                              </div>
                              <Link 
                                to="/resource-hub" 
                                className="btn btn-primary btn-sm inline-flex items-center"
                              >
                                <HiAcademicCap className="w-4 h-4 mr-2" />
                                Explore Resources
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {index < analysis.roadmap.length - 1 && (
                        <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-200"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline Estimate */}
              <div className="card p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-primary-500 rounded-xl flex items-center justify-center text-white mr-4">
                    <FaClock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900">Timeline Estimate</h3>
                    <p className="text-gray-600">Expected time to reach your career goal</p>
                  </div>
                </div>
                
                <div className="p-6 bg-gradient-to-r from-accent-50 to-primary-50 rounded-xl border border-accent-100">
                  <p className="text-lg text-gray-700 leading-relaxed">{analysis.timeline}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
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
  );
};

export default SkillsAnalysis;