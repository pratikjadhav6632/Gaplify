import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ResourceCard = ({ resource }) => {
  const { addToCart, isInCart } = useCart();
  const { user } = useAuth();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!user) {
      alert('Please login to save resources');
      return;
    }

    if (isAdding) return;

    try {
      setIsAdding(true);
      
      // Validate resource data
      if (!resource.id || !resource.title) {
        console.error('Invalid resource data:', resource);
        alert('Invalid resource data. Please try again.');
        return;
      }

      // Format the resource data to match the server's expected format
      const formattedResource = {
        resourceId: resource.id,
        title: resource.title,
        description: resource.description || '',
        category: resource.category || '',
        image: resource.image || '',
        link: resource.link || '',
        rating: resource.rating || 0
      };

      await addToCart(formattedResource);
    } catch (error) {
      console.error('Error in handleAddToCart:', error);
      alert('Failed to add resource to cart. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img 
          src={resource.image} 
          alt={resource.title} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm">
            {resource.category}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
        <p className="text-gray-600 mb-4">{resource.description}</p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-yellow-500 mr-1">★</span>
            <span className="text-gray-600">{resource.rating}</span>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          
          <button
            onClick={handleAddToCart}
            disabled={isInCart(resource.id) || isAdding}
            className={`px-4 py-2 rounded-md transition-colors ${
              isInCart(resource.id)
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : isAdding
                ? 'bg-blue-300 text-white cursor-wait'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isInCart(resource.id) 
              ? 'Added to Cart' 
              : isAdding 
              ? 'Adding...' 
              : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard; 