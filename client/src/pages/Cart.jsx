import React from 'react';
import { useCart } from '../context/CartContext';
import ChatBot from '../components/ChatBot';
import { FaShoppingCart, FaTrash, FaEye, FaArrowLeft, FaCreditCard, FaCheck } from 'react-icons/fa';
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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any resources to your cart yet.</p>
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
                <FaShoppingCart className="w-5 h-5" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
            </div>
            <p className="text-gray-600">{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>
          </div>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear your cart?')) {
                clearCart();
              }
            }}
            className="btn btn-error btn-sm group"
          >
            <FaTrash className="w-4 h-4 mr-2 group-hover:animate-bounce" />
            Clear Cart
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
                          <span className="text-lg font-bold text-primary-600">
                            ${item.price.toFixed(2)}
                          </span>
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
                        className="btn btn-error btn-sm group"
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

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-6" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-primary-500 rounded-lg flex items-center justify-center text-white">
                  <FaCreditCard className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold text-gray-900">$0.00</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-primary-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                className="w-full btn btn-primary btn-lg group mb-4"
                onClick={() => {
                  // Implement checkout logic here
                  alert('Checkout functionality coming soon!');
                }}
              >
                <FaCreditCard className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                Proceed to Checkout
              </button>
              
              <div className="text-center">
                <a
                  href="/resource-hub"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium group"
                >
                  <FaArrowLeft className="w-4 h-4 mr-1 inline group-hover:-translate-x-1 transition-transform" />
                  Continue Shopping
                </a>
              </div>

              {/* Benefits */}
              <div className="mt-6 p-4 bg-primary-50 rounded-xl">
                <h4 className="font-semibold text-primary-900 mb-2 flex items-center">
                  <HiSparkles className="w-4 h-4 mr-2" />
                  Premium Benefits
                </h4>
                <ul className="text-sm text-primary-700 space-y-1">
                  <li>• Lifetime access to resources</li>
                  <li>• Download for offline use</li>
                  <li>• Priority customer support</li>
                  <li>• Regular content updates</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ChatBot />
    </div>
  );
};

export default Cart; 