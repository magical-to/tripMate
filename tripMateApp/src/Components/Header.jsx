import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/app_logo.png';
import userIcon from '../assets/user.png';
import './Header.css';
import Button from './Button';
import Modal from './Modal';
import { loginCheck } from '../Services/authService';

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
    navigate('/mytrip'); // 내 여정 페이지로 이동 
  };

  useEffect(() => {
    const fetchUserId = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
          const result = await loginCheck(token); // 비동기 함수 호출
          // 서버 응답 처리
          if (result.success === false) {
            // 로그인 페이지로 이동
            alert("사용자 세션이 만료되었습니다. 다시 로그인을 진행해주세요!");
            navigate("/login"); // 로그인 페이지로 리다이렉트
          } else {
            // 성공적으로 userId 설정
            setUserId(result.userid); // userId 설정
          }
        } 
    };
    fetchUserId(); 
  }, [navigate]); 
  
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
