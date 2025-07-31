import React, { useState } from "react";
import PremiumModal from './PremiumModal';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaUserTie, FaEnvelope, FaPhone, FaLinkedin, FaTwitter, FaGlobe, FaStar, FaRocket } from 'react-icons/fa';
import { HiAcademicCap, HiSparkles, HiLightningBolt } from 'react-icons/hi';
import { API_URL } from '../config/api';

const mentors = [
  {
    id: 1,
    name: "Pratik Jadhav",
    expertise: "Web Development, UI/UX Design, Entrepreneurship, IT Field, Mentorship & Community Building",
    email: "Pratikjadhav6632@gmail.com",
    mobile: "+91 8408868107",
    bio: "Full-stack web developer and CTO at Foundrr, where I led the development of a scalable platform connecting entrepreneurs, mentors, and investors across India. I specialize in building modern, responsive web applications using technologies like React, Node.js, Express.js, MongoDB, Firebase, Appwrite, and Tailwind CSS. With hands-on experience in deploying production-ready platforms, managing end-to-end tech architecture, and integrating real-time features such as authentication, chat, and co-founder matching, I bring a deep understanding of startup-centric product development. I'm passionate about mentoring aspiring developers, especially from Tier 1 and Tier 2 cities, and helping them translate their ideas into impactful digital solutions.",
    rating: 4.9,
    students: 150,
    experience: "5+ years",
    avatar: "PJ",
    linkedin: "https://www.linkedin.com/in/pratik-jadhav--/"
  }
];

