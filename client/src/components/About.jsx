import ChatBot from "./ChatBot";
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
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-300">
        <h1 className="text-3xl font-bold mb-6 text-center">About</h1>
        <h5 className="font-bold"> Welcome to Gaplify Bridging the Future of Talent.</h5>
        <p> &nbsp; At SkillBridge AI, we are on a mission to transform how students and fresh graduates prepare for the industry. Our platform identifies the skill gaps between a learner's current abilities and the evolving demands of the job market, then empowers them with personalized learning paths, curated resources, and real-time insights to thrive in the competitive professional world.</p>

        <h5 className="font-bold">Our Mission</h5>
        <p> &nbsp; Our mission is to empower learners with the skills and knowledge they need to succeed in the industry. We believe that everyone should have access to the best resources and opportunities to achieve their goals.</p>

        <h5 className="font-bold">Our Vision</h5>
        <p> &nbsp; Our vision is to create a world where everyone has the skills and knowledge they need to succeed in the industry. We believe that everyone should have access to the best resources and opportunities to achieve their goals.</p>

       
      </div>
      <PrivateRoute>

      <ChatBot />
      </PrivateRoute>
    </div>
  );
};

export default About; 