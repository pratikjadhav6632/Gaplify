import React from 'react';

const PremiumModal = ({ open, onClose, onBuyPremium, loading }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-2xl shadow-2xl p-8 max-w-md w-full relative border-2 border-blue-200">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 text-3xl transition"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <div className="flex flex-col items-center">
          <div className="mb-3">
            <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-500 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01z"/>
              </svg>
            </span>
          </div>
          <h2 className="text-3xl font-extrabold mb-2 text-blue-700 tracking-tight text-center">Unlock Premium</h2>
          <div className="mb-4 text-gray-700 text-center">
            <span className="block text-lg mb-1">This feature is for <span className="font-semibold text-blue-600">Premium</span> users only.</span>
            <span className="block text-base">Upgrade now for unlimited access!</span>
          </div>
          <div className="mb-6 flex flex-col items-center">
            <span className="text-gray-500 text-sm mb-1">Actual Price</span>
            <span className="text-2xl font-bold text-gray-400 line-through">₹299</span>
            <span className="text-green-600 text-lg font-semibold mt-1">Early Access Price</span>
            <span className="text-4xl font-extrabold text-green-700 mb-1">₹99</span>
            <span className="text-xs text-gray-500">Access lasts for 1 month</span>
            <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium mt-2 animate-pulse">You save ₹200!</span>
          </div>
          <button
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 rounded-lg font-semibold text-lg shadow-md transition mb-3 disabled:opacity-60"
            onClick={onBuyPremium}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Buy Premium'}
          </button>
          <button
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-medium border border-gray-200"
            onClick={onClose}
            disabled={loading}
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default PremiumModal;