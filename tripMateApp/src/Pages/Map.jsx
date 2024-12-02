import React from 'react';
import Header from '../Components/Header';
import MapComponent from '../Components/MapComponent';
import './Map.css';

const Map = () => {
  const locations = [
    { id: 1, name: '서울', description: '대한민국의 수도입니다.' },
    { id: 2, name: '제주도', description: '아름다운 섬과 해변이 있는 여행지입니다.' },
    { id: 3, name: '부산', description: '해운대와 해변으로 유명한 항구 도시입니다.' },
  ];

  return (
    <div className="map-container">
      <Header />
      <h1 className="map-title">여행지 지도</h1>

      <div className="location-list">
        {locations.map((location) => (
          <div key={location.id} className="location-card">
            <h2>{location.name}</h2>
            <p>{location.description}</p>
          </div>
        ))}
      </div>

      <MapComponent />
    </div>
  );
};

export default Map;