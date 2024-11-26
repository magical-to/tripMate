import React, { useEffect, useRef, useState } from 'react';
import './MapComponent.css';

const KAKAO_API_KEY = '9aae63ddcd9fcd414ae78bd6cffb5f80';
const REST_API_KEY = '61f1527120357fb0bb34c3ffe72b4377';

let polyline = null;

const MapComponent = ({ userId, waypoints, setWaypoints }) => {
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

  const [infowindows, setInfowindows] = useState([]);

  const createMarkerWithText = (map, latLng, title) => {
    const markerImage = new window.kakao.maps.MarkerImage(
      'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
      new window.kakao.maps.Size(30, 40),
      { offset: new window.kakao.maps.Point(15, 40) }
    );
  
    const marker = new window.kakao.maps.Marker({
      map,
      position: latLng,
      image: markerImage,
    });
  
    const customOverlayContent = `
      <div style="
        padding: 8px 12px; 
        background: rgba(255, 255, 255, 0.9); 
        border: 2px solid #fcd4f0;
        border-radius: 8px; 
        font-size: 10px; 
        font-weight: bold; 
        color: #333; 
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2); 
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      ">
        ${title}
      </div>
    `;
  
    const customOverlay = new window.kakao.maps.CustomOverlay({
      map,
      position: latLng,
      content: customOverlayContent,
      yAnchor: 2.5,
    });

    setInfowindows((prev) => [...prev, customOverlay]);
  
    return { marker, overlay: customOverlay };
  };
  
  useEffect(() => {
    loadKakaoMapScript()
      .then(() => {
        window.kakao.maps.load(() => {
          const mapContainer = mapRef.current;
          const mapOption = {
            center: new window.kakao.maps.LatLng(37.566826, 126.9786567),
            level: 3,
          };
          const kakaoMap = new window.kakao.maps.Map(mapContainer, mapOption);
          const kakaoGeocoder = new window.kakao.maps.services.Geocoder();
          setMap(kakaoMap);
          setGeocoder(kakaoGeocoder);
        });
      })
      .catch((error) => console.error('카카오맵 로딩 오류:', error));
  }, []);

  useEffect(() => {
    if (!map) return;
  
    const handleZoomChange = () => {
      map.relayout();
    };
  
    window.kakao.maps.event.addListener(map, 'zoom_changed', handleZoomChange);
  
    return () => {
      window.kakao.maps.event.removeListener(map, 'zoom_changed', handleZoomChange);
    };
  }, [map]);
  

  useEffect(() => {
    if (!map || !geocoder) return;
  
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);
  
    waypoints.forEach((waypoint) => {
      geocoder.addressSearch(waypoint, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
          const { marker, overlay } = createMarkerWithText(map, coords, waypoint);
  
          setMarkers((prev) => [...prev, marker]);
        } else {
          console.warn(`경유지를 찾을 수 없습니다: ${waypoint}`);
        }
      });
    });
  }, [waypoints, map, geocoder]);

  useEffect(() => {
    if (!map || !geocoder) return;

    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);

    waypoints.forEach((waypoint) => {
      geocoder.addressSearch(waypoint, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
          const marker = new window.kakao.maps.Marker({
            map,
            position: coords,
          });
          setMarkers((prev) => [...prev, marker]);
        } else {
          console.warn(`경유지를 찾을 수 없습니다: ${waypoint}`);
        }
      });
    });
  }, [waypoints, map, geocoder]);

  const handleReset = () => {
    setStartAddress('');
    setEndAddress('');
    setWaypoints([]);
    setStartCoords(null);
    setEndCoords(null);

    markers.forEach((marker) => {
      marker.setMap(null);
    });
    setMarkers([]);
  
    infowindows.forEach((overlay) => {
      overlay.setMap(null);
    });
    setInfowindows([]);
  
    if (polyline) {
      polyline.setMap(null);
      polyline = null;
    }
  
    if (map) {
      map.setCenter(new window.kakao.maps.LatLng(37.566826, 126.9786567));
      map.setLevel(3);
    }
  
    setPlacesList([]);
  };

  const handleKeywordSearch = () => {
    if (!keyword.trim()) {
      alert('키워드를 입력해주세요!');
      return;
    }

    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);
    setPlacesList([]);

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
    const bounds = new window.kakao.maps.LatLngBounds();
  
    const newMarkers = places.map((place) => {
      const placePosition = new window.kakao.maps.LatLng(place.y, place.x);
      const { marker, overlay } = createMarkerWithText(map, placePosition, place.place_name);
  
      bounds.extend(placePosition);
      return marker;
    });
  
    const placesWithDetails = places.map((place) => ({
      id: place.id,
      name: place.place_name,
      address: place.road_address_name || place.address_name || '주소 정보 없음',
    }));
  
    setMarkers(newMarkers);
    setPlacesList(placesWithDetails);
    map.setBounds(bounds);
  };
  
  
  const handleSearch = async () => {
    try {
      const startCoords = await getCoordinates(startAddress);
      const endCoords = await getCoordinates(endAddress);

      infowindows.forEach((overlay) => {
        overlay.setMap(null);
      });
      setInfowindows([]);
  
      markers.forEach((marker) => marker.setMap(null));
      setMarkers([]);
  
      const { marker: startMarker, overlay: startOverlay } = createMarkerWithText(
        map,
        new window.kakao.maps.LatLng(startCoords.lat, startCoords.lng),
        '출발지'
      );
  
      const { marker: endMarker, overlay: endOverlay } = createMarkerWithText(
        map,
        new window.kakao.maps.LatLng(endCoords.lat, endCoords.lng),
        '목적지'
      );
  
      setMarkers([startMarker, endMarker]);
      setInfowindows([startOverlay, endOverlay]);
  
      map.setCenter(new window.kakao.maps.LatLng(startCoords.lat, startCoords.lng));
  
      const waypointCoords = [];
      const waypointMarkers = [];
      const waypointOverlays = [];
  
      for (const [index, waypoint] of waypoints.entries()) {
        if (waypoint) {
          const coords = await getCoordinates(waypoint);
  
          const { marker: waypointMarker, overlay: waypointOverlay } = createMarkerWithText(
            map,
            new window.kakao.maps.LatLng(coords.lat, coords.lng),
            `경유지${index + 1}`
          );
  
          waypointMarkers.push(waypointMarker);
          waypointOverlays.push(waypointOverlay);
  
          waypointCoords.push({
            name: `경유지${index + 1}`,
            x: coords.lng,
            y: coords.lat,
          });
        }
      }
  
      setMarkers((prev) => [...prev, ...waypointMarkers]);
      setInfowindows((prev) => [...prev, ...waypointOverlays]);
  

      handleRoute(startCoords, endCoords, waypointCoords);
    } catch (error) {
      console.error('경로 설정 오류:', error);
      alert('경로를 설정하는 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const getCoordinates = (address) =>
    new Promise((resolve, reject) => {
      if (!geocoder) {
        reject('Geocoder가 초기화되지 않았습니다.');
        return;
      }
      geocoder.addressSearch(address, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          resolve({
            lat: parseFloat(result[0].y),
            lng: parseFloat(result[0].x),
          });
        } else {
          reject(`주소를 찾을 수 없습니다: ${address}`);
        }
      });
    });

  const handleRoute = async (startCoords, endCoords, waypointCoords) => {
    const payload = {
      origin: { x: startCoords.lng, y: startCoords.lat },
      destination: { x: endCoords.lng, y: endCoords.lat },
      waypoints: waypointCoords,
      priority: 'RECOMMEND',
    };

    try {
      const response = await fetch(
        `https://apis-navi.kakaomobility.com/v1/waypoints/directions`,
        {
          method: 'POST',
          headers: {
            Authorization: `KakaoAK ${REST_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const linePath = [];

      data.routes[0].sections.forEach((section) => {
        section.roads.forEach((road) => {
          road.vertexes.forEach((vertex, index) => {
            if (index % 2 === 0) {
              linePath.push(
                new window.kakao.maps.LatLng(road.vertexes[index + 1], vertex)
              );
            }
          });
        });
      });

      if (polyline) {
        polyline.setMap(null);
      }

      polyline = new window.kakao.maps.Polyline({
        path: linePath,
        strokeWeight: 5,
        strokeColor: '#ff0000',
        strokeOpacity: 0.7,
        strokeStyle: 'solid',
      });
      polyline.setMap(map);
    } catch (error) {
      console.error('경로 탐색 중 오류 발생:', error);
    }
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
        <button onClick={handleKeywordSearch} className="place-button">
          장소 검색
        </button>
        <button onClick={handleReset} className="reset-button">
          초기화
        </button>
      </div>

      <ul className="places-list">
  {userId && (
    <li className="place-item user-recommendation-title">
      <span className="highlight-user-id">{userId}</span>님을 위한 장소 추천!
    </li>
  )}
  {placesList.map((place, index) => (
    <li
    key={index}
    className="place-item"
    onClick={() => {
      const address = place.address;
      const name = place.name;
      const id = place.id;
  
      if (!address) {
        alert('해당 장소의 주소 정보를 찾을 수 없습니다.');
        return;
      }
  
      geocoder.addressSearch(address, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
  
          const markerImage = new window.kakao.maps.MarkerImage(
            'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
            new window.kakao.maps.Size(30, 40),
            { offset: new window.kakao.maps.Point(15, 40) }
          );
  
          const marker = new window.kakao.maps.Marker({
            map: map,
            position: coords,
            image: markerImage,
          });
  
          const customOverlayContent = `
            <div style="padding: 8px 12px; background: rgba(255, 255, 255, 0.9); border-radius: 8px; border: 1px solid #ddd; color: #333;">
              ${address}
            </div>
          `;
          const overlay = new window.kakao.maps.CustomOverlay({
            map: map,
            position: coords,
            content: customOverlayContent,
            yAnchor: 1.5,
          });
  
          setMarkers((prevMarkers) => [...prevMarkers, marker]);
          setInfowindows((prevOverlays) => [...prevOverlays, overlay]);
  
          map.setCenter(coords);
        } else {
          alert('해당 주소를 지도에 추가할 수 없습니다.');
        }
      });
  
      setWaypoints((prev) => [...prev, address]);
    }}
  >
    <strong>{place.name}</strong>
    <br />
    {place.address}
    <button
        className="link-button"
        onClick={(e) => {
          e.stopPropagation();
          const kakaoMapLink = `https://map.kakao.com/link/map/${place.id}`;
          window.open(kakaoMapLink, '_blank');
        }}
        style={{
          marginLeft: '8px',
          padding: '4px 6px',
          fontSize: '12px',
          backgroundColor: '#eee',
          border: '1px solid #ccc',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
      ...
      </button>
  </li>
  
  
  ))}
</ul>
      <div ref={mapRef} className="kakao-map" style={{ width: '100%', height: '500px' }}></div>
    </div>
  );
};

export default MapComponent;
