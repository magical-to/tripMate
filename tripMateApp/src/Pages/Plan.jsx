import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useNavigate } from 'react-router-dom';
import DraggableIcon from "../Components/DraggableIcon";
import axios from "axios";
import Header from "../Components/Header";
import Button from "../Components/Button";
import MapComponent from "../Components/MapComponent";
import Needs from "../Components/Needs";
import Participant from "../Components/Participant";
import { updateTrip } from '../Services/tripService'; 
import "./Plan.css";

// 디코딩 함수
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
  const [dayWaypoints, setDayWaypoints] = useState({});
  const [days, setDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(1);
  const [editingPlanId, setEditingPlanId] = useState(null); // 수정할 계획의 ID
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
    const start = new Date(start_date);
    const end = new Date(end_date);
    const dayCount = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const dayArray = Array.from({ length: dayCount }, (_, index) => index + 1);
    setDays(dayArray);

    const initialWaypoints = dayArray.reduce((acc, day) => {
      acc[day] = [];
      return acc;
    }, {});
    setDayWaypoints(initialWaypoints);
  }, []);

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

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(waypoints);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setWaypoints(items);
  };

  const handleEditClick = (plan) => {
    setEditingPlanId(plan.id);
    setEditedPlan({ name: plan.name, start_date: plan.start_date, end_date: plan.end_date });
  };

  // 여행 수정 함수
  const handleSaveEdit = async (planId) => { 
    console.log("여행 수정됨");
    // tripData 형태로 묶기
    const tripData = {
        name: editedPlan.name,
        start_date: editedPlan.start_date, // YYYY-MM-DD 형식
        end_date: editedPlan.end_date,     // YYYY-MM-DD 형식
        start_time: editedPlan.start_time, // HH:mm 형식
        end_time: editedPlan.end_time       // HH:mm 형식
    };
    
    try {
        // updateTrip 함수를 사용하여 서버에 tripData 전송
        const updatedTrip = await updateTrip(planId, tripData);
        console.log("여행이 수정되었습니다:", updatedTrip);

        // 수정된 여행 정보를 상태에 업데이트
        const updatedPlans = plans.map(plan =>
            plan.id === planId ? { ...plan, ...tripData } : plan
        );
        setPlans(updatedPlans);
        setEditingPlanId(null); // 수정 모드 종료
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
          text="정산"
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
                                            // type="text"
                                            value={editedPlan.name}
                                            onChange={(e) => setEditedPlan({ ...editedPlan, name: e.target.value })}
                                            placeholder="  여행 제목"
                                        />
                                        <input
                                            className="plan-edit-form-date1"
                                            type="date" // 년도 포함하는 날짜 입력 필드
                                            value={editedPlan.start_date} // YYYY-MM-DD 형식으로 설정
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
                    onChange={(e) => setSelectedDay(Number(e.target.value))}
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
                                                        <br />
                                                        <span className="place-index">{index + 1}.</span>
                                                        <span className="place-name">{place}</span>
                                                        <button
                                                            className="delete-button"
                                                            onClick={() => {
                                                                const updatedWaypoints = waypoints.filter((_, i) => i !== index);
                                                                setWaypoints(updatedWaypoints);
                                                            }}
                                                            style={{
                                                                marginLeft: "10px",
                                                                marginTop: "4px",
                                                                padding: "4px 8px",
                                                                backgroundColor: "#fcd4f0",
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
                <Participant tripId={tripId} />
            </div>
        </div>
    </div>
);
}

export default Plan;
