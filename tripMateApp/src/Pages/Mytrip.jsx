import React, { useState, useEffect, useRef } from 'react';
import Header from '../Components/Header';
import { FaBars } from 'react-icons/fa';
import tripImage1 from '../assets/1.png';
import tripImage2 from '../assets/2.png';
import tripImage3 from '../assets/3.png';
import './Mytrip.css';

const trips = [
    {
        title: '우정 여행',
        members: ['윤서', '성원', '재형', '진교'],
        dates: '2024-10-03 ~ 2024-10-05',
        image: tripImage1,
        daysLeft: 9,
    },
    {
        title: '제주도 여행',
        members: ['사람1', '사람2'],
        dates: '2024-11-10 ~ 2024-11-12',
        image: tripImage2,
        daysLeft: 15,
    },
    {
        title: '부산 여행',
        members: ['사람3', '사람4'],
        dates: '2024-12-01 ~ 2024-12-03',
        image: tripImage3,
        daysLeft: 45,
    },
];

const Mytrip = () => {
    const [menuVisible, setMenuVisible] = useState(null);
    const menuRef = useRef(null);

    const toggleMenu = (index) => {
        setMenuVisible(menuVisible === index ? null : index);
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

    return (
        <>
            <Header />
            <div className="page-container">
                <h1>내 여정 페이지</h1>
                <p>여기에서 당신의 여행 목록을 확인하고 관리하세요.</p>

                <div className="trips-list">
                    {trips.map((trip, index) => (
                        <div key={index} className="trip-container">
                            <img 
                                src={trip.image} 
                                alt={`${trip.title} 대표 사진`} 
                                className="trip-image"
                            />

                            <div className="trip-info">
                                <h2 className="trip-title">{trip.title}</h2>
                                <p className="trip-members">
                                    참여자: {trip.members.join(', ')}
                                </p>
                                <p className="trip-dates">날짜: {trip.dates}</p>
                            </div>

                            <div className="trip-days-left">
                                <p>D-{trip.daysLeft}</p>
                            </div>

                            <FaBars 
                                size={24} 
                                className="trip-menu-button" 
                                onClick={() => toggleMenu(index)} 
                            />

                            {menuVisible === index && (
                                <div className="trip-menu" ref={menuRef}>
                                    <button className="menu-item">여행 나가기</button>
                                    <button className="menu-item">여행 삭제</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Mytrip;
