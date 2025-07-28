import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import ChatBot from './ChatBot';
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

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-center sm:text-left">
        Trending Skills Analysis
      </h1>
      
      {/* Domain Filter */}
      <div className="mb-4 sm:mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Domain
        </label>
        <select
          value={selectedDomain}
          onChange={(e) => setSelectedDomain(e.target.value)}
          className="input flex-1 border p-3 mt-1 block w-full pl-3 pr-10 py-2  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {domains.map((domain) => (
            <option key={domain} value={domain}>
              {domain}
            </option>
          ))}
        </select>
      </div>

      {/* Chart Container */}
      <div className="bg-white p-2 sm:p-6 rounded-lg shadow-lg mb-4 sm:mb-8">
        <div className="h-[300px] sm:h-[400px] md:h-[500px] w-full">
          {chartData && (
            <Line data={chartData} options={chartOptions} />
          )}
        </div>
      </div>

      {/* Skills List */}
      <div className="bg-white p-2 sm:p-6 rounded-lg shadow-lg">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-center sm:text-left">
          Top Skills in {selectedDomain}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
          {selectedSkills.map((skill) => (
            <div
              key={skill}
              className="p-3 sm:p-4 border rounded-lg hover:shadow-md transition-shadow"
            >
              <h3 className="font-medium text-sm sm:text-base">{skill}</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                Growth: <span className="text-green-600">{calculateGrowth(skill)}%</span>
              </p>
            </div>
          ))}
        </div>
      </div>
      <ChatBot />
    </div>
  );
};

export default TrendingSkills; 