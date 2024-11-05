import React from 'react';
import { useNavigate } from 'react-router-dom';
import { validateFriendId } from '../Services/authService'; 
import { loginCheck } from '../Services/authService'; 
import Slider from 'react-slick';
import Header from '../Components/Header';
import Button from '../Components/Button';
import SmallChatComponent from '../Components/SmallChatComponent';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Home.css'; 

import Map1 from '../assets/1.png';
import Map2 from '../assets/2.png';
import Map3 from '../assets/3.png';
import Map4 from '../assets/4.png';
import Map5 from '../assets/5.png';

const slideImages = [Map1, Map2, Map3, Map4, Map5];

const Home = () => {
  const navigate = useNavigate();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  const handlePlanClick = async () => {
    const token = localStorage.getItem('access_token');
  
    if (token) {
      const isUserValid = await loginCheck(token);
  
      if (isUserValid) {
        navigate('/go');
      } else {
        alert('사용자가 유효하지 않습니다. 로그인 페이지로 이동합니다.');
        navigate('/login');
      }
    } else {
      alert('로그인 후 이용 가능합니다. 로그인 페이지로 이동합니다.');
      navigate('/login');
    }
  };

  const handleNavigateToMap = () => {
    navigate('/map');
  };

  return (
    <div>
      <SmallChatComponent />
      <Header />
      <div className="home-container">
        <div className="home-left">
          <h1>여행 준비의 모든 것, TripMate와 함께!</h1>
          <p onClick={handleNavigateToMap} className="clickable-text">
            간편하게 여행 계획을 세워보세요.
          </p>
          <div className="button-container">
            <Button 
              text="PLAN!!" 
              onClick={handlePlanClick} 
              className="go-button"
            />
          </div>
        </div>

        <div className="home-right">
          <Slider {...settings}>
            {slideImages.map((image, index) => (
              <div key={index}>
                <img src={image} alt={`Slide ${index}`} className="slide-image" />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Home;
