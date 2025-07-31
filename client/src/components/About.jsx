import ChatBot from "./ChatBot";
import { FaLightbulb, FaBullseye, FaUsers } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { Navigate } from "react-router-dom";
const About = () => {
  const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) {
      return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }
    
    return user ? children : <Navigate to="/about" />;
  };
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-white to-indigo-50 p-8 rounded-lg shadow-md border border-gray-200">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">About <span className="text-indigo-600">Gaplify</span></h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Bridging the future of talent by empowering learners with personalised skill pathways.</p>
        </div>
        
        <p> &nbsp; At SkillBridge AI, we are on a mission to transform how students and fresh graduates prepare for the industry. Our platform identifies the skill gaps between a learner's current abilities and the evolving demands of the job market, then empowers them with personalized learning paths, curated resources, and real-time insights to thrive in the competitive professional world.</p>

        <div className="grid md:grid-cols-3 gap-6 text-center my-10">
          <div className="p-6 bg-white rounded-lg shadow">
            <FaBullseye className="text-3xl mx-auto mb-3 text-indigo-600"/>
            <h3 className="font-semibold mb-2">Our Mission</h3>
        <p>We empower learners with the right skills and knowledge to excel in their careers by providing curated pathways, resources and mentorship.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <FaLightbulb className="text-3xl mx-auto mb-3 text-indigo-600"/>
            <h3 className="font-semibold mb-2">Our Vision</h3>

        
        <p>We envision a world where access to relevant skills is barrier-free, enabling everyone to thrive in the evolving job market.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <FaUsers className="text-3xl mx-auto mb-3 text-indigo-600"/>
            <h3 className="font-semibold mb-2">Our Values</h3>
            <p>Inclusivity • Continuous Learning • Innovation • Impact</p>
          </div>
        </div>

        {/* Team Section */}
        <div className="my-16">
          <h2 className="text-2xl font-bold text-center mb-8">Meet the Team</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map((n)=>(
              <div key={n} className="bg-white rounded-lg p-4 text-center shadow hover:shadow-lg transition">
                <img src={`https://i.pravatar.cc/150?img=${n}`} alt="team" className="w-24 h-24 mx-auto rounded-full mb-3 object-cover"/>
                <h4 className="font-semibold">Member {n}</h4>
                <p className="text-sm text-gray-500">Role {n}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <PrivateRoute>

      <ChatBot />
      </PrivateRoute>
    </div>
  );
};

export default About; 