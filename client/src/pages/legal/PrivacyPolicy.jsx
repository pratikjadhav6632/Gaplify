import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container-responsive py-12">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-10">Last updated: 1 August 2025</p>

      <section className="space-y-6 text-gray-700">
        <div>
          <h2 className="text-2xl font-semibold mb-2">1. Introduction</h2>
          <p>
            Gaplify ("we", "our", "us") is committed to protecting your privacy. This
            Privacy Policy explains how we collect, use, disclose, and safeguard
            your information when you use the Gaplify website, mobile
            application, and related services (collectively, the "Platform").
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">2. Information We Collect</h2>
          <p>
            We collect information that you voluntarily provide to us when you
            register for an account, purchase content, participate in career
            assessments, or interact with mentors. This may include: name,
            email, password, billing details, skill-assessment answers,
            uploaded documents, and any messages you send us.
          </p>
          <p>
            We also automatically collect certain information from your device,
            such as your IP address, browser type, referring URLs, and how you
            interact with our Platform. We use cookies and similar technologies
            for analytics and to remember your preferences.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">3. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>To create and maintain your Gaplify account</li>
            <li>To deliver personalised skill-gap analyses and learning roadmaps</li>
            <li>To process purchases and manage your digital library</li>
            <li>To connect you with mentors and other learners</li>
            <li>To improve and secure our Platform</li>
            <li>To send you service-related messages and marketing (opt-out any time)</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">4. Sharing of Information</h2>
          <p>
            We do not sell your personal data. We may share information with
            trusted service providers (e.g. payment processors, cloud hosting)
            who process it on our behalf under strict confidentiality
            agreements, or if required by law.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">5. Security</h2>
          <p>
            We implement industry-standard security measures to protect your
            data. However, no online service is 100% secure, so we cannot
            guarantee absolute security.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">6. Your Choices</h2>
          <p>
            You may access, update, or delete your personal information at any
            time from your profile settings. You can also disable cookies in
            your browser, though some features may not function correctly.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">7. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, email us at
            <a href="mailto:privacy@gaplify.com" className="text-primary-600 ml-1">privacy@gaplify.com</a>.
          </p>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
