import { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(data.user);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Profile</h1>
      <div className="bg-white p-6 rounded shadow">
        <p className="font-semibold mb-2">Username: {user.username}</p>
        <p className="mb-4">Email: {user.email}</p>
        <h2 className="text-xl font-semibold mb-2">Skills</h2>
        {user.skills.length === 0 ? (
          <p>No skills added yet.</p>
        ) : (
          <ul className="list-disc list-inside">
            {user.skills.map((skill, idx) => (
              <li key={idx}>{skill.name} - {skill.proficiency}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Profile;
