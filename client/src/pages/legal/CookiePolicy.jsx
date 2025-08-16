import React from 'react';

const CookiePolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Cookie Policy</h1>
        <p className="text-gray-600 mb-6">Last updated: August 15, 2025</p>
        
        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. What Are Cookies</h2>
            <p className="text-gray-700 mb-4">
              As is common practice with almost all professional websites, this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it, and why we sometimes need to store these cookies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. How We Use Cookies</h2>
            <p className="text-gray-700 mb-4">
              We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li><strong>Essential Cookies:</strong> These are required for the operation of our website.</li>
              <li><strong>Analytics Cookies:</strong> These allow us to recognize and count visitors and see how they move around our website.</li>
              <li><strong>Functionality Cookies:</strong> These are used to recognize you when you return to our website.</li>
              <li><strong>Targeting Cookies:</strong> These record your visit to our website, the pages you have visited, and the links you have followed.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Third-Party Cookies</h2>
            <p className="text-gray-700 mb-4">
              In some special cases, we also use cookies provided by trusted third parties. The following section details which third-party cookies you might encounter through this site.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Google Analytics: To understand how you use our site and ways that we can improve your experience.</li>
              <li>Facebook Pixel: To track conversions from Facebook ads, optimize ads, and build targeted audiences.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Managing Cookies</h2>
            <p className="text-gray-700 mb-4">
              You can prevent the setting of cookies by adjusting the settings on your browser (see your browser's "Help" section for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Changes to This Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the "Last updated" date at the top of this Cookie Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Contact Us</h2>
            <p className="text-gray-700">
              If you have any questions about this Cookie Policy, please contact us at <a href="mailto:privacy@gaplify.com" className="text-primary-600 hover:underline">gaplify@gmail.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
