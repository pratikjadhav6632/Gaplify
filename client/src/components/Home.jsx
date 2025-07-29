import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ChatBot from './ChatBot';
import { FaMap, FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight, FaRocket, FaGraduationCap, FaUsers, FaChartLine } from "react-icons/fa";
import { SiChatbot } from "react-icons/si";
import { TbReportAnalytics, TbTargetArrow, TbBulb, TbRocket, TbBrain, TbTrendingUp } from "react-icons/tb";
import { HiAcademicCap, HiLightningBolt, HiSparkles } from "react-icons/hi";
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  // Sample testimonials data
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Software Engineer',
      content: 'Gaplify helped me identify the exact skills I needed to transition into tech. The personalized roadmap made all the difference in my career change journey.',
      rating: 5,
      avatar: 'SJ',
      company: 'Google'
    },
    {
      name: 'Michael Chen',
      role: 'Product Manager',
      content: 'The AI career assistant provided insights I never would have considered. It helped me position myself for a promotion within just 6 months!',
      rating: 5,
      avatar: 'MC',
      company: 'Microsoft'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Data Scientist',
      content: 'The skill gap analysis was eye-opening. I was able to focus my learning on high-impact areas that directly contributed to landing my dream job.',
      rating: 5,
      avatar: 'ER',
      company: 'Netflix'
    },
    {
      name: 'David Kim',
      role: 'UX Designer',
      content: 'Mentor support was exceptional. My mentor helped me build a strong portfolio that got me multiple job offers.',
      rating: 5,
      avatar: 'DK',
      company: 'Apple'
    }
  ];

  // Stats data
  const stats = [
    { number: '50K+', label: 'Active Learners', icon: FaUsers },
    { number: '95%', label: 'Success Rate', icon: FaChartLine },
    { number: '200+', label: 'Expert Mentors', icon: FaGraduationCap },
    { number: '24/7', label: 'AI Support', icon: TbBrain }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => observer.observe(el));

    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="hero section-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 via-secondary-600/20 to-accent-500/20"></div>
        <div className="container-responsive relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-8 border border-white/20">
                <HiSparkles className="w-4 h-4 mr-2" />
                AI-Powered Career Guidance
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance">
                Bridge the Gap to Your
                <span className="gradient-text-accent block">Dream Career</span>
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
                Your AI-powered career guidance platform that bridges the gap between your skills and dream career with personalized learning paths and real-time insights.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button 
                  onClick={() => navigateTo('/signup')}
                  className="btn btn-accent btn-lg group"
                >
                  <FaRocket className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                  Get Started Free
                </button>
                <button 
                  onClick={() => navigateTo('/skills-analysis')}
                  className="btn btn-outline btn-lg border-white text-white hover:bg-white hover:text-primary-600"
                >
                  <TbTargetArrow className="w-5 h-5 mr-2" />
                  Analyze My Skills
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full float"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/5 rounded-full float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-20 w-16 h-16 bg-white/10 rounded-full float" style={{ animationDelay: '2s' }}></div>
      </section>

      {/* Stats Section */}
      <section className="section-sm bg-white">
        <div className="container-responsive">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="stats-card animate-on-scroll" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-white">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="stats-number">{stat.number}</div>
                <div className="stats-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="section">
        <div className="container-responsive">
          <div className="text-center mb-16 animate-on-scroll">
            <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
              <HiAcademicCap className="w-4 h-4 mr-2" />
              Our Mission
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              Empowering Your
              <span className="gradient-text block">Career Journey</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              At Gaplify, we're committed to empowering individuals with AI-driven career guidance, personalized learning paths, and real-time skill analysis to help you thrive in today's competitive job market.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="feature-card group animate-on-scroll" style={{ animationDelay: '0.1s' }}>
              <div className="feature-icon">
                <TbTargetArrow />
              </div>
              <h3 className="text-xl font-semibold mb-3">Clear Direction</h3>
              <p className="text-gray-600">Find your ideal career path with our AI-powered assessment tools and personalized recommendations.</p>
            </div>
            
            <div className="feature-card group animate-on-scroll" style={{ animationDelay: '0.2s' }}>
              <div className="feature-icon">
                <TbBulb />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Learning</h3>
              <p className="text-gray-600">Personalized learning recommendations based on your goals, current skills, and market demands.</p>
            </div>
            
            <div className="feature-card group animate-on-scroll" style={{ animationDelay: '0.3s' }}>
              <div className="feature-icon">
                <TbRocket />
              </div>
              <h3 className="text-xl font-semibold mb-3">Career Growth</h3>
              <p className="text-gray-600">Stay ahead with real-time industry insights, skill trends, and expert mentorship support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="section bg-white">
        <div className="container-responsive">
          <div className="text-center mb-16 animate-on-scroll">
            <div className="inline-flex items-center px-4 py-2 bg-secondary-100 text-secondary-700 rounded-full text-sm font-medium mb-6">
              <HiLightningBolt className="w-4 h-4 mr-2" />
              Our Services
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              Comprehensive
              <span className="gradient-text block">Career Solutions</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Everything you need to accelerate your career growth and achieve your professional goals</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card card-interactive p-8 flex flex-col items-center text-center h-full animate-on-scroll" style={{ animationDelay: '0.1s' }}>
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center text-white text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <TbReportAnalytics />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Skill Analysis</h3>
              <p className="text-gray-600 mb-6">Get detailed insights about your current skills and how they match market demands.</p>
              <ul className="text-left text-gray-600 space-y-2 mb-6 w-full">
                <li className="flex items-start">
                  <span className="text-success-500 mr-2 text-lg">✓</span>
                  <span>Personalized skill assessment</span>
                </li>
                <li className="flex items-start">
                  <span className="text-success-500 mr-2 text-lg">✓</span>
                  <span>Market demand analysis</span>
                </li>
                <li className="flex items-start">
                  <span className="text-success-500 mr-2 text-lg">✓</span>
                  <span>Skill gap identification</span>
                </li>
              </ul>
              <button 
                onClick={() => navigateTo('/skills-analysis')} 
                className="mt-auto btn btn-primary btn-sm"
              >
                Analyze Skills →
              </button>
            </div>

            <div className="card card-interactive p-8 flex flex-col items-center text-center h-full animate-on-scroll" style={{ animationDelay: '0.2s' }}>
              <div className="w-20 h-20 bg-gradient-to-br from-secondary-500 to-accent-500 rounded-2xl flex items-center justify-center text-white text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaMap />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Career Roadmaps</h3>
              <p className="text-gray-600 mb-6">Personalized learning paths tailored to your career aspirations and goals.</p>
              <ul className="text-left text-gray-600 space-y-2 mb-6 w-full">
                <li className="flex items-start">
                  <span className="text-success-500 mr-2 text-lg">✓</span>
                  <span>Custom learning paths</span>
                </li>
                <li className="flex items-start">
                  <span className="text-success-500 mr-2 text-lg">✓</span>
                  <span>Download PDF roadmaps</span>
                </li>
                <li className="flex items-start">
                  <span className="text-success-500 mr-2 text-lg">✓</span>
                  <span>Milestone achievements</span>
                </li>
              </ul>
              <button 
                onClick={() => navigateTo('/roadmap')} 
                className="mt-auto btn btn-secondary btn-sm"
              >
                Explore Roadmaps →
              </button>
            </div>

            <div className="card card-interactive p-8 flex flex-col items-center text-center h-full animate-on-scroll" style={{ animationDelay: '0.3s' }}>
              <div className="w-20 h-20 bg-gradient-to-br from-accent-500 to-primary-500 rounded-2xl flex items-center justify-center text-white text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <SiChatbot/>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">AI Assistant</h3>
              <p className="text-gray-600 mb-6">24/7 career guidance and support from our AI-powered assistant.</p>
              <ul className="text-left text-gray-600 space-y-2 mb-6 w-full">
                <li className="flex items-start">
                  <span className="text-success-500 mr-2 text-lg">✓</span>
                  <span>Instant career advice</span>
                </li>
                <li className="flex items-start">
                  <span className="text-success-500 mr-2 text-lg">✓</span>
                  <span>Interview preparation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-success-500 mr-2 text-lg">✓</span>
                  <span>Question answering</span>
                </li>
              </ul>
              <button 
                className="mt-auto btn btn-accent btn-sm"
              >
                Try AI Assistant →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section bg-gray-50">
        <div className="container-responsive">
          <div className="text-center mb-16 animate-on-scroll">
            <div className="inline-flex items-center px-4 py-2 bg-accent-100 text-accent-700 rounded-full text-sm font-medium mb-6">
              <FaStar className="w-4 h-4 mr-2" />
              Success Stories
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              What Our Users
              <span className="gradient-text block">Say</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-gray-600">Join thousands of professionals who have transformed their careers with Gaplify</p>
          </div>
          
          <div className="relative max-w-4xl mx-auto animate-on-scroll">
            <div className="overflow-hidden rounded-2xl">
              <div className="flex transition-transform duration-500 ease-in-out" 
                   style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}>
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <div className="testimonial-card">
                      <div className="testimonial-quote">
                        <FaQuoteLeft />
                      </div>
                      <div className="flex mb-6">
                        {[...Array(5)].map((_, i) => (
                          <FaStar 
                            key={i} 
                            className={`${i < testimonial.rating ? 'text-warning-400' : 'text-gray-300'} text-xl`} 
                          />
                        ))}
                      </div>
                      <p className="text-gray-600 italic mb-8 text-lg leading-relaxed">"{testimonial.content}"</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-xl font-bold mr-4">
                            {testimonial.avatar}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 text-lg">{testimonial.name}</h4>
                            <p className="text-gray-500">{testimonial.role}</p>
                            <p className="text-primary-600 text-sm font-medium">{testimonial.company}</p>
                          </div>
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
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-medium text-primary-600 hover:bg-primary-50 transition-all duration-200 hover:scale-110"
              aria-label="Previous testimonial"
            >
              <FaChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-medium text-primary-600 hover:bg-primary-50 transition-all duration-200 hover:scale-110"
              aria-label="Next testimonial"
            >
              <FaChevronRight className="w-5 h-5" />
            </button>
            
            {/* Dots Indicator */}
            <div className="flex justify-center mt-8 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial 
                      ? 'bg-primary-600 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          <div className="mt-12 text-center animate-on-scroll">
            <button className="btn btn-primary btn-lg group">
              Read More Success Stories
              <TbTrendingUp className="w-5 h-5 ml-2 group-hover:animate-bounce" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-gradient-hero text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container-responsive relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Ready to Transform Your Career?</h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">Join thousands of professionals who have already accelerated their careers with Gaplify</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => navigateTo('/signup')}
                className="btn btn-accent btn-lg group"
              >
                <FaRocket className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                Get Started for Free
              </button>
              <button className="btn btn-outline btn-lg border-white text-white hover:bg-white hover:text-primary-600">
                Schedule a Demo
              </button>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-16 h-16 bg-white/10 rounded-full float"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/5 rounded-full float" style={{ animationDelay: '1s' }}></div>
      </section>

      {user && <ChatBot />}
    </div>
  );
};

export default Home;
