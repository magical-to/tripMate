import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header';  // Header 컴포넌트 경로
import Button from '../Components/Button';  // Button 컴포넌트 경로
import './Home.css';

const Home = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 hook

  return (
    <div>
      <Header />
      <div className="home-container">
        <div className="home-left">
          <h1>여행 준비의 모든 것, TripMate와 함께!</h1>
          <p>간편하게 여행 계획을 세워보세요.</p>
          <div className="button-container">
            {/* Button 컴포넌트로 PLAN! 버튼 구현 */}
            <Button 
              text="PLAN!!" 
              onClick={() => navigate('/plan')} 
            />
            {/* Button 컴포넌트로 로그인 버튼 구현 */}
            <Button 
              text="로그인" 
              onClick={() => navigate('/login')} 
            />
          </div>
        </div>
        <div className="home-right">
          <img src="지도 이미지 경로" alt="Map" />
        </div>
      </div>
    </div>
  );
}

export default Home;
