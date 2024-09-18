import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../Services/authService';
import Button from '../Components/Button'; 
import Form from '../Components/Form';     
import Header from '../Components/Header';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // API 관련 함수
  const handleLogin = async () => {
    try {
      const data = await login(username, password);
      console.log('Login successful:', data);
      navigate('/plan'); // plan 페이지로 리다이렉트
    } 
    catch (error) {
        console.error('Login error:', error);
        // 로그인 실패 후의 처리 (예: 에러 메시지 표시)
    }
  };

  const goSignup = () => {
    navigate('/signup'); // 회원가입 페이지로 리다이렉트
  };

  return (
    <div>
      <Header showButton={false} /> {/* Header에서 Button 제외 */}
      <div className="login-container">
        <h2>TripMate</h2>
        <div className="login-form">
          <Form
            id="user_id"
            // label="아이디"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="아이디"
            className="login-username"
          />
  
          <Form
            id="password"
            // label="비밀번호"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            className="login-password"
          />
          <Button 
            onClick={handleLogin} 
            text="로그인" 
            className="login-button" 
          />
          <div className="remember-me">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">로그인 상태 유지</label>
          </div>
          <Button
            onClick={goSignup}
            text="회원가입"
            className='go-signup-button'
          />
        </div>
      </div>
    </div>
  );  
};

export default Login;
