import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import { io } from "socket.io-client";
import "./Calculate.css";

const Calculate = () => {
    const queryParams = new URLSearchParams(location.search);
    const title = queryParams.get('title');
    const start_date = queryParams.get('start_date');
    const end_date = queryParams.get('end_date');
    const tripId = "42"; // 임시

    const [selectedDay, setSelectedDay] = useState(1);
    const [days, setDays] = useState([]);
    const [expenses, setExpenses] = useState([]); // 경비 데이터를 저장할 상태 추가
    const [selectedCategory, setSelectedCategory] = useState(""); // 선택된 category 상태 추가

    const socket = io("https://www.daebak.store/expenses"); // 서버의 웹소켓 URL

    // 선택된 날짜에 대한 경비 필터링
    const filteredExpenses = selectedCategory
        ? expenses.filter((expense) => expense.category === selectedCategory)
        : expenses;

    // 선택된 날짜의 총 금액 계산
    const totalPriceByDay = filteredExpenses.reduce((sum, expense) => sum + expense.price, 0);

    // 여행 시작일부터 종료일까지의 일자 계산
    useEffect(() => {
        const start = new Date(start_date);
        const end = new Date(end_date);
        const dayCount = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        const dayArray = Array.from({ length: dayCount }, (_, index) => index + 1);
        setDays(dayArray);
    }, [start_date, end_date]);

    // 선택된 날짜 변경 시 해당 날짜의 경비 조회
    
    useEffect(() => {
        if (tripId && selectedDay) {
            // 서버에 날짜와 여행 ID 전송
            socket.emit("filterExpensesByDay", { tripId, day: selectedDay });
    
            // 서버에서 경비 목록을 받을 때
            socket.on("filteredExpenses", (data) => {
                // 모든 경비의 금액을 정수형으로 변환
                const intExpenses = data.map(expense => ({
                    ...expense,
                    price: parseInt(expense.price, 10),
                }));    
                setExpenses(intExpenses); // 경비 데이터를 상태에 저장
            });
        }
    
        // 컴포넌트 언마운트 시 소켓 연결 해제
        return () => {
            socket.off("filteredExpenses");
        };
    }, [selectedDay, tripId, socket]);

    const handleDayChange = (event) => {
        setSelectedDay(parseInt(event.target.value, 10));
    };

    return (
        <div>
            <Header />
            <div className="calculate-header">
                <div className="plan-list">
                    <div className="plan-item">
                        <h3 className="plan-name">{title}</h3>
                        <p className="plan-date">시작일: {start_date}</p>
                        <p className="plan-date">종료일: {end_date}</p>
                    </div>
                </div>
                <div className="total-price">
                    전체 금액
                </div>
            </div>
            
            {/* 드롭다운으로 일자 선택 */}
            <div className="expense-header">
                <select
                    id="dayDropdown"
                    value={selectedDay}
                    onChange={handleDayChange}
                    className="select-day"
                >
                    {days.map((day) => (
                        <option key={day} value={day}>
                            {day}일차 경비
                        </option>
                    ))}
                </select>
                
                <div className="day-price">
                    {totalPriceByDay}원
                </div>
            </div>

            {/* 경비 목록을 테이블 형식으로 표시 */}
            <div className="expense-list">
                {expenses.length === 0 ? (
                    <p>경비가 없습니다.</p>
                ) : (
                    <table className="expense-table">
                        <thead>
                            <tr>
                                <th>분류</th>
                                <th>내용</th>
                                <th>금액</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredExpenses.map((expense) => (
                                <tr key={expense.id}>
                                    <td>{expense.category}</td>
                                    <td>{expense.description}</td>
                                    <td>{expense.price}원</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Calculate;
