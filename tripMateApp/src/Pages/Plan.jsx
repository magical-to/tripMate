import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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
    setNewPlace('');
  };

  const removeVisitPlace = (index) => {
    const updatedWaypoints = waypoints.filter((_, i) => i !== index);
    setWaypoints(updatedWaypoints);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(waypoints);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setWaypoints(items);
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
            <h4>방문할 장소들의 목록</h4>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="visit-places-list">
                {(provided) => (
                  <ul
                    className="visit-places-list"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {waypoints.map((place, index) => (
                      <Draggable key={place} draggableId={place} index={index}>
                        {(provided) => (
                          <li
                            className="visit-place-item"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div className="place-header">
                              <input
                              type="text"
                              className="info-input"
                              placeholder="장소명"
                              />
                              <input
                              type="text"
                              className="time-input"
                              placeholder="머물 시간"
                              />
                              <br/>
                            <span className="place-index">{index + 1}.</span>
                            <span className="place-name">{place}</span>
                            <button
                              className="delete-button"
                              onClick={() => {
                                const updatedWaypoints = waypoints.filter(
                                  (_, i) => i !== index);
                                  setWaypoints(updatedWaypoints);
                                }}
                                style={{
                                  marginLeft: "10px",
                                  marginTop: "4px",
                                  padding: "4px 8px",
                                  backgroundColor: "#f44336",
                                  color: "#fff",
                                  border: "none",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                }}
                                >
                              X
                            </button>
                            </div>
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
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
