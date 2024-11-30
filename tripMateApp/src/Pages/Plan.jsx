import React, { useEffect, useState, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useNavigate } from 'react-router-dom';
import DraggableIcon from "../Components/DraggableIcon";
import axios from "axios";
import { io } from 'socket.io-client';
import Header from "../Components/Header";
import Button from "../Components/Button";
import MapComponent from "../Components/MapComponent";
import Needs from "../Components/Needs";
import Participant from "../Components/Participant";
import { updateTrip } from '../Services/tripService'; 
import "./Plan.css";

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
  const token = localStorage.getItem('access_token');
  const socket = useRef(null);
  const [userId, setUserId] = useState('');
  const [waypoints, setWaypoints] = useState([]);
  const [dayWaypoints, setDayWaypoints] = useState({});
  const [days, setDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(1);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [editedPlan, setEditedPlan] = useState({
    name: '',
    start_date: '',
    start_time: '',
    end_date: '',
    end_time: ''
  });
  const queryParams = new URLSearchParams(location.search);
  const tripId = queryParams.get('tripId');
  const title = queryParams.get('title');

  let end_date;
  let start_date;

  plans.forEach((plan) => {
    end_date = plan.end_date;
    start_date = plan.start_date;
  });

  useEffect(() => {
    if (plans.length > 0) {
      const start = new Date(plans[0].start_date);
      const end = new Date(plans[0].end_date);
      const dayCount = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      const dayArray = Array.from({ length: dayCount }, (_, index) => index + 1);
      setDays(dayArray);
    }
  }, [plans]);  

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
    // WebSocket 연결 초기화
    socket.current = io('wss://www.daebak.store/detailTrip', {
      auth: { token }, // 인증 토큰
    });
  
    // 연결 성공 시
    socket.current.on('connect', () => {
      console.log('WebSocket 연결 성공');
      socket.current.emit('joinRoom', { tripId }); // 방에 참가
    });
  
    // WebSocket 해제
    return () => {
      socket.current.disconnect();
    };
  }, [tripId, token]);
  

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

  const handleAddWaypoint = (newWaypoint) => {
    const updatedWaypoints = [...waypoints, newWaypoint];
    setWaypoints(updatedWaypoints);
    setDayWaypoints((prev) => ({
      ...prev,
      [selectedDay]: updatedWaypoints,
    }));
  };
  
  const handleDeleteWaypoint = (index) => {
    const updatedWaypoints = waypoints.filter((_, i) => i !== index);
    setWaypoints(updatedWaypoints);
    setDayWaypoints((prev) => ({
      ...prev,
      [selectedDay]: updatedWaypoints,
    }));
  };

  const handleSaveDayWaypoints = () => {
    if (!socket.current) {
      console.error('WebSocket 연결이 초기화되지 않았습니다.');
      return;
    }
  
    const dataToSave = waypoints.map(({ id, address, placeName, tripTime }, index) => ({
      tripId: Number(tripId),
      placeName: placeName || '',
      placeLocation: address || '',
      order: index + 1,
      tripTime: tripTime || '',
      day: selectedDay,
    }));
  
    console.log('전송할 데이터:', dataToSave);
  
    // 각 객체를 개별적으로 전송
    dataToSave.forEach((data) => {
      socket.current.emit('detailTripCreated', data);
  
      // 응답 수신 처리
      socket.current.on('waypointsSaved', (response) => {
        if (response.success) {
          console.log(`저장 성공: ${JSON.stringify(data)}`);
        } else {
          console.error(`저장 실패: ${JSON.stringify(data)}`);
        }
      });
    });
  };
  
  
  const handleInputChange = (id, field, value) => {
    setWaypoints((prev) =>
      prev.map((waypoint) =>
        waypoint.id === id ? { ...waypoint, [field]: value } : waypoint
      )
    );
  };  
  

