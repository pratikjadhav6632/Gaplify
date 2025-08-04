import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config/api';
import { FaUser, FaEnvelope, FaBrain, FaQuestionCircle, FaFileContract, FaSignOutAlt, FaCrown, FaHistory, FaFile, FaInfoCircle, FaTimes } from 'react-icons/fa';
import { HiAcademicCap, HiSparkles } from 'react-icons/hi';
import PremiumModal from '../components/PremiumModal';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [premiumLoading, setPremiumLoading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const { user, logout } = useAuth();

  // Load Razorpay script dynamically
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

  // Start the premium purchase flow
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
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // your Razorpay key
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
              alert('Congratulations! You are now a premium user.');
              window.location.reload();
            } else {
              alert('Payment verification failed.');
            }
          } catch (err) {
            console.error('Verify error:', err);
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
      console.error('Payment flow error:', err);
      alert('Something went wrong, please try again.');
      setPremiumLoading(false);
    }
  };
  const navigate = useNavigate();
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

  const handleRemoveSkill = async (skillId) => {
    if (!skillId || isRemoving) return;
    
    try {
      setIsRemoving(true);
      const token = localStorage.getItem('token');
      const { data } = await axios.delete(
        `${API_URL}/api/users/skills/${skillId}`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (data.success) {
        // Update local state to remove the skill
        setProfile(prev => ({
          ...prev,
          skills: prev.skills.filter(skill => skill._id !== skillId)
        }));
      }
    } catch (err) {
      console.error('Error removing skill:', err);
      alert('Failed to remove skill. Please try again.');
    } finally {
      setIsRemoving(false);
    }
  };

  // Helper to check if user is premium
  const isPremium = (user?.planType || '').toLowerCase() === 'premium';
  
  // Helper to get unique skills by name (case-insensitive)
  const getUniqueSkills = (skills) => {
    const uniqueSkills = new Map();
    skills?.forEach(skill => {
      if (skill?.name) {
        const key = skill.name.trim().toLowerCase();
        if (!uniqueSkills.has(key)) {
          uniqueSkills.set(key, skill);
        }
      }
    });
    return Array.from(uniqueSkills.values());
  };
  
  // Get unique skills for display
  const uniqueSkills = getUniqueSkills(profile?.skills);

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
    <div className="min-h-screen bg-gray-50" style={{ backgroundColor: '#f9fafb' }}>
      <div className="container-responsive py-4 sm:py-6 lg:py-8">
        <div className="max-w-4xl mx-auto mobile-safe">
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-2">
              <div className="card mobile-padding" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
                      {profile?.username ? profile.username.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{profile?.username || user?.name || 'User'}</h2>
                      <p className="text-gray-600">{profile?.email || user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaCrown className="w-5 h-5 text-accent-500" />
                    <div className="relative group">
                      <button
                        className={`px-2 sm:px-3 py-1 rounded-full text-sm font-medium focus:outline-none ${
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
                      {isPremium && (
                        <div className="absolute -top-6 -right-6 p-2 bg-white rounded-lg shadow-md border border-gray-200 text-sm text-gray-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                          Premium until: {new Date(user.premiumExpiry).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <FaUser className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Username</p>
                      <p className="font-semibold text-sm sm:text-base text-gray-900">{profile?.username || 'Not set'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
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
                    {uniqueSkills && uniqueSkills.length > 0 ? (
                      <div className="mobile-grid gap-3">
                        {uniqueSkills.map((skill, idx) => (
                          <div key={skill._id || idx} className="skill-tag mobile-safe group relative pr-8">
                            <span className="font-medium mobile-text">{skill.name}</span>
                            <span className="ml-2 px-2 py-0.5 bg-primary-200 text-primary-800 rounded-full text-xs">
                              {skill.proficiency}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveSkill(skill._id);
                              }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors p-1"
                              disabled={isRemoving}
                              title="Remove skill"
                            >
                              <FaTimes className="w-3 h-3" />
                            </button>
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
              <div className="card mobile-padding" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
                <div className="space-y-4">
                  <button className="w-full btn btn-outline btn-sm group"
                    onClick={() => navigate('/history')}
                  >
                    <FaHistory className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                    History
                  </button>
                  <button className="w-full btn btn-outline btn-sm group"
                    onClick={() => navigate('/feedback')}
                  >
                    <FaInfoCircle className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                    Feedback
                  </button>
                  <button className="w-full btn btn-outline btn-sm group"
                    onClick={() => navigate('/privacy-policy')}
                  >
                    <FaFileContract className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                    Privacy Policy
                  </button>
                  <button className="w-full btn btn-outline btn-sm group"
                    onClick={() => navigate('/faq')}
                  >
                    <FaQuestionCircle className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                    FAQ
                  </button>
                  <button className="w-full btn btn-outline btn-sm group"
                    onClick={() => navigate('/terms-and-conditions')}
                  >
                    <FaFile className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                    Terms & Conditions
                  </button>
                  <button 
                    onClick={handleLogout} 
                    className="w-full btn btn-error btn-sm  bg-red-500 text-white group"
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
                    <span className="font-semibold text-secondary-600">{profile?.roadmapGenCount.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Resources Saved</span>
                    <span className="font-semibold text-accent-600">{profile?.resources?.length || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      <PremiumModal 
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onBuyPremium={handleBuyPremium}
        loading={premiumLoading}
      />
    </div>
  );
};

export default Profile;