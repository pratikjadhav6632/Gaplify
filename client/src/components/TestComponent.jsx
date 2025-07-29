import React from 'react';

const TestComponent = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-responsive">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Test Component</h1>
            <p className="text-gray-600">This is a test to verify styling is working.</p>
          </div>
          
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Test Card</h2>
            <p className="text-gray-600 mb-4">This card should be visible with white background and shadow.</p>
            <button className="btn btn-primary">Test Button</button>
          </div>
          
          <div className="card p-8 mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Another Test Card</h2>
            <p className="text-gray-600">If you can see this, the styling is working correctly.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestComponent; 