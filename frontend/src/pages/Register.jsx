import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { login } = useContext(AuthContext); // We can reuse the login function after registration
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      // Send registration data to the backend API endpoint
      const response = await axios.post('/api/auth/register', {
        name,
        email,
        password,
      });

      // If registration is successful, automatically log the user in using the received token
      const { token, ...userData } = response.data;
      
      // Store user data and token in local storage and update context
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Update Axios default header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Update AuthContext state
      login(email, password); // Note: Since we have the token already, we could simplify this by directly updating the context state with the received user data, but calling `login` is safe if it's adapted to handle this case.
      
      setSuccess('Registration successful! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/'); // Redirect to the dashboard
      }, 1500);

    } catch (err) {
      console.error('Registration error:', err.response?.data || err);
      // Display error message from backend if available, otherwise a generic error
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-2xl max-w-lg w-full transition-all duration-300 transform hover:shadow-3xl animate-fadeIn">
        <h2 className="text-4xl font-extrabold mb-8 text-center text-teal-700">Create Account</h2>
        
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-6">{error}</div>}
        {success && <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg mb-6">{success}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-lg font-semibold mb-2">Name</label>
            <input 
              type="text" 
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-3 focus:ring-teal-500 transition duration-300 text-lg" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-lg font-semibold mb-2">Email</label>
            <input 
              type="email" 
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-3 focus:ring-teal-500 transition duration-300 text-lg" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-lg font-semibold mb-2">Password</label>
            <input 
              type="password" 
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-3 focus:ring-teal-500 transition duration-300 text-lg" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-lg font-semibold mb-2">Confirm Password</label>
            <input 
              type="password" 
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-3 focus:ring-teal-500 transition duration-300 text-lg" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-teal-600 hover:bg-teal-800 text-white font-extrabold py-4 rounded-xl shadow-lg transition duration-400 transform hover:scale-105 hover:shadow-2xl"
          >
            Register
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600 text-lg">
            Already have an account? <Link to="/login" className="text-teal-600 hover:underline font-bold">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;