import React, { useState, useEffect, useRef } from 'react';
import Header from '../Components/Header';
import { FaBars } from 'react-icons/fa';
import { getMyTrips, getPersonalTrips, getGroupTrips, getParticipant, leaveTrip } from '../Services/tripService'; 
import './Mytrip.css';

const Mytrip = () => {
    const [trips, setTrips] = useState([]); // 여행 목록 상태
    const [menuVisible, setMenuVisible] = useState(null);
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [category, setCategory] = useState('전체 일정'); // 카테고리 상태
    const [participants, setParticipants] = useState({}); // 참여자 목록 상태
    const menuRef = useRef(null);

    const toggleMenu = (index) => {
        setMenuVisible(menuVisible === index ? null : index);
    };

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                setLoading(true);
                let tripsData;

                // 카테고리에 따라 적절한 API 호출
                if (category === '전체 일정') {
                    tripsData = await getMyTrips(); // 전체 일정
                } else if (category === '개인 일정') {
                    tripsData = await getPersonalTrips(); // 개인 일정
                } else if (category === '단체 일정') {
                    tripsData = await getGroupTrips(); // 단체 일정
                }

                if (tripsData && Array.isArray(tripsData.trips)) {
                    // 시작 날짜 기준으로 정렬
                    const sortedTrips = tripsData.trips.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
                    setTrips(sortedTrips); // 정렬된 trips 저장

                    // 각 여행의 참여자 목록을 가져옵니다.
                    sortedTrips.forEach(trip => {
                        fetchParticipants(trip.id);
                    });
                } else {
                    console.error("여행 데이터가 배열이 아닙니다:", tripsData);
                }
            } catch (error) {
                console.error("여행 목록을 가져오는 중 오류 발생:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, [category]); // 카테고리가 변경될 때마다 데이터 재요청

    // 참여자 목록 가져오기
    const fetchParticipants = async (tripId) => {
        try {
            const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰 가져오기
            const participantList = await getParticipant(tripId, token); // 참여자 목록 가져오기
            setParticipants(prev => ({ ...prev, [tripId]: participantList })); // 참여자 목록 저장
        } catch (error) {
            console.error(`단체 여행 ${tripId}의 참여자 목록을 가져오는 중 오류 발생:`, error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuVisible(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // D-Day 계산 함수
    const calculateDaysLeft = (startDate) => {
        const today = new Date();
        const tripDate = new Date(startDate);
        const timeDiff = tripDate - today; // 밀리초 차이
        const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24)); // 일 단위로 변환
        return daysLeft;
    };

    // 시간을 "00시 00분" 형식으로 변환하는 함수
    const formatTime = (time) => {
        const hour = time.slice(0, 2);
        const minute = time.slice(2, 4);
        return `${String(hour).padStart(2, '0')}시 ${String(minute).padStart(2, '0')}분`;
    };

    // 여행 나가기 핸들러
    const handleLeaveTrip = async (tripId) => {
        const confirmed = window.confirm("여행에서 나가시겠습니까?");
        if (confirmed) {
            try {
                // 여행 삭제 API 호출
                await leaveTrip(tripId);
                // 여행 목록에서 해당 여행 제거
                setTrips(prevTrips => prevTrips.filter(trip => trip.id !== tripId));
                alert("여행이 삭제되었습니다."); // 사용자 알림
            } catch (error) {
                console.error("여행 삭제 중 오류 발생:", error);
                alert("여행 삭제에 실패했습니다. 다시 시도해 주세요."); // 오류 알림
            }
        }
    };

    return (
        <>
            <Header />
            <div className="page-container">
                <h1 className='mytrip-page-h1'>내 여정 페이지</h1>
                <p className='mytrip-page-p'>여기에서 당신의 여행 목록을 확인하고 관리하세요.</p>
    
                {/* 드롭다운 카테고리 선택 UI */}
                <div className="dropdown">
                    <button className="dropbtn">{category}</button>
                    <div className="dropdown-content">
                        <button onClick={() => setCategory('전체 일정')}>전체 일정</button>
                        <button onClick={() => setCategory('개인 일정')}>개인 일정</button>
                        <button onClick={() => setCategory('단체 일정')}>단체 일정</button>
                    </div>
                </div>
    
                {loading ? ( // 로딩 중일 때
                    <p>로딩 중...</p>
                ) : (
                    <div className="trips-list">
                        {trips.map((trip, index) => {
                            const daysLeft = calculateDaysLeft(trip.start_date);
                            return (
                                <div key={trip.id} className="trip-container">
                                    <div className="trip-days-left">
                                        <p>{daysLeft >= 0 ? `D-${daysLeft}` : '종료'}</p>
                                    </div>
    
                                    <div className="trip-info">
                                        <h3 className="trip-title">{trip.name}</h3>
                                        <p className="trip-dates">
                                            날짜: {trip.start_date} ~ {trip.end_date}
                                        </p>
                                        <p className="trip-time">
                                            시간: {formatTime(trip.start_time)} ~ {formatTime(trip.end_time)}
                                        </p>
                                        <p className="trip-member">
                                            참여자: {participants[trip.id] ? participants[trip.id].map(participant => participant.userid).join(', ') : '참여자가 없습니다.'}
                                        </p>
                                    </div>
    
                                    <FaBars 
                                        size={24} 
                                        className="trip-menu-button" 
                                        onClick={() => toggleMenu(index)} 
                                    />
    
                                    {menuVisible === index && (
                                        <div className="trip-menu" ref={menuRef}>
                                            <button className="menu-item" onClick={() => handleLeaveTrip(trip.id)}>여행 나가기</button>
                                            <button className="menu-item" onClick={() => handleDeleteTrip(trip.id)}>여행 삭제</button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}

export default Mytrip;