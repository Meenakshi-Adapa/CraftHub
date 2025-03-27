import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedArtistRoute = ({ children }) => {
  const { user, token, loading } = useAuth();

  if (loading) {
    return null; // or a loading spinner component
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'artist') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedArtistRoute;