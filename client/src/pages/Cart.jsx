import React from 'react';
import { useCart } from '../context/CartContext';
import ChatBot from '../components/ChatBot';
import { FaShoppingCart, FaTrash, FaEye, FaArrowLeft, FaAtlas, FaCheck } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaShoppingCart className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your library is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any resources to your library yet.</p>
          <a
            href="/resource-hub"
            className="btn btn-primary btn-lg group"
          >
            <FaArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Browse Resources
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-responsive">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-white">
                <FaAtlas  className="w-5 h-5" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Your Library</h1>
            </div>
            <p className="text-gray-600">{cart.length} item{cart.length !== 1 ? 's' : ''} in your library</p>
          </div>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear your library?')) {
                clearCart();
              }
            }}
            className="btn btn-error btn-sm group bg-red-500 hover:bg-red-600 text-white flex items-center space-x-2"
          >
            <FaTrash className="w-4 h-4 mr-2 group-hover:animate-bounce" />
            Clear Library
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {cart.map((item, index) => (
                <div
                  key={item.resourceId}
                  className="card p-6"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                        <div className="flex items-center space-x-2">
                        
                          <div className="flex items-center space-x-1">
                            <FaCheck className="w-3 h-3 text-success-500" />
                            <span className="text-xs text-success-600">Premium Resource</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-sm group"
                      >
                        <FaEye className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                        View Resource
                      </a>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to remove this item?')) {
                            removeFromCart(item.resourceId);
                          }
                        }}
                        className="btn btn-error btn-sm group bg-red-500 hover:bg-red-600 text-white flex items-center space-x-2"
                      >
                        <FaTrash className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
      <ChatBot />
    </div>
  );
};

export default Cart; 