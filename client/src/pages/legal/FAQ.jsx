import React from 'react';
import { useState } from 'react';
import { HiChevronDown } from 'react-icons/hi';

const faqs = [
  {
    question: 'What is Gaplify?',
    answer:
      'Gaplify is an AI-powered career platform that helps you identify skill gaps and provides personalised learning roadmaps, resources, and mentorship to accelerate your career growth.'
  },
  {
    question: 'Is Gaplify free to use?',
    answer:
      'Core features such as skill-gap analysis and basic roadmaps are free. Advanced resources and mentor sessions may require a one-time or subscription payment.'
  },
  {
    question: 'How accurate is the skill analysis?',
    answer:
      'Our AI models are trained on thousands of job descriptions and career trajectories. While highly accurate, we recommend consulting mentors on the platform for customised guidance.'
  },
  {
    question: 'Can I talk to real mentors?',
    answer:
      'Yes! Gaplify connects you with verified industry mentors for 1-on-1 video or chat sessions.'
  },
  {
    question: 'Do you offer refunds?',
    answer:
      'Digital downloads are generally non-refundable. Mentor sessions can be rescheduled up to 12 hours prior. See our Terms for full details.'
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <div className="container-responsive py-12">
      <h1 className="text-3xl font-bold mb-10 text-center">Frequently Asked Questions</h1>

      <div className="mx-auto max-w-3xl space-y-4">
        {faqs.map((item, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg">
            <button onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            className="w-full px-6 py-4 flex justify-between items-center text-left focus:outline-none focus-visible:ring focus-visible:ring-primary-500/50">
              <span className="font-medium text-gray-800">{item.question}</span>
              <HiChevronDown
                className={`transition-transform duration-200 w-5 h-5 text-primary-600 ${openIndex === idx ? 'transform rotate-180' : ''}`}
              />
            </button>
            {openIndex === idx && (
              <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
