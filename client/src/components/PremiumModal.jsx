import React from 'react';

const PremiumModal = ({ open, onClose, onBuyPremium, loading }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-2 text-center text-blue-700">Premium Feature</h2>
        <div className="mb-4 text-gray-700 text-center">
          This feature is available for <span className="font-semibold text-blue-600">Premium</span> users only.<br/>
          Upgrade to unlock unlimited access!<br/>
          <span className="font-semibold text-green-700">Premium is ₹80/month. Access lasts for 1 month.</span>
        </div>
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-lg transition mb-2 disabled:opacity-60"
          onClick={onBuyPremium}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Buy Premium'}
        </button>
        <button
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-medium"
          onClick={onClose}
          disabled={loading}
        >
          Maybe Later
        </button>
      </div>
    </div>
  );
};

export default PremiumModal; 