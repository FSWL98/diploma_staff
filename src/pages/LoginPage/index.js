import React,  {useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginForm from '../../components/LoginForm';
import { AuthService } from '../../services/authService';

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (AuthService.isAuthenticated())
      navigate('/events', { replace: true });
  }, [])

  const onLoginSuccess = () => {
    const from = location.state?.from?.pathname || '/events'
    navigate(from, { replace: true });
  };
  return <LoginForm onLoginSuccess={onLoginSuccess} />
};

export default LoginPage;