const handleDayChange = (day) => {
  setDayWaypoints((prev) => ({
    ...prev,
    [selectedDay]: waypoints,
  }));

  setWaypoints(dayWaypoints[day] || []);
  setSelectedDay(day);
};

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(waypoints);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setWaypoints(items);
    setDayWaypoints((prev) => ({ ...prev, [selectedDay]: items }));
  };

  const handleEditClick = (plan) => {
    setEditingPlanId(plan.id);
    setEditedPlan({ name: plan.name, start_date: plan.start_date, end_date: plan.end_date });
  };

  const handleSaveEdit = async (planId) => { 
    console.log("여행 수정됨");
    const tripData = {
        name: editedPlan.name,
        start_date: editedPlan.start_date, // YYYY-MM-DD 형식
        end_date: editedPlan.end_date,     // YYYY-MM-DD 형식
        start_time: editedPlan.start_time, // HH:mm 형식
        end_time: editedPlan.end_time       // HH:mm 형식
    };
    
    try {
        const updatedTrip = await updateTrip(planId, tripData);
        console.log("여행이 수정되었습니다:", updatedTrip);

        const updatedPlans = plans.map(plan =>
            plan.id === planId ? { ...plan, ...tripData } : plan
        );
        setPlans(updatedPlans);
        setEditingPlanId(null);
    } catch (error) {
        console.error("여행 수정 중 오류 발생:", error);
        alert("여행 수정에 실패했습니다. 다시 시도해 주세요.");
    };
  };

  return (
    <div>
        <Header />
        <Needs tripId={tripId} title={title} />
        <Button 
          text="경비"
          customClass="go-calculate-button"
          onClick={goCalculate}
        />
        <div className="draggable-container">
            <DraggableIcon tripId={tripId} title={title} />
        </div>
        <div className="map-content">
            <div className="left-container">
                <div className="plan-lists">
                    {plans.length > 0 ? (
                        plans.map((plan) => (
                            <div key={plan.id} className="plan-item">
                                {editingPlanId === plan.id ? (
                                    <>
                                        <input
                                            className="plan-edit-form-title"
                                            value={editedPlan.name}
                                            onChange={(e) => setEditedPlan({ ...editedPlan, name: e.target.value })}
                                            placeholder="  여행 제목"
                                        />
                                        <input
                                            className="plan-edit-form-date1"
                                            type="date"
                                            value={editedPlan.start_date}
                                            onChange={(e) => setEditedPlan({ ...editedPlan, start_date: e.target.value })}
                                        />
                                        <input
                                            className="plan-edit-form-time"
                                            type="time"
                                            value={editedPlan.start_time}
                                            onChange={(e) => setEditedPlan({ ...editedPlan, start_time: e.target.value })}
                                        />
                                        <input
                                            className="plan-edit-form-date2"
                                            type="date" 
                                            value={editedPlan.end_date}
                                            onChange={(e) => setEditedPlan({ ...editedPlan, end_date: e.target.value })}
                                        />
                                        <input
                                            className="plan-edit-form-time"
                                            type="time" 
                                            value={editedPlan.end_time} 
                                            onChange={(e) => setEditedPlan({ ...editedPlan, end_time: e.target.value })}
                                        />
                                        <Button 
                                            text="저장"
                                            customClass="plan-save-button"
                                            onClick={() => handleSaveEdit(plan.id)}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <h3 className="plan-name">{plan.name}</h3>
                                        <div className="plan-info">
                                          <div className="plan-date">
                                            <p>시작일: {plan.start_date}</p>
                                            <p>종료일: {plan.end_date}</p>
                                          </div>
                                          <Button 
                                              text="수정"
                                              customClass="plan-detail-button"
                                              onClick={() => handleEditClick(plan)}
                                          />
                                        </div>
                                    </>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="title">여행 일정이 없습니다.</p>
                    )}
                </div>
                <div className="visit-places-container">
                <div className="day-selector">
  <label htmlFor="day-select">일차 선택:</label>
  <select
    id="day-select"
    value={selectedDay}
    onChange={(e) => handleDayChange(Number(e.target.value))}
  >
    {days.map((day) => (
      <option key={day} value={day}>
        {day}일차
      </option>
    ))}
  </select>
</div>

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
          <Draggable key={place.id} draggableId={place.id.toString()} index={index}>
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
                    value={place.placeName || ''}
                    onChange={(e) => handleInputChange(place.id, 'placeName', e.target.value)}
                  />
                  <input
                    type="text"
                    className="time-input"
                    placeholder="머물 시간"
                    value={place.tripTime || ''}
                    onChange={(e) => handleInputChange(place.id, 'tripTime', e.target.value)}
                  />
                  <br />
                  <div className="place-header">
          <span className="place-index">{index + 1}.</span>
          <span className="place-name">{place.address}</span>
        </div>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteWaypoint(index)}
                  >
                    X
                  </button>
                </div>
              </li>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
        <button className="save-button" onClick={handleSaveDayWaypoints}>
          저장
          </button>
      </ul>
    )}
  </Droppable>
</DragDropContext>

                </div>
            </div>

            <div className="kakao-map-container">
                <MapComponent userId={userId} waypoints={waypoints} setWaypoints={setWaypoints} />
                <Participant tripId={tripId} />
            </div>
        </div>
    </div>
);
}

export default Plan;
