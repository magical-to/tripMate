import React from 'react';
import { useNavigate } from 'react-router-dom';
// import { isTokenValid } from '../utils/tokenUtils'; // 파일 경로에 맞춰 임포트
import Header from '../Components/Header';  // Header 컴포넌트 경로
import Button from '../Components/Button';  // Button 컴포넌트 경로
import './Home.css';  // Home 페이지의 CSS 파일

const Home = () => {
  const navigate = useNavigate();

  // PLAN 버튼 클릭 시 호출되는 함수
  // const handlePlanClick = () => {
  //   const token = localStorage.getItem('access_token'); // 로컬 스토리지에서 토큰 가져오기
    
  //   if (isTokenValid(token)) {
  //     // 유효한 토큰이 있을 경우 plan 페이지로 이동
  //     navigate('/plan');
  //   } else {
  //     // 토큰이 없거나 유효하지 않을 경우 경고 메시지 표시 후 로그인 페이지로 이동
  //     alert('로그인 후 이용 가능합니다. 로그인 페이지로 이동합니다.');
  //     navigate('/login');
  //   }
  // };

  return (
    <div>
      {/* 상단 헤더 컴포넌트 */}
      <Header />
      <div className="home-container">
        <div className="home-left">
          <h1>여행 준비의 모든 것, TripMate와 함께!</h1>
          <p>간편하게 여행 계획을 세워보세요.</p>
          <div className="button-container">
            {/* Button 컴포넌트로 PLAN! 버튼 구현, 클릭 시 handlePlanClick 호출 */}
            <Button 
              text="PLAN!!" 
              // onClick={handlePlanClick} 
              onClick={() => navigate('/go')}
            />
            {/* Button 컴포넌트로 로그인 버튼 구현 */}
            <Button 
              text="로그인" 
              onClick={() => navigate('/login')} 
            />
          </div>
        </div>
        <div className="home-right">
          {/* 여행 이미지를 넣을 수 있는 공간 */}
          <img src="지도 이미지 경로" alt="Map" />
        </div>
      </div>
    </div>
  );
}

export default Home;
