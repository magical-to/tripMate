import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 hook

  return (
    <div className="home-container">
      <h1>Welcome to TripMate</h1>
      <div className="button-container">
        <button className="auth-button" onClick={() => navigate('/login')}>
          Login
        </button>
        <button className="auth-button" onClick={() => navigate('/signup')}>
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Home;