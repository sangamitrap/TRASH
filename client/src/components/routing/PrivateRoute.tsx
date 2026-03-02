import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../../../features/auth/authSlice';

const PrivateRoute: React.FC = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
