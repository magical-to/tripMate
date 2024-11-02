import React, { useEffect, useRef, useState } from 'react';
import './MapComponent.css';

const KAKAO_API_KEY = '9aae63ddcd9fcd414ae78bd6cffb5f80';
const REST_API_KEY = '61f1527120357fb0bb34c3ffe72b4377';

const MapComponent = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  const loadKakaoMapScript = () => {
    return new Promise((resolve, reject) => {
      if (window.kakao && window.kakao.maps) {
        resolve();
      } else {
        const script = document.createElement('script');
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_API_KEY}&autoload=false`;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('카카오맵 스크립트 로드 실패'));
        document.head.appendChild(script);
      }
    });
  };

  const initMap = () => {
    const mapContainer = mapRef.current;
    const mapOption = {
      center: new window.kakao.maps.LatLng(37.5665, 126.9780),
      level: 3,
    };
    const kakaoMap = new window.kakao.maps.Map(mapContainer, mapOption);
    setMap(kakaoMap);
  };

  useEffect(() => {
    loadKakaoMapScript()
      .then(() => {
        window.kakao.maps.load(() => {
          initMap();
        });
      })
      .catch((error) => console.error('카카오맵 로딩 오류:', error));
  }, []);

  const addMarker = (lat, lng, title) => {
    const markerPosition = new window.kakao.maps.LatLng(lat, lng);
    const marker = new window.kakao.maps.Marker({
      position: markerPosition,
      map: map,
    });

    const infowindow = new window.kakao.maps.InfoWindow({
      content: `<div style="padding:5px;">${title}</div>`,
    });
    infowindow.open(map, marker);
  };

  const handleRoute = async () => {
    const startLat = 37.441599;
    const startLng = 126.791347;
    const endLat = 36.470671;
    const endLng = 127.142392;

    addMarker(startLat, startLng, '출발지');
    addMarker(endLat, endLng, '목적지');

    const origin = `${startLng},${startLat}`;
    const destination = `${endLng},${endLat}`;

    try {
      const response = await fetch(
        `https://apis-navi.kakaomobility.com/v1/directions?origin=${origin}&destination=${destination}`,
        {
          method: 'GET',
          headers: {
            Authorization: `KakaoAK ${REST_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const linePath = [];

      data.routes[0].sections[0].roads.forEach((road) => {
        road.vertexes.forEach((vertex, index) => {
          if (index % 2 === 0) {
            linePath.push(new window.kakao.maps.LatLng(road.vertexes[index + 1], vertex));
          }
        });
      });

      const polyline = new window.kakao.maps.Polyline({
        path: linePath,
        strokeWeight: 5,
        strokeColor: '#d0fc5c',
        strokeOpacity: 0.7,
        strokeStyle: 'solid',
      });
      polyline.setMap(map);
    } catch (error) {
      console.error('경로 찾기 오류:', error);
    }
  };

  return (
    <div>
      <button onClick={handleRoute} className="route-button">
        경로 찾기
      </button>
      <div ref={mapRef} className="kakao-map"></div>
    </div>
  );
};

export default MapComponent;