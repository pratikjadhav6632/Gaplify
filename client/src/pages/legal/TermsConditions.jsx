import React from 'react';

const TermsConditions = () => {
  return (
    <div className="container-responsive py-12">
      <h1 className="text-3xl font-bold mb-6">Terms &amp; Conditions</h1>
      <p className="text-sm text-gray-500 mb-10">Last updated: 1 August 2025</p>

      <section className="space-y-6 text-gray-700">
        <div>
          <h2 className="text-2xl font-semibold mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Gaplify you agree to be bound by these Terms &amp;
            Conditions ("Terms"). If you do not agree, you may not use the
            Platform.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">2. Use of the Platform</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>You must be at least 13 years old to create an account.</li>
            <li>You are responsible for any activity that occurs under your account.</li>
            <li>You may not use the Platform for illegal or unauthorized purposes.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">3. Intellectual Property</h2>
          <p>
            Gaplify and its content (courses, roadmaps, visuals, trademarks,
            etc.) are owned by Gaplify or its licensors. You may not copy or
            redistribute content without permission.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">4. Payments &amp; Refunds</h2>
          <p>
            All fees are shown at checkout. Digital resources are non-refundable
            once downloaded, except as required by law.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">5. Limitation of Liability</h2>
          <p>
            Gaplify is provided "as-is". We do not guarantee employment or any
            specific outcome. In no event will Gaplify be liable for any
            indirect or consequential damages.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">6. Modifications</h2>
          <p>
            We may update these Terms at any time. Continued use of the Platform
            after changes constitutes acceptance of the new Terms.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">7. Contact</h2>
          <p>
            Questions? Email <a href="mailto:legal@gaplify.com" className="text-primary-600">legal@gaplify.com</a>.
          </p>
        </div>
      </section>
    </div>
  );
};

export default TermsConditions;
