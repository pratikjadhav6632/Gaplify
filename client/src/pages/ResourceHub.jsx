import React, { useState } from 'react';
import ResourceCard from '../components/ResourceCard';
import { trendingResources } from '../data/trendingResources';
import ChatBot from '../components/ChatBot';
import PremiumModal from '../components/PremiumModal';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaSearch, FaFilter, FaBook, FaCode, FaPalette, FaChartLine, FaRocket, FaStar } from 'react-icons/fa';
import { HiLightningBolt, HiSparkles } from 'react-icons/hi';

const ResourceHub = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useAuth();

  React.useEffect(() => {
    if (user && user.planType !== 'premium') {
      setModalOpen(true);
    }
  }, [user]);

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
    setLoading(true);
    const res = await loadRazorpayScript();
    if (!res) {
      alert('Failed to load Razorpay SDK.');
      setLoading(false);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post('/api/payment/create-order', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Order creation response:', data);
      if (!data.success) throw new Error('Order creation failed');
      const order = data.order;
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // fallback for dev
        amount: order.amount,
        currency: order.currency,
        name: 'Gaplify',
        description: 'Premium Plan',
        order_id: order.id,
        handler: async function (response) {
          console.log('Razorpay handler called', response);
          try {
            const verifyRes = await axios.post('/api/payment/verify', {
              order_id: order.id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature
            }, {
              headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Verify response:', verifyRes.data);
            if (verifyRes.data.success) {
              // Refetch user or update context
              const userData = JSON.parse(localStorage.getItem('user'));
              userData.planType = 'premium';
              localStorage.setItem('user', JSON.stringify(userData));
              setUser(userData);
              alert('Congratulations! You are now a premium user.');
              // Reload page to reflect premium status
              window.location.reload();
              setModalOpen(false);
            } else {
              alert('Payment verification failed.');
            }
          } catch (err) {
            console.log('Verify error:', err);
            alert('Payment verification failed.');
          }
          setLoading(false);
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
      console.log('Payment flow error:', err);
      alert('Payment failed.');
      setLoading(false);
    }
  };

  if (user && user.planType !== 'premium') {
    return (
      <>
        <PremiumModal open={modalOpen} onClose={() => setModalOpen(false)} onBuyPremium={handleBuyPremium} loading={loading} />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-6">
              <FaBook className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold mb-4 gradient-text">Premium Feature</h2>
            <p className="text-lg text-gray-600 mb-8">Resource Hub is available for Premium users only.</p>
            <button
              className="btn btn-primary btn-lg group"
              onClick={handleBuyPremium}
              disabled={loading}
            >
              <FaRocket className="w-5 h-5 mr-2 group-hover:animate-bounce" />
              {loading ? 'Processing...' : 'Upgrade to Premium'}
            </button>
          </div>
        </div>
      </>
    );
  }

  const categories = [
    { id: 'all', name: 'All Resources', icon: FaBook },
    { id: 'programming', name: 'Programming', icon: FaCode },
    { id: 'design', name: 'Design', icon: FaPalette },
    { id: 'business', name: 'Business', icon: FaChartLine },
    { id: 'marketing', name: 'Marketing', icon: FaRocket }
  ];

  const filteredResources = trendingResources
    .filter(resource => 
      selectedCategory === 'all' || resource.category === selectedCategory
    )
    .filter(resource =>
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-responsive">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
            <FaBook className="w-4 h-4 mr-2" />
            Learning Resources
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            Resource
            <span className="gradient-text block">Hub</span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover trending skills and resources to boost your career
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8" style={{ animationDelay: '0.1s' }}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input pl-12 pr-4 py-4 text-lg"
            />
          </div>
        </div>
        
        {/* Category Filter */}
        <div className="mb-8" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center space-x-3 mb-6">
            <FaFilter className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">Filter by Category</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-200 group ${
                    selectedCategory === category.id
                      ? 'bg-primary-600 text-white shadow-medium'
                      : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-700 border border-gray-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 group-hover:scale-110 transition-transform ${
                    selectedCategory === category.id ? 'text-white' : 'text-gray-400'
                  }`} />
                  <span className="font-medium">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12" style={{ animationDelay: '0.3s' }}>
          {filteredResources.map((resource, index) => (
            <div key={resource.id} style={{ animationDelay: `${index * 0.1}s` }}>
              <ResourceCard resource={resource} />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredResources.length === 0 && (
          <div className="text-center py-16" style={{ animationDelay: '0.4s' }}>
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <HiSparkles className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="btn btn-outline"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Stats Section */}
        <div className="card p-8" style={{ animationDelay: '0.5s' }}>
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Resource Hub Stats</h3>
            <p className="text-gray-600">Your learning journey at a glance</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                {trendingResources.length}
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-1">Total Resources</h4>
              <p className="text-gray-600">Curated learning materials</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                {categories.length - 1}
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-1">Categories</h4>
              <p className="text-gray-600">Diverse skill domains</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-primary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                {Math.round(trendingResources.reduce((acc, curr) => acc + curr.rating, 0) / trendingResources.length * 10) / 10}
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-1">Average Rating</h4>
              <p className="text-gray-600">Community verified quality</p>
            </div>
          </div>
        </div>
      </div>
      <ChatBot />
    </div>
  );
};

export default ResourceHub; 