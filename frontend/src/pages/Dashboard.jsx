import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch detailed profile data from the backend
    const fetchProfile = async () => {
      try {
        // We use the proxy defined in package.json to route to the backend
        const response = await axios.get('/api/users/me'); 
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="text-center p-8">Loading profile...</div>;
  if (!profile) return <div className="text-center p-8 text-red-500">Error loading profile.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <nav className="flex justify-between items-center mb-10 pb-4 border-b border-gray-200">
        <h1 className="text-4xl font-extrabold text-teal-700">Skill Swap Platform</h1>
        <button 
          onClick={logout} 
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg transition duration-200 shadow-md"
        >
          Logout
        </button>
      </nav>

      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-xl p-10 transform transition duration-500 hover:shadow-3xl hover:scale-[1.01]">
        <div className="flex items-center space-x-8 mb-8">
          <img 
            src={profile.profilePhoto || 'https://via.placeholder.com/150'} 
            alt="Profile" 
            className="w-32 h-32 rounded-full border-4 border-teal-500 shadow-lg object-cover"
          />
          <div>
            <h2 className="text-5xl font-bold text-gray-800 animate-fadeIn">{profile.name}</h2>
            <p className="text-gray-600 mt-2 text-lg">Location: {profile.location || 'Not specified'}</p>
            <p className="text-gray-500 text-sm">Profile Status: {profile.isPublic ? 'Public' : 'Private'}</p>
          </div>
        </div>

        {/* Skills Offered */}
        <div className="bg-teal-50 p-6 rounded-lg mb-8 shadow-inner animate-slideInLeft">
          <h3 className="text-2xl font-semibold text-teal-800 mb-4 border-b border-teal-300 pb-2">Skills Offered</h3>
          <div className="flex flex-wrap gap-3">
            {profile.skillsOffered.length > 0 ? (
              profile.skillsOffered.map((skill, index) => (
                <span key={index} className="bg-teal-600 text-white text-sm font-medium px-4 py-1 rounded-full shadow-md hover:bg-teal-700 transition duration-200 cursor-pointer animate-popIn">
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-gray-500">No skills listed yet.</p>
            )}
          </div>
        </div>

        {/* Skills Wanted */}
        <div className="bg-blue-50 p-6 rounded-lg mb-8 shadow-inner animate-slideInRight">
          <h3 className="text-2xl font-semibold text-blue-800 mb-4 border-b border-blue-300 pb-2">Skills Wanted</h3>
          <div className="flex flex-wrap gap-3">
            {profile.skillsWanted.length > 0 ? (
              profile.skillsWanted.map((skill, index) => (
                <span key={index} className="bg-blue-600 text-white text-sm font-medium px-4 py-1 rounded-full shadow-md hover:bg-blue-700 transition duration-200 cursor-pointer animate-popIn">
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-gray-500">No skills wanted yet.</p>
            )}
          </div>
        </div>

        {/* Availability and Edit Profile button */}
        <div className="text-center mt-10">
          <p className="text-gray-700 mb-4">Availability: {profile.availability.join(', ') || 'Not specified'}</p>
          <button 
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-10 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
            // You would link this to the edit profile page/modal
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;