import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import ChatBot from './ChatBot';
import { FaChartLine, FaFilter, FaArrowUp, FaIndustry, FaGraduationCap, FaRocket } from 'react-icons/fa';
import { HiLightningBolt, HiSparkles } from 'react-icons/hi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const domains = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Manufacturing',
  'Marketing',
  'Energy',
  'Transportation'
];

const domainIcons = {
  Technology: FaRocket,
  Healthcare: FaIndustry,
  Finance: FaChartLine,
  Education: FaGraduationCap,
  Manufacturing: FaIndustry,
  Marketing: FaArrowUp,
  Energy: HiLightningBolt,
  Transportation: FaRocket
};

const mockData = {
  Technology: {
    'Artificial Intelligence': [30, 45, 65, 85, 95],
    'Cloud Computing': [40, 55, 70, 85, 90],
    'Cybersecurity': [35, 50, 65, 80, 85],
    'Data Science': [25, 40, 60, 75, 85],
    'DevOps': [30, 45, 60, 75, 85],
    'Blockchain': [20, 35, 50, 65, 80],
    'IoT Development': [25, 40, 55, 70, 80],
    'Quantum Computing': [15, 25, 40, 55, 70],
  },
  Healthcare: {
    'Digital Health': [20, 35, 50, 65, 80],
    'Telemedicine': [15, 30, 45, 60, 75],
    'Health Analytics': [25, 40, 55, 70, 85],
    'Medical AI': [10, 25, 40, 55, 70],
    'Genomics': [20, 35, 50, 65, 80],
    'Healthcare IoT': [15, 30, 45, 60, 75],
    'Medical Robotics': [10, 25, 40, 55, 70],
    'Precision Medicine': [15, 30, 45, 60, 75],
  },
  Finance: {
    'FinTech Development': [25, 40, 55, 70, 85],
    'Blockchain Finance': [20, 35, 50, 65, 80],
    'AI in Trading': [15, 30, 45, 60, 75],
    'Risk Analytics': [30, 45, 60, 75, 85],
    'Digital Banking': [25, 40, 55, 70, 85],
    'Cryptocurrency': [20, 35, 50, 65, 80],
    'RegTech': [15, 30, 45, 60, 75],
    'Financial Data Science': [25, 40, 55, 70, 85],
  },
  Education: {
    'EdTech Development': [25, 40, 55, 70, 85],
    'Learning Analytics': [20, 35, 50, 65, 80],
    'AI in Education': [15, 30, 45, 60, 75],
    'Virtual Reality Learning': [10, 25, 40, 55, 70],
    'Adaptive Learning': [20, 35, 50, 65, 80],
    'Educational Data Mining': [15, 30, 45, 60, 75],
    'Digital Assessment': [25, 40, 55, 70, 85],
    'Learning Experience Design': [20, 35, 50, 65, 80],
  },
  Manufacturing: {
    'Industrial IoT': [20, 35, 50, 65, 80],
    'Smart Manufacturing': [25, 40, 55, 70, 85],
    'Robotics Process Automation': [15, 30, 45, 60, 75],
    'Predictive Maintenance': [20, 35, 50, 65, 80],
    'Digital Twin Technology': [10, 25, 40, 55, 70],
    'Additive Manufacturing': [15, 30, 45, 60, 75],
    'Supply Chain Analytics': [25, 40, 55, 70, 85],
    'Quality Control AI': [20, 35, 50, 65, 80],
  },
  Marketing: {
    'Digital Marketing': [30, 45, 60, 75, 85],
    'Marketing Analytics': [25, 40, 55, 70, 85],
    'AI in Marketing': [15, 30, 45, 60, 75],
    'Social Media Marketing': [35, 50, 65, 80, 90],
    'Content Marketing': [30, 45, 60, 75, 85],
    'Marketing Automation': [25, 40, 55, 70, 85],
    'SEO/SEM': [30, 45, 60, 75, 85],
    'Marketing Data Science': [20, 35, 50, 65, 80],
  },
  Energy: {
    'Renewable Energy Tech': [25, 40, 55, 70, 85],
    'Smart Grid Technology': [20, 35, 50, 65, 80],
    'Energy Analytics': [15, 30, 45, 60, 75],
    'Energy Storage': [20, 35, 50, 65, 80],
    'Carbon Capture': [15, 30, 45, 60, 75],
    'Energy IoT': [20, 35, 50, 65, 80],
    'Smart Metering': [25, 40, 55, 70, 85],
    'Energy Management Systems': [20, 35, 50, 65, 80],
  },
  Transportation: {
    'Autonomous Vehicles': [15, 30, 45, 60, 75],
    'Smart Transportation': [20, 35, 50, 65, 80],
    'Fleet Management': [25, 40, 55, 70, 85],
    'Transportation Analytics': [20, 35, 50, 65, 80],
    'Electric Vehicle Tech': [25, 40, 55, 70, 85],
    'Logistics Optimization': [30, 45, 60, 75, 85],
    'Transportation IoT': [20, 35, 50, 65, 80],
    'Smart City Mobility': [15, 30, 45, 60, 75],
  }
};

const years = ['2019', '2020', '2021', '2022', '2023'];

