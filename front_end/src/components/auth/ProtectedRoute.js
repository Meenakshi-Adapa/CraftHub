import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowGuest }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated && !allowGuest) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;