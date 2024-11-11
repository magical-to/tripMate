import React, { useEffect, useRef, useState } from 'react';
import './MapComponent.css';

const KAKAO_API_KEY = '9aae63ddcd9fcd414ae78bd6cffb5f80';
const REST_API_KEY = '61f1527120357fb0bb34c3ffe72b4377';

const MapComponent = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [geocoder, setGeocoder] = useState(null);
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  const [startCoords, setStartCoords] = useState(null);
  const [endCoords, setEndCoords] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [placesList, setPlacesList] = useState([]);

  const loadKakaoMapScript = () => {
    return new Promise((resolve, reject) => {
      if (window.kakao && window.kakao.maps) {
        resolve();
      } else {
        const script = document.createElement('script');
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_API_KEY}&autoload=false&libraries=services`;
        script.async = true;
        script.onload = () => {
          if (window.kakao && window.kakao.maps) {
            resolve();
          } else {
            reject(new Error('카카오맵 객체 로드 실패'));
          }
        };
        script.onerror = () => reject(new Error('카카오맵 스크립트 로드 실패'));
        document.head.appendChild(script);
      }
    });
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

  const initMap = () => {
    const mapContainer = mapRef.current;
    const mapOption = {
      center: new window.kakao.maps.LatLng(37.566826, 126.9786567),
      level: 3,
    };
    const kakaoMap = new window.kakao.maps.Map(mapContainer, mapOption);
    const kakaoGeocoder = new window.kakao.maps.services.Geocoder();
  
    setMap(kakaoMap);
    setGeocoder(kakaoGeocoder);
  };

  const displayMarker = (latLng, title) => {
    const marker = new window.kakao.maps.Marker({
      position: latLng,
      map: map,
    });
    const infowindow = new window.kakao.maps.InfoWindow({
      content: `<div style="padding:5px;">${title}</div>`,
    });
    infowindow.open(map, marker);
    return marker;
  };

  const getCoordinates = (address, setCoords, setMarkerTitle) => {
    return new Promise((resolve, reject) => {
      if (!geocoder) {
        console.error('Geocoder가 초기화되지 않았습니다.');
        return;
      }
      
      geocoder.addressSearch(address, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const coords = {
            lat: parseFloat(result[0].y),
            lng: parseFloat(result[0].x),
          };
          setCoords(coords);
          map.setCenter(new window.kakao.maps.LatLng(coords.lat, coords.lng));
          displayMarker(new window.kakao.maps.LatLng(coords.lat, coords.lng), setMarkerTitle);
          resolve();
        } else {
          console.error('주소를 찾을 수 없습니다:', address);
          reject('주소를 찾을 수 없습니다.');
        }
      });
    });
  };

  const handleSearch = async () => {
    try {
      if (startAddress) {
        await getCoordinates(startAddress, setStartCoords, '출발지');
      }
      if (endAddress) {
        await getCoordinates(endAddress, setEndCoords, '목적지');
      }
      setTimeout(() => {
        if (startCoords && endCoords) {
          handleRoute();
        }
      }, 500);
    } catch (error) {
      console.error('좌표 설정 오류:', error);
    }
  };

  const handleRoute = async () => {
    if (startCoords && endCoords) {
      const origin = `${startCoords.lng},${startCoords.lat}`;
      const destination = `${endCoords.lng},${endCoords.lat}`;

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
          strokeColor: '#ff0000',
          strokeOpacity: 0.7,
          strokeStyle: 'solid',
        });
        polyline.setMap(map);
      } catch (error) {
        console.error('경로 찾기 오류:', error);
      }
    } else {
      alert('출발지와 목적지를 설정해주세요.');
    }
  };

  const handleKeywordSearch = () => {
    if (!keyword.trim()) {
      alert('키워드를 입력해주세요!');
      return;
    }

    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(keyword, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        displayPlaces(data);
      } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
        alert('검색 결과가 존재하지 않습니다.');
      } else {
        alert('검색 중 오류가 발생했습니다.');
      }
    });
  };

  const displayPlaces = (places) => {
    removeMarkers();
    const bounds = new window.kakao.maps.LatLngBounds();
    const newMarkers = places.map((place) => {
      const placePosition = new window.kakao.maps.LatLng(place.y, place.x);
      const marker = displayMarker(placePosition, place.place_name);
      bounds.extend(placePosition);
      return marker;
    });

    setMarkers(newMarkers);
    setPlacesList(places);
    map.setBounds(bounds);
  };

  const removeMarkers = () => {
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);
  };

  return (
    <div>
      <div className="input-container">
        <input
          type="text"
          placeholder="출발지 주소 입력"
          value={startAddress}
          onChange={(e) => setStartAddress(e.target.value)}
        />
        <input
          type="text"
          placeholder="목적지 주소 입력"
          value={endAddress}
          onChange={(e) => setEndAddress(e.target.value)}
        />
        <button onClick={handleSearch} className="route-button">
          경로 검색
        </button>
        <input
          type="text"
          placeholder="키워드 입력"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button onClick={handleKeywordSearch} className="route-button">
          장소 검색
        </button>
      </div>
      <ul className="places-list">
        {placesList.map((place, index) => (
          <li key={index} className="place-item">
            {place.place_name}
          </li>
        ))}
      </ul>
      <div ref={mapRef} className="kakao-map"></div>
    </div>
  );
  
};

export default MapComponent;
