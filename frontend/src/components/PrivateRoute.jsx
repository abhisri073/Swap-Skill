import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="text-center p-20">Loading...</div>; // Or a proper loading spinner
  }

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;