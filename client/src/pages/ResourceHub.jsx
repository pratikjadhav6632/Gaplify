import React, { useState } from 'react';
import ResourceCard from '../components/ResourceCard';
import { trendingResources } from '../data/trendingResources';
import ChatBot from '../components/ChatBot';
import PremiumModal from '../components/PremiumModal';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
console.log('RAZORPAY KEY (frontend):', import.meta.env.VITE_RAZORPAY_KEY_ID);
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
        name: 'SkillBridge AI',
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
        <div className="text-center py-24">
          <h2 className="text-3xl font-bold mb-4 text-blue-700">Premium Feature</h2>
          <p className="text-lg text-gray-700 mb-6">Resource Hub is available for Premium users only.</p>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold text-lg"
            onClick={handleBuyPremium}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Buy Premium'}
          </button>
        </div>
      </>
    );
  }

  const categories = ['all', 'programming', 'design', 'business', 'marketing'];

  const filteredResources = trendingResources
    .filter(resource => 
      selectedCategory === 'all' || resource.category === selectedCategory
    )
    .filter(resource =>
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Resource Hub</h1>
        <p className="text-lg text-gray-600">
          Discover trending skills and resources to boost your career
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg
            className="absolute right-3 top-3.5 h-5 w-5 text-gray-400"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      
      {/* Category Filter */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Filter by Category</h2>
        <div className="flex flex-wrap gap-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredResources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>

      {/* Empty State */}
      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No resources found</h3>
          <p className="mt-1 text-gray-500">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      )}

      {/* Stats Section */}
      <div className="mt-16 bg-gray-50 rounded-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-blue-500 mb-2">
              {trendingResources.length}
            </h3>
            <p className="text-gray-600">Total Resources</p>
          </div>
          <div className="text-center">
            <h3 className="text-3xl font-bold text-green-500 mb-2">
              {categories.length - 1}
            </h3>
            <p className="text-gray-600">Categories</p>
          </div>
          <div className="text-center">
            <h3 className="text-3xl font-bold text-purple-500 mb-2">
              {Math.round(trendingResources.reduce((acc, curr) => acc + curr.rating, 0) / trendingResources.length * 10) / 10}
            </h3>
            <p className="text-gray-600">Average Rating</p>
          </div>
        </div>
      </div>
      <ChatBot />
    </div>
  );
};

export default ResourceHub; 