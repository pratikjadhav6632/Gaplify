import { useEffect, useState } from 'react';
import axios from 'axios';

const History = () => {
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [roadmapHistory, setRoadmapHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:5000/api/users/history', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAnalysisHistory(data.analysisHistory || []);
        setRoadmapHistory(data.roadmapHistory || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Activity History</h1>

      {/* Analysis History */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Recent Skill Analyses</h2>
        {analysisHistory.length === 0 ? (
          <p>No analyses yet.</p>
        ) : (
          <div className="space-y-4">
            {analysisHistory.slice().reverse().map((item, idx) => (
              <div key={idx} className="p-4 bg-white rounded shadow">
                <p className="text-sm text-gray-500">{new Date(item.createdAt).toLocaleString()}</p>
                <p className="font-semibold">Target Role: {item.targetRole}</p>
                <p className="text-sm mt-2">Skills: {item.skills.map(s => s.name).join(', ')}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Roadmap History */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Generated Roadmaps</h2>
        {roadmapHistory.length === 0 ? (
          <p>No roadmaps yet.</p>
        ) : (
          <div className="space-y-4">
            {roadmapHistory.slice().reverse().map((item, idx) => (
              <div key={idx} className="p-4 bg-white rounded shadow">
                <p className="text-sm text-gray-500">{new Date(item.createdAt).toLocaleString()}</p>
                <p className="font-semibold">Topic: {item.topic}</p>
                <p className="text-sm">Level: {item.level} | Duration: {item.duration} months</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default History;
