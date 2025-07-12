import React from 'react';
// Assuming 'user' object structure from the backend search results

const UserCard = ({ user }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl transition transform hover:scale-105 duration-300 ease-in-out border-t-4 border-teal-500 animate-fadeInUp">
      <div className="flex items-center space-x-6 mb-6">
        <img 
          src={user.profilePhoto || 'https://via.placeholder.com/80'} 
          alt={user.name} 
          className="w-20 h-20 rounded-full object-cover border-2 border-teal-300"
        />
        <div>
          <h3 className="text-3xl font-bold text-gray-900">{user.name}</h3>
          <p className="text-gray-600 text-lg">{user.location || 'Location not set'}</p>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-lg font-semibold text-teal-700">Skills Offered:</h4>
        <div className="flex flex-wrap gap-2 mt-2">
          {user.skillsOffered.length > 0 ? (
            user.skillsOffered.map((skill, index) => (
              <span key={index} className="bg-teal-100 text-teal-800 text-xs font-medium px-3 py-1 rounded-full">{skill}</span>
            ))
          ) : (
            <span className="text-gray-500 text-sm">No skills offered.</span>
          )}
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-lg font-semibold text-blue-700">Skills Wanted:</h4>
        <div className="flex flex-wrap gap-2 mt-2">
          {user.skillsWanted.length > 0 ? (
            user.skillsWanted.map((skill, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">{skill}</span>
            ))
          ) : (
            <span className="text-gray-500 text-sm">No skills wanted.</span>
          )}
        </div>
      </div>

      <button className="mt-8 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition duration-300 shadow-md">
        Request Swap
      </button>
    </div>
  );
};

export default UserCard;