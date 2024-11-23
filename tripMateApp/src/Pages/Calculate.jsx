import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import './Calculate.css';
import Header from '../Components/Header';
import Button from '../Components/Button';

const Calculate = () => {
    const [expenses, setExpenses] = useState([]);
    const [totalExpense, setTotalExpense] = useState(0);
    const [selectedDay, setSelectedDay] = useState(1); // 선택된 날
    const [days, setDays] = useState([]); // 여행 일수 배열
    const [price, setPrice] = useState([]);
    const [editingExpenseId, setEditingExpenseId] = useState(null); // 수정 중인 경비 ID
    const [expenseData, setExpenseData] = useState({
        price: '',
        category: '',
        description: '',
        day: selectedDay, // 초기값으로 설정된 선택된 날
    });

    const socket = useRef(null);
    const token = localStorage.getItem('access_token');
    const queryParams = new URLSearchParams(location.search);
    const title = queryParams.get('title'); // 여행 제목
    const start_date = queryParams.get('start_date'); // 시작일
    const end_date = queryParams.get('end_date'); // 종료일
    const tripId = queryParams.get('tripId'); // 여행 번호

    // 날짜수 계산해서 배열 생성
    useEffect(() => {
        const start = new Date(start_date);
        const end = new Date(end_date);
        const dayCount = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        const dayArray = Array.from({ length: dayCount }, (_, index) => index + 1);
        setDays(dayArray);
    }, []);
    

    useEffect(() => {
        // 소켓 초기화
        socket.current = io('wss://www.daebak.store/expenses', {
            auth: { token }, // 인증 토큰
        });

        // 소켓 초기화가 완료된 후에만 이벤트 리스너 등록
        socket.current.on('connect', () => {
            console.log('서버에 연결됨');
            socket.current.emit('joinRoom', { tripId });
            socket.current.emit('getTotalExpense', { tripId });
            socket.current.emit('getAllExpenses', { tripId });
        });

        // 전체 경비 목록 수신
        // socket.current.on('expenseList', (expenses) => {
        //     console.log("수신된 전체 경비 목록: ", expenses);
        //     setExpenses(expenses);
        // });

        // 날짜 별로 경비 목록 수신
        if (tripId && selectedDay) {
            // 선택된 날에 따른 경비 필터링 요청
            socket.current.emit("filterExpensesByDay", { tripId, day: selectedDay });

            // 필터링된 경비 목록 수신
            socket.current.on("filteredExpenses", (data) => {
                console.log(data);
                
                // 선택한 일차의 모든 가격을 합산
                const totalPrice = data.reduce((acc, expense) => acc + parseInt(expense.price, 10), 0);

                // 상태 업데이트
                setPrice(totalPrice); // price 상태에 합산된 가격 저장

                const intExpenses = data.map(expense => ({
                    ...expense,
                    price: parseInt(expense.price, 10), // 금액을 정수로 변환
                }));    
                setExpenses(intExpenses); // 상태 업데이트
                
            });
        }
    
        // 경비 총 금액 응답 수신 (업데이트 될 때마다 새로고침 필요)
        socket.current.on('totalExpense', (data) => {
            setTotalExpense(data.total);
        });

        // 새로운 경비가 생성되었을 때 처리
        socket.current.on('expenseCreated', (response) => {
            setExpenses((prevExpenses) => [...prevExpenses, response.newExpense]);
        });

        // 컴포넌트 언마운트 시 소켓 연결 해제
        return () => {
            socket.current.disconnect();
        };
    }, [selectedDay, tripId, socket]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setExpenseData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // 경비 추가
    const handleCreateExpense = () => {
        // 입력 데이터 유효성 검사
        if (!expenseData.price || !expenseData.category || !expenseData.description) {
            alert('모든 필드를 입력하세요.');
            return;
        }
        
        console.log("보낼 경비 데이터: ", tripId, { ...expenseData, day: selectedDay });
    
        // 서버에 경비 생성 요청
        socket.current.emit('createExpense', {
            tripId,
            expenseData: { ...expenseData, day: selectedDay }, // 선택된 날로 설정
        });
    
        // 입력 필드 초기화
        setExpenseData({
            price: '',
            category: '',
            description: '',
            day: '', // day는 초기화 필요 없음
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
        socket.current.emit("editExpense", {
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

        // 새로고침
        window.location.reload()
    };

    // 경비 삭제 요청 처리
    const handleDeleteExpense = (expenseId) => {
        // 서버에 삭제 요청
        socket.current.emit("deleteExpense", {
            expenseId,
            tripId,
            day: selectedDay,
        });

        // 삭제 후 즉시 목록 업데이트
        socket.current.on("expenseList", (updatedExpenses) => {
            // 업데이트된 경비 목록을 상태에 저장
            setExpenses(updatedExpenses);
        });

        // 경비 업데이트
        socket.current.emit("filterExpensesByDay", { tripId, day: selectedDay });

        // 필터링된 경비 목록 수신
        const handleFilteredExpenses = (data) => {
            console.log(data);
            const totalPrice = data.reduce((acc, expense) => acc + parseInt(expense.price, 10), 0);
            setPrice(totalPrice); // 상태 업데이트
        };
    
        socket.current.on("filteredExpenses", handleFilteredExpenses);
        window.location.reload()
        // day 재설정..?
    };

    

    return (
        <div>
            <Header />
            <div className="expense-entire">
                <div className="calculate-header">
                    <div className="plan-list">
                        <h3 className="plan-name">{title}</h3>
                        <p className="plan-date">시작일: {start_date}</p>
                        <p className="plan-date">종료일: {end_date}</p>
                    </div>
                    <p className='total-price'>총합: {totalExpense}원</p>
                </div>

                <div className='expense-set'>
                    <select 
                        className='select-day'
                        value={selectedDay}
                        onChange={(e) => setSelectedDay(Number(e.target.value))}
                    >
                        {days.map((day) => (
                            <option key={day} value={day}>
                                {day}일차
                            </option>
                        ))}
                    </select>
                    <div className='day-price'>
                        {price}원
                    </div>
                </div>
                
                <div className='expense-list'>
                    <table className="expense-table">
                        <thead>
                            <tr>
                                <th>카테고리</th>
                                <th>내용</th>
                                <th>가격</th>
                                <th>수정</th>
                                <th>삭제</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.length > 0 ? (
                                expenses.map((expense) => (
                                    <tr key={expense.id}>
                                        <td>{expense.category}</td>
                                        <td>{expense.description}</td>
                                        <td>{expense.price}원</td>
                                        <td>
                                            <Button 
                                                customClass='list-button'
                                                text="수정"
                                                onClick={() => handleEditExpense(expense)}
                                            />
                                        </td>
                                        <td>
                                            <Button 
                                                customClass='list-button'
                                                text="삭제"
                                                onClick={() => handleDeleteExpense(expense.id)}
                                            />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center' }}>경비가 없습니다.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <form className="expense-form" onSubmit={editingExpenseId ? handleUpdateExpense : handleCreateExpense}>
                    <input
                        className="expense-input"
                        type="number"
                        name="price"
                        placeholder="가격"
                        value={expenseData.price}
                        onChange={handleInputChange}
                    />
                    <input
                        className="expense-input"
                        type="text"
                        name="category"
                        placeholder="카테고리"
                        value={expenseData.category}
                        onChange={handleInputChange}
                    />
                    <input
                        className="expense-input"
                        type="text"
                        name="description"
                        placeholder="내용"
                        value={expenseData.description}
                        onChange={handleInputChange}
                    />
                    <input
                        className="expense-input"
                        type="number"
                        name="day"
                        placeholder="날짜 (지울 예정)"
                        value={selectedDay}
                        onChange={handleInputChange}
                        readOnly
                    />
                    <button type="submit" className="form-button">{editingExpenseId ? '수정' : '추가'}</button>
                </form>
            </div>
        </div> 
    );
};

export default Calculate;
