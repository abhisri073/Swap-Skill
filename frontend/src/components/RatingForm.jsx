import React, { useState } from 'react';
import axios from 'axios';

const RatingForm = ({ ratedUserId, swapId, onClose, onSubmitSuccess }) => {
    const [rating, setRating] = useState(5); // Default rating
    const [comment, setComment] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await axios.post('/api/ratings', {
                ratedUserId,
                swapId,
                rating,
                comment,
            });

            onSubmitSuccess(); // Notify parent component (e.g., SwapsPage)
            onClose(); // Close the modal/form

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit rating.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 bg-white rounded-lg shadow-2xl">
            <h3 className="text-3xl font-bold text-teal-700 mb-6">Rate this Swap</h3>
            {error && <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Rating (1-5)</label>
                    <input
                        type="number"
                        min="1"
                        max="5"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Comment (Optional)</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full p-3 border rounded-lg h-32 focus:ring-2 focus:ring-teal-500"
                        placeholder="Share your experience..."
                    />
                </div>
                
                <div className="flex justify-end space-x-4">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="bg-gray-300 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-400 transition duration-200 font-medium"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-teal-600 text-white py-3 px-8 rounded-lg hover:bg-teal-700 transition duration-300 font-bold disabled:bg-gray-400"
                    >
                        {loading ? 'Submitting...' : 'Submit Rating'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RatingForm;