const Mentors = () => {
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageForm, setMessageForm] = useState({
    name: '',
    education: '',
    email: '',
    contact: '',
    meetingTime: '',
    meetingDay: '',
    topic: '',
    message: ''
  });
  const { user, setUser } = useAuth();

  React.useEffect(() => {
    if (user && user.planType !== 'premium') {
      setModalOpen(true);
    }
  }, [user]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleOpenCard = (mentor) => {
    setSelectedMentor(mentor);
  };

  const handleCloseCard = () => {
    setSelectedMentor(null);
  };

  const handleOpenMessageModal = () => {
    setMessageModalOpen(true);
  };

  const handleCloseMessageModal = () => {
    setMessageModalOpen(false);
    setMessageForm({
      name: '',
      education: '',
      meetingTime: '',
      meetingDay: '',
      topic: '',
      email: '',
      contact: '',
      message: ''
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setMessageForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      const emailData = {
        to: selectedMentor.email,
        subject: `Meeting Request: ${messageForm.topic}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #2563eb; text-align: center;">New Meeting Request</h2>
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin-bottom: 15px;">Student Information:</h3>
              <p><strong>Name:</strong> ${messageForm.name}</p>
              <p><strong>Email:</strong> ${messageForm.email}</p>
              <p><strong>Contact No:</strong> ${messageForm.contact}</p>
              <p><strong>Education:</strong> ${messageForm.education}</p>
            </div>
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin-bottom: 15px;">Meeting Details:</h3>
              <p><strong>Topic:</strong> ${messageForm.topic}</p>
              <p><strong>Preferred Day:</strong> ${messageForm.meetingDay}</p>
              <p><strong>Preferred Time:</strong> ${messageForm.meetingTime}</p>
            </div>
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin-bottom: 15px;">Message:</h3>
              <p style="line-height: 1.6;">${messageForm.message}</p>
            </div>
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px;">This message was sent through SkillBridge AI Mentorship Platform</p>
            </div>
          </div>
        `
      };

      const response = await axios.post(`${API_URL}/api/send-email`, emailData);
      
      if (response.data.success) {
        alert('Message sent successfully! The mentor will contact you soon.');
        handleCloseMessageModal();
      } else {
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const handleBuyPremium = async () => {
    setLoading(true);
    const res = await loadRazorpayScript();
    if (!res) {
      alert('Failed to load Razorpay SDK.');
      setLoading(false);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post('/api/payment/create-order', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Order creation response:', data);
      if (!data.success) throw new Error('Order creation failed');
      const order = data.order;
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Gaplify',
        description: 'Premium Plan',
        order_id: order.id,
        handler: async function (response) {
          console.log('Razorpay handler called', response);
          try {
            const verifyRes = await axios.post('/api/payment/verify', {
              order_id: order.id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature
            }, {
              headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Verify response:', verifyRes.data);
            if (verifyRes.data.success) {
              const userData = JSON.parse(localStorage.getItem('user'));
              userData.planType = 'premium';
              localStorage.setItem('user', JSON.stringify(userData));
              setUser(userData);
              alert('Congratulations! You are now a premium user.');
               // Reload page to reflect premium status
               window.location.reload();
              setModalOpen(false);
            } else {
              alert('Payment verification failed.');
            }
          } catch (err) {
            console.log('Verify error:', err);
            alert('Payment verification failed.');
          }
          setLoading(false);
        },
        prefill: {
          email: user?.email,
        },
        theme: {
          color: '#2563eb',
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.log('Payment flow error:', err);
      window.location.reload();
      setLoading(false);
    }
  };

  if (user && user.planType !== 'premium') {
    return (
      <>
        <PremiumModal open={modalOpen} onClose={() => setModalOpen(false)} onBuyPremium={handleBuyPremium} loading={loading} />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-6">
              <FaUserTie className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold mb-4 gradient-text">Premium Feature</h2>
            <p className="text-lg text-gray-600 mb-8">Mentors page is available for Premium users only.</p>
            <button
              className="btn btn-primary btn-lg group"
              onClick={handleBuyPremium}
              disabled={loading}
            >
              <FaRocket className="w-5 h-5 mr-2 group-hover:animate-bounce" />
              {loading ? 'Processing...' : 'Upgrade to Premium'}
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-responsive">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
            <FaUserTie className="w-4 h-4 mr-2" />
            Expert Mentorship
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            Find Your
            <span className="gradient-text block">Perfect Mentor</span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with industry experts who can guide you through your career journey
          </p>
        </div>

        {/* Mentors Grid */}
        <div className="grid gap-8 mb-12">
          {mentors.map((mentor, index) => (
            <div
              key={mentor.id}
              className="card p-8"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start space-x-6 mb-6 lg:mb-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                    {mentor.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h2 className="text-2xl font-bold text-gray-900">{mentor.name}</h2>
                      <div className="flex items-center space-x-1">
                        <FaStar className="w-4 h-4 text-warning-400" />
                        <span className="text-sm font-medium text-gray-600">{mentor.rating}</span>
                      </div>
                    </div>
                    <p className="text-primary-600 font-semibold mb-3">{mentor.expertise}</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <HiAcademicCap className="w-4 h-4" />
                        <span>{mentor.experience} experience</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <HiLightningBolt className="w-4 h-4" />
                        <span>{mentor.students} students mentored</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  className="btn btn-primary btn-lg group"
                  onClick={() => handleOpenCard(mentor)}
                >
                  <FaUserTie className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                  Connect with Mentor
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="card p-8" style={{ animationDelay: '0.3s' }}>
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Why Choose Our Mentors?</h3>
            <p className="text-gray-600">Get personalized guidance from industry experts</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-primary-50 rounded-xl">
              <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <HiAcademicCap className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Expert Knowledge</h4>
              <p className="text-sm text-gray-600">Learn from professionals with proven track records</p>
            </div>
            <div className="text-center p-6 bg-secondary-50 rounded-xl">
              <div className="w-12 h-12 bg-secondary-500 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <HiLightningBolt className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Personalized Guidance</h4>
              <p className="text-sm text-gray-600">One-on-one sessions tailored to your goals</p>
            </div>
            <div className="text-center p-6 bg-accent-50 rounded-xl">
              <div className="w-12 h-12 bg-accent-500 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                <HiSparkles className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Career Growth</h4>
              <p className="text-sm text-gray-600">Accelerate your professional development</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mentor Info Modal */}
      {selectedMentor && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
          <div className="card p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              onClick={handleCloseCard}
              aria-label="Close"
            >
              &times;
            </button>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {selectedMentor.avatar}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedMentor.name}</h2>
                <div className="flex items-center space-x-2">
                  <FaStar className="w-4 h-4 text-warning-400" />
                  <span className="text-sm font-medium text-gray-600">{selectedMentor.rating} rating</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                  <FaUserTie className="w-4 h-4 mr-2 text-primary-600" />
                  Expertise
                </h3>
                <p className="text-primary-600 font-medium">{selectedMentor.expertise}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
                <p className="text-gray-600 leading-relaxed">{selectedMentor.bio}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FaEnvelope className="w-4 h-4 text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{selectedMentor.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FaPhone className="w-4 h-4 text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-600">Mobile</p>
                    <p className="font-medium text-gray-900">{selectedMentor.mobile}</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button 
                  className="btn btn-primary btn-lg group flex-1"
                  onClick={handleOpenMessageModal}
                >
                  <FaEnvelope className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                  Send Message
                </button>
                <button className="btn btn-outline btn-lg group flex-1">
                  <FaLinkedin className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                  <a href={selectedMentor.linkedin} target="_blank" rel="noopener noreferrer">
                    View Profile
                  </a>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {messageModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
          <div className="card p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              onClick={handleCloseMessageModal}
              aria-label="Close"
            >
              &times;
            </button>
            
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Send Message to {selectedMentor?.name}</h2>
              <p className="text-gray-600">Fill out the form below to schedule a meeting with your mentor.</p>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={messageForm.name}
                    placeholder="e.g., John Doe"
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Education/Background *
                  </label>
                  <input
                    type="text"
                    name="education"
                    value={messageForm.education}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Computer Science Student"
                    required
                  />
                </div>
              </div>

              {/* Email and Contact */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={messageForm.email}
                    placeholder="abc@gmail.com"
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact No *
                  </label>
                  <input
                    type="tel"
                    name="contact"
                    value={messageForm.contact}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., +91 9876543210"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Topic *
                </label>
                <input
                  type="text"
                  name="topic"
                  value={messageForm.topic}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Career Guidance, Technical Interview Prep"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Day *
                  </label>
                  <select
                    name="meetingDay"
                    value={messageForm.meetingDay}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a day</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Time *
                  </label>
                  <select
                    name="meetingTime"
                    value={messageForm.meetingTime}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select time</option>
                    <option value="9:00 AM">9:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    <option value="3:00 PM">3:00 PM</option>
                    <option value="4:00 PM">4:00 PM</option>
                    <option value="5:00 PM">5:00 PM</option>
                    <option value="6:00 PM">6:00 PM</option>
                    <option value="7:00 PM">7:00 PM</option>
                    <option value="8:00 PM">8:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={messageForm.message}
                  onChange={handleFormChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Tell the mentor about your goals, what you'd like to discuss, and any specific questions you have..."
                  required
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={handleCloseMessageModal}
                  className="btn btn-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-1 group"
                >
                  <FaEnvelope className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                  Send Message
                </button>
              </div>
            </form>
          
          </div>
        </div>
      )}
    </div>
  );
};

export default Mentors; 