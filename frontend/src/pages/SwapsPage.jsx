// frontend/src/pages/SwapsPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Header from '../components/Header.jsx';
import socket from '../socket.js'; // Import the socket instance
import { AuthContext } from '../context/AuthContext.jsx'; // To check current user ID

const SwapsPage = () => {
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext); // Get current user from context

  useEffect(() => {
    fetchSwaps();

    // Listen for real-time swap updates
    socket.on('newSwapRequest', (data) => {
      console.log('New swap request received:', data.message, data.swap);
      // Only update if the current user is the receiver
      if (user && data.swap.receiverId._id === user._id) {
        fetchSwaps(); // Re-fetch all swaps to get the latest list
        // Or you can directly add the new swap to the state for a smoother UX
        // setSwaps(prevSwaps => [data.swap, ...prevSwaps]);
      }
    });

    socket.on('swapStatusUpdated', (data) => {
      console.log('Swap status updated:', data.message, data.swap);
      // Update if the current user is either sender or receiver of the updated swap
      if (user && (data.swap.senderId._id === user._id || data.swap.receiverId._id === user._id)) {
        fetchSwaps(); // Re-fetch to ensure consistency
        // Or update the specific swap in state
      }
    });

    return () => {
      // Clean up socket listeners on component unmount
      socket.off('newSwapRequest');
      socket.off('swapStatusUpdated');
    };
  }, [user]); // Re-run effect if user changes (e.g., after login/logout)

  const fetchSwaps = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/swaps/me');
      setSwaps(response.data);
    } catch (err) {
      setError('Failed to load swap requests.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (swapId, status) => {
    try {
      await axios.put(`/api/swaps/${swapId}/status`, { status });
      // The socket event will trigger a re-fetch, so no need to call fetchSwaps() here
      // fetchSwaps(); 
    } catch (err) {
      console.error(`Failed to update swap status to ${status}`, err.response?.data || err);
      // Use a custom modal or toast notification instead of alert()
      alert(`Error: ${err.response?.data?.message || 'Could not update the request.'}`);
    }
  };

  if (loading) return <div className="text-center p-10">Loading swaps...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Header title="Swap Requests" />

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">My Swaps ({swaps.length})</h2>
        
        {swaps.length === 0 ? (
          <div className="text-center py-10 text-gray-500">You have no swap requests.</div>
        ) : (
          <div className="space-y-6">
            {swaps.map((swap) => (
              <div key={swap._id} className="border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg transition duration-200 bg-gray-50">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xl font-semibold text-teal-800">
                      <span className="font-bold">{swap.senderId.name}</span> wants to swap <span className="font-bold text-blue-700">{swap.senderSkill}</span> for <span className="font-bold text-green-700">{swap.receiverSkill}</span> with <span className="font-bold">{swap.receiverId.name}</span>
                    </p>
                    {swap.message && <p className="text-sm text-gray-600 mt-2 italic">"{swap.message}"</p>}
                    <p className="text-sm text-gray-500 mt-2">Status: 
                      <span className={`font-bold ml-1 ${
                        swap.status === 'pending' ? 'text-yellow-600' : 
                        swap.status === 'accepted' ? 'text-green-600' : 
                        'text-red-600'
                      }`}>
                        {swap.status.toUpperCase()}
                      </span>
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(swap.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex space-x-3 mt-4">
                  {/* Conditional rendering for actions based on status and user role */}
                  {swap.status === 'pending' && user && (
                    <>
                      {/* If current user is the receiver */}
                      {swap.receiverId._id === user._id && (
                        <>
                          <button 
                            onClick={() => handleStatusUpdate(swap._id, 'accepted')}
                            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition duration-200"
                          >
                            Accept
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(swap._id, 'rejected')}
                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition duration-200"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {/* If current user is the sender */}
                      {swap.senderId._id === user._id && (
                        <button 
                          onClick={() => handleStatusUpdate(swap._id, 'deleted')}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md transition duration-200"
                        >
                          Delete Request
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SwapsPage;