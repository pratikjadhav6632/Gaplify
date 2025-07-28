import { Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ChatBot from './ChatBot';
import { FaMap, FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { SiChatbot } from "react-icons/si";
import { TbReportAnalytics, TbTargetArrow, TbBulb, TbRocket } from "react-icons/tb";
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  // Sample testimonials data
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Software Engineer',
      content: 'Gaplify helped me identify the exact skills I needed to transition into tech. The personalized roadmap made all the difference in my career change journey.',
      rating: 5,
      avatar: 'SJ'
    },
    {
      name: 'Michael Chen',
      role: 'Product Manager',
      content: 'The AI career assistant provided insights I never would have considered. It helped me position myself for a promotion within just 6 months!',
      rating: 5,
      avatar: 'MC'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Data Scientist',
      content: 'The skill gap analysis was eye-opening. I was able to focus my learning on high-impact areas that directly contributed to landing my dream job.',
      rating: 5,
      avatar: 'ER'
    },
    {
      name: 'David Kim',
      role: 'UX Designer',
      content: 'Mentor support was exceptional. My mentor helped me build a strong portfolio that got me multiple job offers.',
      rating: 5,
      avatar: 'DK'
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  // Navigation functions for testimonial carousel
  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Navigation functions
  const navigateTo = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          Loading...
        </div>
      );
    }

    return user ? children : <Navigate to="/" />;
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-20 sm:px-6 lg:px-8 rounded-b-3xl">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to Gaplify</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">Your AI-powered career guidance platform that bridges the gap between your skills and dream career.</p>
          <button className="bg-white text-blue-700 hover:bg-blue-50 font-semibold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105">
            Get Started
          </button>
        </div>
      </div>

      {/* Our Motive Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              At Gaplify, we're committed to empowering individuals with AI-driven career guidance, personalized learning paths, and real-time skill analysis to help you thrive in today's competitive job market.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-xl transition-shadow duration-300">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <TbTargetArrow className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Clear Direction</h3>
              <p className="text-gray-600">Find your ideal career path with our AI-powered assessment tools.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-xl transition-shadow duration-300">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <TbBulb className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Learning</h3>
              <p className="text-gray-600">Personalized learning recommendations based on your goals.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-xl transition-shadow duration-300">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <TbRocket className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Career Growth</h3>
              <p className="text-gray-600">Stay ahead with real-time industry insights and skill trends.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Comprehensive career development solutions tailored to your needs</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-blue-200">
              <div className="text-blue-600 text-5xl mb-6">
                <TbReportAnalytics />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Skill Analysis</h2>
              <p className="text-gray-600 mb-4">Get detailed insights about your current skills and how they match market demands.</p>
              <ul className="text-left text-gray-600 space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Personalized skill assessment</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Market demand analysis</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Skill gap identification</span>
                </li>
              </ul>
              <button 
                onClick={() => navigateTo('/skills-analysis')} 
                className="mt-auto text-blue-600 font-medium hover:text-blue-700 transition-colors"
              >
                Learn more →
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-blue-200 transform hover:-translate-y-1">
              <div className="text-blue-600 text-5xl mb-6">
                <FaMap />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Career Roadmaps</h2>
              <p className="text-gray-600 mb-4">Personalized learning paths tailored to your career aspirations and goals.</p>
              <ul className="text-left text-gray-600 space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Custom learning paths</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Download PDF</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Milestone achievements</span>
                </li>
              </ul>
              <button 
                onClick={() => navigateTo('/roadmap')} 
                className="mt-auto text-blue-600 font-medium hover:text-blue-700 transition-colors"
              >
                Explore roadmaps →
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-blue-200">
              <div className="text-blue-600 text-5xl mb-6">
                <SiChatbot/>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">AI Assistant</h2>
              <p className="text-gray-600 mb-4">24/7 career guidance and support from our AI-powered assistant.</p>
              <ul className="text-left text-gray-600 space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Instant career advice</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Interview preparation</span>
                </li>
              <li>
                <span className="text-green-500 mr-2">✓</span>
                <span>Question answering</span>
              </li>
              </ul>
              <button 
              
                className="mt-auto text-blue-600 font-medium hover:text-blue-700 transition-colors"
              >
                Try AI Assistant →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600">Join thousands of professionals who have transformed their careers</p>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden">
              <div className="flex transition-transform duration-300 ease-in-out" 
                   style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}>
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <div className="bg-white p-8 rounded-xl shadow-md relative">
                      <div className="absolute -top-5 -left-5 text-yellow-400 text-5xl">
                        <FaQuoteLeft />
                      </div>
                      <div className="flex mb-4">
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                            className={`${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'} text-lg`} 
                          />
                        ))}
                      </div>
                      <p className="text-gray-600 italic mb-6">"{testimonial.content}"</p>
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold mr-4">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                          <p className="text-gray-500 text-sm">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation Arrows */}
            <button 
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 bg-white p-2 rounded-full shadow-md text-blue-600 hover:bg-blue-50 transition-colors"
              aria-label="Previous testimonial"
            >
              <FaChevronLeft />
            </button>
            <button 
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 bg-white p-2 rounded-full shadow-md text-blue-600 hover:bg-blue-50 transition-colors"
              aria-label="Next testimonial"
            >
              <FaChevronRight />
            </button>
            
            {/* Dots Indicator */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'}`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition duration-300 inline-flex items-center">
              Read More Success Stories
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Career?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of professionals who have already accelerated their careers with Gaplify</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-blue-700 hover:bg-blue-50 font-semibold py-3 px-8 rounded-full transition duration-300">
              Get Started for Free
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:bg-opacity-10 font-semibold py-3 px-8 rounded-full transition duration-300">
              Schedule a Demo
            </button>
          </div>
        </div>
      </section>

      <PrivateRoute>
        <ChatBot />
      </PrivateRoute>
    </div>
  );
};

export default Home;
