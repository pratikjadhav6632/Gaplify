import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config/api';
import { FaUser, FaEnvelope, FaBrain, FaCog, FaQuestionCircle, FaFileContract, FaSignOutAlt, FaCrown } from 'react-icons/fa';
import { HiAcademicCap, HiSparkles } from 'react-icons/hi';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  console.log('Profile component rendering - user:', user, 'loading:', loading);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(data.user);
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper to check if user is premium
  const isPremium = (user?.planType || '').toLowerCase() === 'premium';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" style={{ backgroundColor: '#f9fafb', minHeight: '100vh', padding: '2rem 0' }}>
      <div className="container-responsive">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
              <HiAcademicCap className="w-4 h-4 mr-2" />
              Your Profile
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              Welcome back,
              <span className="gradient-text block">{profile?.username || user?.name || 'User'}</span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto mb-6 rounded-full"></div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-2">
              <div className="card p-8" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {profile?.username ? profile.username.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{profile?.username || user?.name || 'User'}</h2>
                      <p className="text-gray-600">{profile?.email || user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaCrown className="w-5 h-5 text-accent-500" />
                    <button
                      className={`px-3 py-1 rounded-full text-sm font-medium focus:outline-none ${
                        isPremium
                          ? 'bg-accent-100 text-accent-800 cursor-default'
                          : 'bg-gray-100 text-gray-800 hover:bg-primary-200 hover:text-primary-900 cursor-pointer'
                      }`}
                      disabled={isPremium}
                      onClick={() => {
                        if (!isPremium) setShowUpgradeModal(true);
                      }}
                    >
                      {user?.planType || 'Free'}
                    </button>
                    <span className="text-sm text-gray-500 ">
                      {user.premiumExpiry && new Date(user.premiumExpiry).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <FaUser className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="text-sm text-gray-600">Username</p>
                      <p className="font-semibold text-gray-900">{profile?.username || 'Not set'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <FaEnvelope className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold text-gray-900">{profile?.email || user?.email}</p>
                    </div>
                  </div>

                  {/* Skills Section */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <FaBrain className="w-5 h-5 text-primary-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Your Skills</h3>
                    </div>
                    {profile?.skills && profile.skills.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {profile.skills.map((skill, idx) => (
                          <div key={idx} className="skill-tag">
                            <span className="font-medium">{skill.name}</span>
                            <span className="ml-2 px-2 py-0.5 bg-primary-200 text-primary-800 rounded-full text-xs">
                              {skill.proficiency}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <HiSparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">No skills added yet</p>
                        <button 
                          onClick={() => navigate('/skills-analysis')}
                          className="btn btn-primary btn-sm"
                        >
                          Add Your Skills
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Sidebar */}
            <div className="lg:col-span-1">
              <div className="card p-6" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
                <div className="space-y-4">
                  <button className="w-full btn btn-outline btn-sm group">
                    <FaFileContract className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                    Company Policy
                  </button>
                  <button className="w-full btn btn-outline btn-sm group">
                    <FaQuestionCircle className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                    FAQ
                  </button>
                  <button className="w-full btn btn-outline btn-sm group">
                    <FaCog className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                    Settings
                  </button>
                  <button 
                    onClick={handleLogout} 
                    className="w-full btn btn-error btn-sm group"
                  >
                    <FaSignOutAlt className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                    Logout
                  </button>
                </div>
              </div>

              {/* Stats Card */}
              <div className="card p-6 mt-6" style={{ animationDelay: '0.3s' }}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Skills Analyzed</span>
                    <span className="font-semibold text-primary-600">{profile?.skills?.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Roadmaps Created</span>
                    <span className="font-semibold text-secondary-600">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Resources Saved</span>
                    <span className="font-semibold text-accent-600">0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
            <h2 className="text-2xl font-bold mb-4">Upgrade to Premium</h2>
            <p className="mb-6">Unlock all features and get the most out of Gaplify!</p>
            <button
              className="btn btn-outline w-full"
              onClick={() => setShowUpgradeModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;