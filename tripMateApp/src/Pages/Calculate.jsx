import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import { io } from "socket.io-client";
import "./Calculate.css";

const Calculate = () => {
    const [days, setDays] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedDay, setSelectedDay] = useState(1); // 선택된 날을 관리하는 상태 추가
    const [expenseData, setExpenseData] = useState({
        price: '',
        category: '',
        description: '',
        day: selectedDay,  // 초기 값으로 설정
    }); 

    const queryParams = new URLSearchParams(location.search);
    const title = queryParams.get('title');
    const start_date = queryParams.get('start_date');
    const end_date = queryParams.get('end_date');
    const tripId = "42"; 

    const socket = io("https://www.daebak.store/expenses");

    const filteredExpenses = selectedCategory
        ? expenses.filter((expense) => expense.category === selectedCategory)
        : expenses;

    const totalPriceByDay = filteredExpenses.reduce((sum, expense) => sum + expense.price, 0);

    useEffect(() => {
        const start = new Date(start_date);
        const end = new Date(end_date);
        const dayCount = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        const dayArray = Array.from({ length: dayCount }, (_, index) => index + 1);
        setDays(dayArray);
    }, [start_date, end_date]);

    useEffect(() => {
        if (tripId && selectedDay) {
            socket.emit("filterExpensesByDay", { tripId, day: selectedDay });

            socket.on("filteredExpenses", (data) => {
                const intExpenses = data.map(expense => ({
                    ...expense,
                    price: parseInt(expense.price, 10),
                }));    
                setExpenses(intExpenses);
            });

            socket.emit("joinRoom", { room: tripId });
            socket.emit("getAllExpenses", { tripId });
            socket.emit("getTotalExpense", { tripId });

            return () => {
                socket.off("filteredExpenses");
                socket.off("joinedRoom");
                socket.off("expenseList");
                socket.off("totalExpense");
            };
        }
    }, [selectedDay, tripId, socket]);

    const handleCreateExpenseChange = (e) => {
        const { name, value } = e.target;
        setExpenseData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCreateExpenseSubmit = (e) => {
        e.preventDefault();
        if (!expenseData.price || !expenseData.category || !expenseData.description) {
            console.log("빈 값이 있어서 경비 추가 안 함.");
            return;
        }

        // 경비 추가 요청
        socket.emit("createExpense", {
            tripId,
            expenseData: { ...expenseData, day: selectedDay }, // 선택된 날로 설정
        });

        setExpenseData({
            price: '',
            category: '',
            description: '',
            day: selectedDay,  // 기존의 day 값 유지
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
                    총합: 100,800원 {/* 임시 */}
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

            <form onSubmit={handleCreateExpenseSubmit} >
                <h5 className="expense-form-info">경비 추가</h5>
                <div className="expense-form">
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
                    <button type="submit" className="form-button">+</button>
                </div>
                
            </form>
        </div>
    );
};

export default Calculate;
