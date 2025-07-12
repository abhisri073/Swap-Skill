import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

// A simple reusable Header component with navigation and logout functionality
const Header = ({ title }) => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white shadow-md mb-10 py-6 px-12 rounded-xl flex justify-between items-center animate-fadeInDown">
            <div className="flex items-center space-x-8">
                <Link to="/" className="text-4xl font-extrabold text-teal-700 hover:text-teal-900 transition duration-300">
                    Skill Swap
                </Link>
                <h1 className="text-2xl font-semibold text-gray-800 border-l-2 pl-6 border-teal-500">
                    {title}
                </h1>
            </div>

            <nav className="flex items-center space-x-6">
                <Link to="/" className="text-gray-700 hover:text-teal-600 font-medium transition duration-200">
                    Dashboard
                </Link>
                <Link to="/search" className="text-gray-700 hover:text-teal-600 font-medium transition duration-200">
                    Search
                </Link>
                <Link to="/swaps" className="text-gray-700 hover:text-teal-600 font-medium transition duration-200">
                    Swaps
                </Link>
                
                {user && (
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-800 font-bold">Welcome, {user.name}</span>
                        <button 
                            onClick={handleLogout} 
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition duration-200 shadow-md transform hover:scale-105"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;