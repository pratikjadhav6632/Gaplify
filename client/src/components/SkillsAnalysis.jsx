import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ChatBot from './ChatBot';
import axios from 'axios';

const SkillsAnalysis = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState([{ name: '', proficiency: 'Beginner' }]);

  // Prefill existing skills
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const { data } = await axios.get('http://localhost:5000/api/users/skills', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (data.skills && Array.isArray(data.skills) && data.skills.length) {
          setSkills(data.skills);
        }
      } catch (err) {
        console.error('Error fetching saved skills', err);
      }
    };
    fetchSkills();
  }, []);
  const [targetRole, setTargetRole] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddSkill = () => {
    setSkills([...skills, { name: '', proficiency: 'Beginner' }]);
  };

  const handleSkillChange = (index, field, value) => {
    const newSkills = [...skills];
    newSkills[index][field] = value;
    setSkills(newSkills);
  };

  const handleRemoveSkill = (index) => {
    const newSkills = skills.filter((_, i) => i !== index);
    setSkills(newSkills);
  };

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

      // First, save skills to user profile
      const skillsResponse = await axios.post('http://localhost:5000/api/users/skills', {
        skills: skills
      }, config);

      if (!skillsResponse.data.success) {
        throw new Error(skillsResponse.data.message || 'Failed to update skills');
      }

      // Then, get career analysis from Gemini API
      const analysisResponse = await axios.post('http://localhost:5000/api/analysis/career', {
        skills: skills,
        targetRole: targetRole
      }, config);

      setAnalysis(analysisResponse.data);
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
    <div className="max-w-4xl mx-auto ">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Skills & Career Analysis</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Skills Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Skills</h2>
            {skills.map((skill, index) => (
              <div key={index} className="flex items-center gap-4 mb-4">
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                  placeholder="Skill name"
                  className="input flex-1 border border-gray-300 rounded-md p-3"
                  required
                />
                <div className="flex items-center gap-2 w-48">
                 <select value={skill.proficiency} onChange={(e) => handleSkillChange(index, 'proficiency', e.target.value)} className='input flex-1 border border-gray-300 rounded-md p-3'>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                 </select>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddSkill}
              className="btn btn-primary bg-blue-500 text-white p-3 rounded-md justify-center flex w-full mt-2"
            >
              Add Skill
            </button>
          </div>

          {/* Target Role Selection */}
          <div className="mb-8">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Target Role
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="Enter your target role (e.g., Senior Frontend Developer, DevOps Engineer, Automotive Mechanic, etc.)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Be specific about the role you want to achieve. You can enter any role from any field.
            </p>
          </div>

          <button
            type="submit"
            className="btn btn-primary bg-blue-500 text-white p-3 rounded-md justify-center flex w-full"
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Analyze Career Path'}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="mt-8 space-y-6">
            <h2 className="text-2xl font-bold">Career Analysis</h2>
            
            {/* Skills Gap Analysis */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Skills Gap Analysis</h3>
              <div className="space-y-4">
                {analysis.skillsGap.map((gap, index) => (
                  <div key={index} className="bg-white p-4 rounded-md shadow-sm">
                    <h4 className="font-semibold text-blue-800">{gap.skill}</h4>
                    <p className="text-gray-600 mt-2">{gap.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Roadmap */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Learning Roadmap</h3>
              <div className="space-y-4">
                {analysis.roadmap.map((step, index) => (
                  <div key={index} className="bg-white p-4 rounded-md shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <h4 className="font-semibold text-green-800">{step.title}</h4>
                    </div>
                    <p className="text-gray-600 mt-2 ml-12">{step.description}</p>
                    {step.resources && step.resources.length > 0 && (
                      <div className="mt-4 ml-12">
                        <h5 className="font-semibold text-sm text-gray-700 mb-2">Recommended Skills/Topics:</h5>
                        <ul className="list-disc list-inside space-y-1">
                          {step.resources.map((resource, idx) => (
                            <li key={idx} className="text-gray-700">{resource.name}</li>
                          ))}
                        </ul>
                        <Link to="/resource-hub" className="btn btn-primary bg-blue-500 text-white p-3 rounded-md justify-center flex w-full mt-2">
                          Visit Resource Hub
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline Estimate */}
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Timeline Estimate</h3>
              <p className="text-gray-600">{analysis.timeline}</p>
            </div>
          </div>
        )}
      </div>
      <ChatBot />
    </div>
  );
};

export default SkillsAnalysis; 