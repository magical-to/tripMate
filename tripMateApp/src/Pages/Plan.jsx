import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import DraggableIcon from "../Components/DraggableIcon";
import axios from "axios";
import Header from "../Components/Header";
import Button from "../Components/Button";
import MapComponent from "../Components/MapComponent";
import cal_img from "../assets/계산기2.png";
import Needs from "../Components/Needs";
import "./Plan.css";
import Participant from "../Components/Participant";

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );

  return JSON.parse(jsonPayload);
}

const Plan = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [userId, setUserId] = useState('');
  const [waypoints, setWaypoints] = useState([]);
  const [newPlace, setNewPlace] = useState('');
  const queryParams = new URLSearchParams(location.search);
  const tripId = queryParams.get('tripId');
  const title = queryParams.get('title');
  
  console.log("title: ", title);
  
  // 전역변수로 설정
  let end_date;
  let start_date;

  plans.forEach((plan) => {
    end_date = plan.end_date;
    start_date = plan.start_date;
  });
  

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      const jwtToken = token.split(' ')[1];
      try {
        const decodedToken = parseJwt(jwtToken);
        setUserId(decodedToken.userid);
      } catch (error) {
        console.error("토큰 디코딩 중 오류 발생", error);
      }
    }
  }, []);

  useEffect(() => {
    const API_URL_PLAN_GET = `https://www.daebak.store/trips/${tripId}`;
    axios.get(API_URL_PLAN_GET)
      .then((response) => {
        setPlans(response.data);
      })
      .catch((error) => {
        console.error("Error fetching plans: ", error);
      });
  }, [tripId]);
  
  const goCalculate = () => {
    navigate(`/calculate?title=${title}&start_date=${start_date}&end_date=${end_date}&tripId=${tripId}`);
  };

  const addVisitPlace = () => {
    if (!newPlace.trim()) {
      alert('방문할 장소를 입력해주세요!');
      return;
    }
  
    setWaypoints((prev) => [...prev, newPlace]);
  
    geocoder.addressSearch(newPlace, (result, status) => {
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
            ${newPlace}
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
        alert('해당 장소를 찾을 수 없습니다.');
      }
    });
  
    setNewPlace('');
  };
  
  const removeVisitPlace = (index) => {
    const updatedWaypoints = waypoints.filter((_, i) => i !== index);
    setWaypoints(updatedWaypoints);
  };

  return (
    <div>
      <Header />
      <Needs tripId={tripId} title={title}/>
      <div className="draggable-container">
        <DraggableIcon tripId={tripId} title={title}/>
      </div>
      <div className="map-content">
        <div className="left-container">
          <div className="plan-list">
            {plans.length > 0 ? (
              plans.map((plan) => (
                <div key={plan.id} className="plan-item">
                  <h3 className="plan-name">{plan.name}</h3>
                  <p className="plan-date">시작일: {plan.start_date}</p>
                  <p className="plan-date">종료일: {plan.end_date}</p>
                </div>
              ))
            ) : (
              <p className="title">여행 일정이 없습니다.</p>
            )}
          </div>
          <div className="go-calculate-button" onClick={goCalculate}>
            <img
              src={cal_img}
            />
          </div>

          <div className="visit-places-container">
            <h4>방문할 장소</h4>
            <input
              type="text"
              placeholder="방문할 장소 입력"
              value={newPlace}
              onChange={(e) => setNewPlace(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addVisitPlace();
                }
              }}
              className="visit-place-input"
            />
            <button onClick={addVisitPlace} className="add-visit-place-button">
              추가
            </button>
            <ul className="visit-places-list">
              {waypoints.map((place, index) => (
                <li key={index} className="visit-place-item">
                  <span className="place-index">{index + 1}.</span>
                  <span className="place-name">{place}</span>
                  <button
                    onClick={() => removeVisitPlace(index)}
                    className="remove-button"
                  >
                    삭제
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="kakao-map-container">
        <MapComponent userId={userId} waypoints={waypoints} setWaypoints={setWaypoints} />
        <Participant tripId={tripId}/>
        </div>
      </div>
    </div>
  );
};

export default Plan;
