import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config/api";
import {
  FaHistory,
  FaBrain,
  FaMap,
  FaCalendar,
  FaClock,
  FaChartLine,
  FaUserTie,
} from "react-icons/fa";
import { HiAcademicCap, HiSparkles } from "react-icons/hi";

const History = () => {
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [roadmapHistory, setRoadmapHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`${API_URL}/api/users/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnalysisHistory(data.analysisHistory || []);
        setRoadmapHistory(data.roadmapHistory || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your activity history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-error-100 rounded-full flex items-center justify-center text-error-600 mx-auto mb-6">
            <FaHistory className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Error Loading History
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-responsive">
        {/* Header Section */}
        <div className="text-center mb-12 animate-on-scroll">
          <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
            <FaHistory className="w-4 h-4 mr-2" />
            Activity History
          </div>
          <button
            className="btn btn-dangern bg-red-500 btn-sm mt-2 ml-8 text-white"
            onClick={async () => {
              if (window.confirm('Are you sure you want to clear all your history? This action cannot be undone.')) {
                try {
                  const token = localStorage.getItem('token');
                  await axios.delete(`${API_URL}/api/users/history/clear`, {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  setAnalysisHistory([]);
                  setRoadmapHistory([]);
                } catch (err) {
                  alert('Failed to clear history. Please try again.');
                }
              }
            }}
          >
            Clear History
          </button>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            Your Learning
            <span className="gradient-text block">Journey</span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Track your progress and revisit your skill analyses and learning
            roadmaps
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Analysis History */}
          <div className="animate-on-scroll" style={{ animationDelay: "0.1s" }}>
            <div className="card p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-white">
                  <FaBrain className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Recent Skill Analyses
                  </h2>
                  <p className="text-sm text-gray-600">
                    {analysisHistory.length} analyses completed
                  </p>
                </div>
              </div>

              {analysisHistory.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HiSparkles className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No analyses yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Start your journey by analyzing your skills
                  </p>
                  <a href="/skills-analysis" className="btn btn-primary btn-sm">
                    Analyze Skills
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  {analysisHistory
                    .slice()
                    .reverse()
                    .map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <FaUserTie className="w-4 h-4 text-primary-600" />
                            <h3 className="font-semibold text-gray-900">
                              {item.targetRole}
                            </h3>
                          </div>
                          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                            {formatDate(item.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <FaBrain className="w-3 h-3" />
                            <span>{item.skills.length} skills</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FaChartLine className="w-3 h-3" />
                            <span>Analysis completed</span>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {item.skills.slice(0, 3).map((skill, skillIdx) => (
                            <span key={skillIdx} className="skill-tag text-xs">
                              {skill.name}
                            </span>
                          ))}
                          {item.skills.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{item.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Roadmap History */}
          <div className="animate-on-scroll" style={{ animationDelay: "0.2s" }}>
            <div className="card p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-secondary-500 to-accent-500 rounded-xl flex items-center justify-center text-white">
                  <FaMap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Generated Roadmaps
                  </h2>
                  <p className="text-sm text-gray-600">
                    {roadmapHistory.length} roadmaps created
                  </p>
                </div>
              </div>

              {roadmapHistory.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HiAcademicCap className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No roadmaps yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Create your first learning roadmap
                  </p>
                  <a href="/roadmap" className="btn btn-secondary btn-sm">
                    Create Roadmap
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  {roadmapHistory
                    .slice()
                    .reverse()
                    .map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <HiAcademicCap className="w-4 h-4 text-secondary-600" />
                            <h3 className="font-semibold text-gray-900">
                              {item.topic}
                            </h3>
                          </div>
                          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                            {formatDate(item.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center space-x-1">
                            <FaCalendar className="w-3 h-3" />
                            <span>{item.duration} months</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FaClock className="w-3 h-3" />
                            <span>{item.level}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            Learning path generated
                          </span>
                          <a
                            href="/roadmap"
                            className="text-xs text-secondary-600 hover:text-secondary-700 font-medium"
                          >
                            View Details →
                          </a>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div
          className="card p-8 mt-8 animate-on-scroll"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Your Learning Summary
            </h3>
            <p className="text-gray-600">
              Track your progress and achievements
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                {analysisHistory.length}
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-1">
                Skill Analyses
              </h4>
              <p className="text-gray-600">Completed assessments</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                {roadmapHistory.length}
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-1">
                Roadmaps
              </h4>
              <p className="text-gray-600">Learning paths created</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-primary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                {analysisHistory.reduce(
                  (total, item) => total + item.skills.length,
                  0
                )}
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-1">
                Skills Tracked
              </h4>
              <p className="text-gray-600">Total skills analyzed</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-success-500 to-primary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                {Math.max(analysisHistory.length, roadmapHistory.length)}
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-1">
                Active Days
              </h4>
              <p className="text-gray-600">Days with activity</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
