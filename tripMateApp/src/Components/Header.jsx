import React from 'react';
import logo from '../assets/app_logo.png'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import Button from './Button';

// 토큰값 디코딩 함수
function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
}

const Header = () => {
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      const jwtToken = token.split(' ')[1]; // 'Bearer ' 제거
      try {
        const decodedToken = parseJwt(jwtToken);
        setUserId(decodedToken.userid); // userId 설정
      } catch (error) {
        console.error("토큰 디코딩 중 오류 발생", error);
      }
    }
  }, []);

  // 로그아웃 함수
  const handleLogout = () => {
    localStorage.removeItem('access_token'); // 토큰 삭제
    navigate('/'); // 메인 페이지로 이동
    setUserId(''); // 상태 업데이트로 UI 리렌더링
  };

  return (
    <header className="header">
      <div className="header-left">
        <img 
          src={logo} 
          alt="TripMate Logo" 
          className="logo" 
          onClick={() => navigate('/')} 
          style={{ cursor: 'pointer' }} 
        />
        <h1>TripMate</h1>
      </div>
      <div className="header-right">
        <img 
          src="https://img.icons8.com/material-outlined/24/000000/user.png" 
          alt="User Icon" 
          className="user-icon" 
        />
        {userId ? (
          <>
            <span className="user-id">{userId}</span> {/* userId 표시 */}
            <Button
              text="로그아웃"
              onClick={handleLogout}
              className="logout-button"
            />
          </>
        ) : (
          <Button 
            text="로그인" 
            onClick={() => navigate('/login')}
            className="login-button"
          />
        )}
      </div>
    </header>
  );
};

export default Header;
