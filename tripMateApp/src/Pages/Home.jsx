import React from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick'; // react-slick 임포트
import Header from '../Components/Header';
import Button from '../Components/Button';
import 'slick-carousel/slick/slick.css'; // slick 기본 CSS
import 'slick-carousel/slick/slick-theme.css'; // slick 테마 CSS
import './Home.css'; 

import Map1 from '../assets/1.png';
import Map2 from '../assets/2.png';
import Map3 from '../assets/3.png';
import Map4 from '../assets/4.png';
import Map5 from '../assets/5.png';

const slideImages = [Map1, Map2, Map3, Map4, Map5];

const Home = () => {
  const navigate = useNavigate();

  // react-slick 슬라이더 설정
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  return (
    <div>
      <Header />
      <div className="home-container">
        <div className="home-left">
          <h1>여행 준비의 모든 것, TripMate와 함께!</h1>
          <p>간편하게 여행 계획을 세워보세요.</p>
          <div className="button-container">
            <Button 
              text="PLAN!!" 
              onClick={() => navigate('/go')}
            />
          </div>
        </div>

        <div className="home-right">
          {/* 슬라이더 컴포넌트 */}
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
