import React from 'react';
import logo from '../assets/app_logo.png'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import Button from './Button';
import Modal from './Modal';
import userIcon from '../assets/user.png';


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

const Header = ({ showButton = true }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  // 로그아웃 함수
  const handleLogout = () => {
    localStorage.removeItem('access_token'); // 토큰 삭제
    navigate('/'); // 메인 페이지로 이동
    setUserId(''); // 상태 업데이트로 UI 리렌더링
  };

  // 모달 열기/닫기 함수
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // 내 여정으로 가는 함수
  const navigateToJourney = () => {
    navigate(''); // 내 여정 페이지로 이동 
  }

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
        {showButton && (
          userId ? (
            <>
              <span className="user-id">{userId}님</span> {/* userId 표시 */}
              <img
                src={userIcon}
                alt="User Icon"
                className="user-icon"
                onClick={toggleModal}
                style={{ cursor: 'pointer' }}
              />
              {isModalOpen && (
                <Modal 
                  onClose={toggleModal} 
                  customClass="header-modal" 
                >
                  <Button
                    onClick={handleLogout}
                    text="로그아웃"
                    customClass="logout-button"
                  />
                  <Button
                    onClick={navigateToJourney}
                    text="내 여정"
                    customClass="go-mytrip"
                  />
                </Modal>
              )}
            </>
          ) : (
            <Button 
              text="로그인" 
              onClick={() => navigate('/login')}
              customClass="login-button"
            />
          )
        )}
      </div>
    </header>
  );
};

export default Header;
