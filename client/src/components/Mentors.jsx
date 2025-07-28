import React, { useState } from "react";
import PremiumModal from './PremiumModal';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
console.log('RAZORPAY KEY (frontend):', import.meta.env.VITE_RAZORPAY_KEY_ID);
const mentors = [
  {
    id: 1,
    name: "Pratik Jadhav",
    expertise: "Web Development , UI/UX Design , entrepreneurship , IT field , Mentorship & Community Building ",
    email: "Pratikjadhav6632@gmail.com",
    mobile: "+91 8408868107",
    bio: "Full-stack web developer and CTO at Foundrr, where I led the development of a scalable platform connecting entrepreneurs, mentors, and investors across India. I specialize in building modern, responsive web applications using technologies like React, Node.js, Express.js, MongoDB, Firebase, Appwrite, and Tailwind CSS. With hands-on experience in deploying production-ready platforms, managing end-to-end tech architecture, and integrating real-time features such as authentication, chat, and co-founder matching, I bring a deep understanding of startup-centric product development. I'm passionate about mentoring aspiring developers, especially from Tier 1 and Tier 2 cities, and helping them translate their ideas into impactful digital solutions.",
  }

];

const Mentors = () => {
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
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
        name: 'SkillBridge AI',
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
      alert('Payment failed.');
      setLoading(false);
    }
  };

  if (user && user.planType !== 'premium') {
    return (
      <>
        <PremiumModal open={modalOpen} onClose={() => setModalOpen(false)} onBuyPremium={handleBuyPremium} loading={loading} />
        <div className="text-center py-24">
          <h2 className="text-3xl font-bold mb-4 text-blue-700">Premium Feature</h2>
          <p className="text-lg text-gray-700 mb-6">Mentors page is available for Premium users only.</p>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold text-lg"
            onClick={handleBuyPremium}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Buy Premium'}
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Find a Mentor</h1>
      <div className="grid gap-6">
        {mentors.map((mentor) => (
          <div
            key={mentor.id}
            className="flex items-center justify-between p-4 border rounded shadow-sm bg-white"
          >
            <div>
              <div className="text-xl font-semibold">{mentor.name}</div>
              <div className="text-gray-600">Expertise: {mentor.expertise}</div>
            </div>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              onClick={() => handleOpenCard(mentor)}
            >
              Connect
            </button>
          </div>
        ))}
      </div>

      {/* Mentor Info Modal/Card */}
      {selectedMentor && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={handleCloseCard}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-2">{selectedMentor.name}</h2>
            <div className="mb-2 text-blue-700 font-semibold">{selectedMentor.expertise}</div>
            <div className="mb-2 text-gray-700">{selectedMentor.bio}</div>
            <div className="mb-1"><span className="font-semibold">Email:</span> {selectedMentor.email}</div>
            <div className="mb-1"><span className="font-semibold">Mobile:</span> {selectedMentor.mobile}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mentors; 