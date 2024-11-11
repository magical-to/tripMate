import React from 'react';
import Header from '../Components/Header';
import MapComponent from '../Components/MapComponent';
import './Map.css';

const Map = () => {
  return (
    <div className="map-container">
      <Header />
      <h1 className="map-title">여행지 지도</h1>

      <div className="map-content">
        <div className="places-list">
          <h3>검색 결과</h3>
          <MapComponent />
        </div>

        <div className="kakao-map-container">
          <MapComponent />
        </div>
      </div>
    </div>
  );
};

export default Map;
