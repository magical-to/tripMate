import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import Draggable from "react-draggable";
import './Needs.css';
import Button from "./Button";

const Needs = ({ tripId }) => {
    const [isNeedsOpen, setIsNeedsOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState('');

    // useEffect로 소켓 연결 관리
    useEffect(() => {
        const socket = io("http://localhost:3000"); // 서버 주소에 맞게 수정

        // 서버에서 준비물 데이터 수신
        socket.on("preparationList", (data) => {
            if (data.room === tripId) {
                setItems(prevItems => [
                    ...prevItems,
                    { id: Date.now(), text: data.item, checked: false }
                ]);
            }
        });

        // 컴포넌트 언마운트 시 소켓 연결 해제
        return () => {
            socket.disconnect();
        };
    }, [tripId]);

    // 창 열기 함수
    const handleOpenClick = () => {
        setIsNeedsOpen(true);
    };

    // 창 닫기 함수
    const handleCloseClick = () => {
        setIsNeedsOpen(false);
    };

    // 아이템 추가 함수
    const handleAddItem = () => {
        if (newItem.trim() === '') return;

        // 새로운 아이템 준비
        const nextItem = { room: tripId, item: newItem };

        // 서버에 아이템 emit
        const socket = io("http://localhost:3000");
        socket.emit("preparationList", nextItem);

        // 로컬 상태 업데이트
        const nextId = items.length > 0 ? items[items.length - 1].id + 1 : 1;
        setItems([...items, { id: nextId, text: newItem, checked: false }]);
        setNewItem('');
    };

    const handleDone = () => {
        console.log("준비물 완료");
    };

    // 체크박스 상태 변경 함수
    const handleCheckChange = (id) => {
        setItems(
            items.map(item =>
                item.id === id ? { ...item, checked: !item.checked } : item
            )
        );
    };

    // 아이템 삭제 함수
    const handleDeleteItem = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    return (
        <div>
            <Draggable>
                {isNeedsOpen ? (
                    /* 열려 있는 상태 */
                    <div className="needs-open-container">
                        <div className="needs-open-header">
                            <div id="h3-text">
                                <h3>준비물 체크리스트</h3>
                            </div>
                            <Button
                                text="x"
                                customClass="needs-close-button"
                                onClick={handleCloseClick}
                            />
                        </div>
                        <div className="needs-list">
                            {items.map(item => (
                                <div key={item.id} className="needs-item">
                                    <input
                                        type="checkbox"
                                        checked={item.checked}
                                        onChange={() => handleCheckChange(item.id)}
                                    />
                                    <label className="label" htmlFor={`item-${item.id}`}>{item.text}</label>
                                    <Button
                                        text="삭제"
                                        customClass="needs-delete-button"
                                        onClick={() => handleDeleteItem(item.id)}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="needs-add-item">
                            <input
                                className="needs-add-item-form"
                                type="text"
                                value={newItem}
                                onChange={(e) => setNewItem(e.target.value)}
                                placeholder=" 새로운 항목 입력"
                            />
                            <Button
                                text="+"
                                customClass="needs-add-button"
                                onClick={handleAddItem}
                            />
                        </div>
                        {/* <Button 
                            text="완료"
                            customClass="needs-done-button"
                            onClick={handleDone}
                        /> */}
                    </div>
                ) : (
                    /* 닫혀 있는 상태 */
                    <div className="needs-open-icon" onClick={handleOpenClick}>
                        준비물
                    </div>
                )}
            </Draggable>
        </div>
    );
};

export default Needs;
