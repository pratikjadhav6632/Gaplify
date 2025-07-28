import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [profile, setProfile] = useState(null);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(data.user);
      } catch (err) {
        console.error('Failed to load profile', err);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className='flex justify-between items-center'>
      <h2 className="text-2xl font-bold mb-4 text-center">Profile</h2>
      <p className="text-lg font-semibold"> <span className="font-normal h-1 w-4 p-3 mt-2 rounded-lg bg-yellow-500 text-white">{user?.planType||"Free"}</span></p>
      </div>
      <div className="mb-6">
        {profile && (
          <>
            <p className="text-lg font-semibold">Username: <span className="font-normal">{profile.username}</span></p>
            <p className="text-lg font-semibold">Email: <span className="font-normal">{profile.email}</span></p>
            <h3 className="text-lg font-semibold mt-4 mb-2">Skills</h3>
            {profile.skills.length === 0 ? (
              <p>No skills added yet.</p>
            ) : (
              <ul className="list-disc list-inside">
                {profile.skills.map((skill, idx) => (
                  <li key={idx}>{skill.name} - {skill.proficiency}</li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">Company Policy</button>
        <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">Feedback</button>
        <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">FAQ</button>
        <button onClick={handleLogout} className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition">Logout</button>
      </div>
    </div>
  );
};

export default Profile; 