const TrendingSkills = () => {
  const [selectedDomain, setSelectedDomain] = useState('Technology');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (selectedDomain && mockData[selectedDomain]) {
      const skills = Object.keys(mockData[selectedDomain]);
      setSelectedSkills(skills);
      updateChartData(skills);
    }
  }, [selectedDomain]);

  const updateChartData = (skills) => {
    if (!skills || !selectedDomain || !mockData[selectedDomain]) return;

    const datasets = skills.map((skill, index) => ({
      label: skill,
      data: mockData[selectedDomain][skill],
      borderColor: `hsl(${index * 360 / skills.length}, 70%, 50%)`,
      tension: 0.4,
    }));

    setChartData({
      labels: years,
      datasets,
    });
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: window.innerWidth < 768 ? 10 : 12
          }
        }
      },
      title: {
        display: true,
        text: `Trending Skills in ${selectedDomain} (2019-2023)`,
        font: {
          size: window.innerWidth < 768 ? 14 : 16
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Trend Score (0-100)',
          font: {
            size: window.innerWidth < 768 ? 10 : 12
          }
        },
        ticks: {
          font: {
            size: window.innerWidth < 768 ? 8 : 10
          }
        }
      },
      x: {
        ticks: {
          font: {
            size: window.innerWidth < 768 ? 8 : 10
          }
        }
      }
    },
  };

  const calculateGrowth = (skill) => {
    if (!selectedDomain || !mockData[selectedDomain] || !mockData[selectedDomain][skill]) {
      return 0;
    }
    const skillData = mockData[selectedDomain][skill];
    return skillData[4] - skillData[0];
  };

  const getGrowthColor = (growth) => {
    if (growth >= 50) return 'text-success-600';
    if (growth >= 30) return 'text-primary-600';
    if (growth >= 15) return 'text-warning-600';
    return 'text-gray-600';
  };

  const DomainIcon = domainIcons[selectedDomain] || FaChartLine;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-responsive">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
            <FaChartLine className="w-4 h-4 mr-2" />
            Market Intelligence
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            Trending Skills
            <span className="gradient-text block">Analysis</span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay ahead of the curve with real-time insights into the most in-demand skills across industries
          </p>
        </div>
      
        {/* Domain Filter */}
        <div className="card p-6 mb-8" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center space-x-3 mb-4">
            <FaFilter className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">Select Industry Domain</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {domains.map((domain) => {
              const Icon = domainIcons[domain] || FaChartLine;
              return (
                <button
                  key={domain}
                  onClick={() => setSelectedDomain(domain)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 group ${
                    selectedDomain === domain
                      ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-medium'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-primary-300 hover:bg-primary-50'
                  }`}
                >
                  <div className="text-center">
                    <Icon className={`w-6 h-6 mx-auto mb-2 group-hover:scale-110 transition-transform ${
                      selectedDomain === domain ? 'text-primary-600' : 'text-gray-400'
                    }`} />
                    <span className="text-xs font-medium">{domain}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chart Container */}
        <div className="card p-6 mb-8" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-white">
                <DomainIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{selectedDomain} Trends</h2>
                <p className="text-sm text-gray-600">Skill demand over the last 5 years</p>
              </div>
            </div>
          </div>
          <div className="h-[400px] md:h-[500px] w-full">
            {chartData && (
              <Line data={chartData} options={chartOptions} />
            )}
          </div>
        </div>

        {/* Skills List */}
        <div className="card p-6" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <HiSparkles className="w-6 h-6 text-accent-500" />
              <h2 className="text-xl font-semibold text-gray-900">
                Top Skills in {selectedDomain}
              </h2>
            </div>
            <div className="text-sm text-gray-600">
              {selectedSkills.length} skills analyzed
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedSkills.map((skill, index) => {
              const growth = calculateGrowth(skill);
              return (
                <div
                  key={skill}
                  className="p-4 border border-gray-200 rounded-xl hover:shadow-medium transition-all duration-200 group hover:border-primary-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
                      {skill}
                    </h3>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getGrowthColor(growth)} bg-opacity-10`}>
                      +{growth}%
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Growth Rate</span>
                      <span className={`font-medium ${getGrowthColor(growth)}`}>
                        {growth > 0 ? '+' : ''}{growth}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          growth >= 50 ? 'bg-success-500' :
                          growth >= 30 ? 'bg-primary-500' :
                          growth >= 15 ? 'bg-warning-500' :
                          'bg-gray-400'
                        }`}
                        style={{ width: `${Math.min((growth / 80) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Insights Section */}
        <div className="card p-6 mt-8" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-primary-50 rounded-xl">
              <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white mx-auto mb-3">
                <FaArrowUp className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Highest Growth</h4>
              <p className="text-sm text-gray-600">
                {selectedSkills.reduce((max, skill) => {
                  const growth = calculateGrowth(skill);
                  return growth > max.growth ? { skill, growth } : max;
                }, { skill: '', growth: 0 }).skill}
              </p>
            </div>
            <div className="text-center p-4 bg-secondary-50 rounded-xl">
              <div className="w-12 h-12 bg-secondary-500 rounded-full flex items-center justify-center text-white mx-auto mb-3">
                <HiLightningBolt className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Emerging Skills</h4>
              <p className="text-sm text-gray-600">
                {selectedSkills.filter(skill => calculateGrowth(skill) >= 40).length} skills
              </p>
            </div>
            <div className="text-center p-4 bg-accent-50 rounded-xl">
              <div className="w-12 h-12 bg-accent-500 rounded-full flex items-center justify-center text-white mx-auto mb-3">
                <FaChartLine className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Market Demand</h4>
              <p className="text-sm text-gray-600">
                {Math.round(selectedSkills.reduce((sum, skill) => sum + calculateGrowth(skill), 0) / selectedSkills.length)}% avg growth
              </p>
            </div>
          </div>
        </div>
      </div>
      <ChatBot />
    </div>
  );
};

export default TrendingSkills; 