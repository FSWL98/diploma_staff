import React from 'react';
import { AuthService } from '../../services/authService';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  if (!AuthService.isAuthenticated())
    return <Navigate to='/login' state={{ from: location }} replace />;

  return children;
};

export default PrivateRoute;