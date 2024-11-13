import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import DraggableIcon from "../Components/DraggableIcon";
import axios from "axios";
import Header from "../Components/Header";
import Button from "../Components/Button";
import MapComponent from "../Components/MapComponent";
import cal_img from "../assets/계산기.png";
import "./Plan.css"

const Plan = () => {
    const navigate = useNavigate();
    const [plans, setPlans] = useState([]); // 여행 일정 데이터를 저장할 상태

    const queryParams = new URLSearchParams(location.search);
    const tripId = queryParams.get('tripId'); // tripId 가져오기

    const goCalculate = () => {
        navigate('/calculate');
    }

    // 컴포넌트가 마운트 될 때 API요청을 보내기 위한 useEffect
    useEffect(() => {
        const API_URL_PLAN_GET = `https://www.daebak.store/trips/${tripId}`;
        // API 호출
        axios.get(API_URL_PLAN_GET)
            .then((response) => {
                console.log(plans);
                setPlans(response.data); // 받아온 데이터를 상태에 저장
            })
            .catch((error) => {
                console.error("Error fetching plans: ", error); // 오류 처리
            });
    }, []); 

    return (
        <div>
            <Header />
            <DraggableIcon tripId={tripId} />
            <div className="container">
                <div className="plan-list">
                    {plans.length > 0 ? (
                        plans.map((plan) => (
                            <div key={plan.id} className="plan-item">
                                <h3>{plan.name}</h3>
                                <p>시작일: {plan.start_date}</p>
                                <p>종료일: {plan.end_date}</p>
                            </div>
                        ))
                    ) : (
                        <p>여행 일정이 없습니다.</p>
                    )}
                </div>
                <Button 
                    onClick={goCalculate}
                    customClass="go-calculate-button" 
                    imageSrc={cal_img}
                />
            </div>
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

}

export default Plan;