import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserCard from '../components/UserCard.jsx';
import Header from '../components/Header.jsx'; // Assuming a generic header component

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Use the Vite proxy to call the backend: GET /api/users/search?skill=photoshop
      const response = await axios.get(`/api/users/search?skill=${searchTerm}`);
      setResults(response.data);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to fetch search results.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Header title="Search Skills" />
      
      <div className="max-w-xl mx-auto mb-8 bg-white p-6 rounded-xl shadow-lg">
        <form onSubmit={handleSearch} className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search for a skill (e.g., Photoshop or Excel)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow px-5 py-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition duration-200 text-lg"
            required
          />
          <button 
            type="submit" 
            className="bg-teal-600 text-white px-8 py-3 rounded-lg hover:bg-teal-700 transition duration-300 font-semibold"
          >
            Search
          </button>
        </form>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {loading && <p className="text-center col-span-full">Loading search results...</p>}
        {error && <p className="text-center col-span-full text-red-500">{error}</p>}
        
        {!loading && results.length === 0 && searchTerm !== '' && (
          <p className="text-center col-span-full text-gray-600">No users found offering or wanting "{searchTerm}".</p>
        )}

        {results.map(user => (
          <UserCard key={user._id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;