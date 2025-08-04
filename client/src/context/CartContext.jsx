import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { API_URL } from '../config/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's cart from backend when user logs in
  useEffect(() => {
    const fetchUserCart = async () => {
      if (user) {
        try {
          const response = await fetch(`${API_URL}/api/interests`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setCart(data);
          } else {
            let errorMsg = 'Failed to fetch cart';
            try {
              const error = await response.json();
              errorMsg = error.message || errorMsg;
            } catch (e) {
              errorMsg = `Server error: ${response.status}`;
            }
            alert(errorMsg);
          }
        } catch (error) {
          console.error('Error fetching user cart:', error);
        }
      } else {
        setCart([]);
      }
      setLoading(false);
    };

    fetchUserCart();
  }, [user]);

  const addToCart = async (resource) => {
    if (!user) {
      alert('Please login to save resources');
      return;
    }

    // Validate required fields
    if (!resource.resourceId || !resource.title) {
      console.error('Invalid resource data:', resource);
      alert('Invalid resource data. Missing required fields.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No authentication token found');
        alert('Authentication error. Please login again.');
        return;
      }

      // Log the request being made
      console.log('Adding to cart:', { resource });
      
      const response = await fetch(`${API_URL}/api/interests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(resource)
      });

      // First, get the response text
      const responseText = await response.text();
      let data;
      
      try {
        // Try to parse the response as JSON
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', {
          status: response.status,
          statusText: response.statusText,
          responseText,
          error: parseError
        });
        throw new Error('Invalid response from server. Please try again.');
      }

      if (response.ok) {
        setCart(data);
        return { success: true, data };
      } else {
        console.error('Failed to add to cart:', {
          status: response.status,
          statusText: response.statusText,
          data: data || 'No data in response'
        });
        
        const errorMessage = data?.message || 
                           (data?.error || `Failed to add resource (${response.status})`);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error adding to cart:', {
        error: error,
        message: error.message,
        stack: error.stack
      });
      alert('Failed to add resource to cart. Please try again.');
    }
  };

  const removeFromCart = async (resourceId) => {
    if (!user) return;

    try {
const response = await fetch(`${API_URL}/api/interests/${resourceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const updatedCart = await response.json();
        setCart(updatedCart);
      } else {
        let errorMsg = 'Failed to remove resource from cart';
        try {
          const error = await response.json();
          errorMsg = error.message || errorMsg;
        } catch (e) {
          errorMsg = `Server error: ${response.status}`;
        }
        alert(errorMsg);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert('Failed to remove resource from cart');
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
const response = await fetch(`${API_URL}/api/interests/clear`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const updatedCart = await response.json();
        setCart(updatedCart);
      } else {
        let errorMsg = 'Failed to clear cart';
        try {
          const error = await response.json();
          errorMsg = error.message || errorMsg;
        } catch (e) {
          errorMsg = `Server error: ${response.status}`;
        }
        alert(errorMsg);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert('Failed to clear cart');
    }
  };

  const isInCart = (resourceId) => {
    return cart.some((item) => item.resourceId === resourceId);
  };

  const value = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    isInCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext; 