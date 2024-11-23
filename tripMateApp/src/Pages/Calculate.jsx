import React, { useState, useEffect, useRef } from "react";
import Header from "../Components/Header";
import { io } from "socket.io-client";
import "./Calculate.css";

const Calculate = () => {
    const [days, setDays] = useState([]); // 여행 일수 배열
    const [expenses, setExpenses] = useState([]); // 경비 목록
    const [selectedCategory, setSelectedCategory] = useState(""); // 선택한 카테고리
    const [selectedDay, setSelectedDay] = useState(1); // 선택된 날
    const [expenseData, setExpenseData] = useState({
        price: '', // 금액
        category: '', // 카테고리
        description: '', // 설명
        day: selectedDay, // 초기값으로 설정된 선택된 날
    });
    const [totalExpense, setTotalExpense] = useState(0); // 총 경비
    const [editingExpenseId, setEditingExpenseId] = useState(null); // 수정 중인 경비 ID

    // URL 쿼리 파라미터에서 값 추출
    const queryParams = new URLSearchParams(location.search);
    const title = queryParams.get('title'); // 여행 제목
    const start_date = queryParams.get('start_date'); // 시작일
    const end_date = queryParams.get('end_date'); // 종료일
    // const tripId = queryParams.get('tripId'); // 여행 번호
    const tripId = "42"; // 임시

    // 소켓 연결
    const socket = io("https://www.daebak.store/expenses");

    // 선택한 카테고리에 따라 필터링된 경비 목록
    const filteredExpenses = selectedCategory
        ? expenses.filter((expense) => expense.category === selectedCategory)
        : expenses;

    // 선택한 날의 총 경비 계산
    const totalPriceByDay = filteredExpenses.reduce((sum, expense) => sum + expense.price, 0);

    // 여행 날짜 수 계산하여 배열 생성
    useEffect(() => {
        const start = new Date(start_date);
        const end = new Date(end_date);
        const dayCount = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1; // 날짜 차이 계산
        const dayArray = Array.from({ length: dayCount }, (_, index) => index + 1); // 1일부터 dayCount까지의 배열 생성
        setDays(dayArray);
    }, [start_date, end_date]);

    // 소켓 이벤트 핸들링
    useEffect(() => {
        if (tripId && selectedDay) {
            // 선택된 날에 따른 경비 필터링 요청
            socket.emit("filterExpensesByDay", { tripId, day: selectedDay });

            // 필터링된 경비 목록 수신
            socket.on("filteredExpenses", (data) => {
                const intExpenses = data.map(expense => ({
                    ...expense,
                    price: parseInt(expense.price, 10), // 금액을 정수로 변환
                }));    
                setExpenses(intExpenses); // 상태 업데이트
            });

            // 방에 참여
            socket.emit("joinRoom", { room: tripId });
            // // 모든 경비 요청
            // socket.emit("getAllExpenses", { tripId });
            // // 총 경비 요청
            // socket.emit("getTotalExpense", { tripId });

            // 컴포넌트 언마운트 시 소켓 이벤트 해제
            return () => {
                socket.off("filteredExpenses");
                socket.off("joinedRoom");
                socket.off("expenseList");
                socket.off("totalExpense");
            };
        }
    }, [selectedDay, tripId, socket]);

    // 경비 추가 입력값 변경 처리
    const handleCreateExpenseChange = (e) => {
        const { name, value } = e.target; // 입력 필드의 name과 value 추출
        setExpenseData((prevData) => ({
            ...prevData,
            [name]: value, // 해당 필드 업데이트
        }));
    };

    // 경비 추가 요청 처리
    const handleCreateExpenseSubmit = (e) => {
        e.preventDefault(); // 기본 폼 제출 방지
        if (!expenseData.price || !expenseData.category || !expenseData.description) {
            console.log("빈 값이 있어서 경비 추가 안 함."); // 빈 값 체크
            return;
        }

        // 경비 추가 요청
        socket.emit("createExpense", {
            tripId,
            expenseData: { ...expenseData, day: selectedDay }, // 선택된 날로 설정
        });

        // 입력 필드 초기화
        setExpenseData({
            price: '',
            category: '',
            description: '',
            day: selectedDay,
        });
    };

    // 경비 수정 핸들러
    const handleEditExpense = (expense) => {
        setExpenseData({
            price: expense.price,
            category: expense.category,
            description: expense.description,
            day: expense.day,
        });
        setEditingExpenseId(expense.id); // 수정 중인 경비 ID 설정
    };

    // 경비 업데이트 요청 처리
    const handleUpdateExpense = (e) => {
        e.preventDefault(); // 기본 폼 제출 방지
        if (!expenseData.price || !expenseData.category || !expenseData.description) {
            console.log("빈 값이 있어서 경비 수정 안 함."); // 빈 값 체크
            return;
        }

        // 경비 수정 요청
        socket.emit("editExpense", {
            tripId,
            expenseId: editingExpenseId,
            expenseData: expenseData,
        });

        // 입력 필드 초기화
        setExpenseData({
            price: '',
            category: '',
            description: '',
            day: selectedDay,
        });
        setEditingExpenseId(null); // 수정 모드 해제
    };

    // 경비 삭제 요청 처리
    const handleDeleteExpense = (expenseId) => {
        socket.emit("deleteExpense", {
            expenseId,
            tripId,
            day: selectedDay,
        });
    };

    

    // 총 경비 조회 요청 처리
    const handleGetTotalExpense = () => {
        console.log(totalExpense);
        socket.emit("getTotalExpense", { tripId });

        socket.on("totalExpense", (data) => {
            setTotalExpense(data.total); // 총 경비 상태 업데이트
        });
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
                    총합: {totalExpense}원
                    <button onClick={handleGetTotalExpense}>총 경비 조회</button>
                </div>
            </div>
            
            <div className="expense-header">
                <div>
                    <select 
                        className="select-day"
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
                <div className="day-price">
                    {totalPriceByDay}원
                </div>
            </div>

            <div className="expense-list">
                {filteredExpenses.length === 0 ? (
                    <p>경비를 추가하세요!</p>
                ) : (
                    <table className="expense-table">
                        <thead>
                            <tr>
                                <th>분류</th>
                                <th>내용</th>
                                <th>금액</th>
                                <th>수정</th>
                                <th>삭제</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredExpenses.map((expense) => (
                                <tr key={expense.id}>
                                    <td>{expense.category}</td>
                                    <td>{expense.description}</td>
                                    <td>{expense.price}원</td>
                                    <td>
                                        <button onClick={() => handleEditExpense(expense)}>수정</button>
                                    </td>
                                    <td>
                                        <button onClick={() => handleDeleteExpense(expense.id)}>삭제</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>


            {/* 경비 추가 폼 */}
            <form className="expense-form" onSubmit={editingExpenseId ? handleUpdateExpense : handleCreateExpenseSubmit}>
                {/* <h5 className="expense-form-info">경비 {editingExpenseId ? '수정' : '추가'}</h5> */}
                <div className="expense-input">
                    <input
                        className="forms"
                        type="number"
                        name="price"
                        value={expenseData.price}
                        onChange={handleCreateExpenseChange}
                        placeholder="금액"
                    />
                    <input
                        className="forms"
                        type="text"
                        name="category"
                        value={expenseData.category}
                        onChange={handleCreateExpenseChange}
                        placeholder="분류"
                    />
                    <input
                        className="forms"
                        type="text"
                        name="description"
                        value={expenseData.description}
                        onChange={handleCreateExpenseChange}
                        placeholder="내용"
                    />
                    <button type="submit" className="form-button">{editingExpenseId ? '수정' : '+'}</button>
                </div>
            </form>
        </div>
    );
};

export default Calculate;

