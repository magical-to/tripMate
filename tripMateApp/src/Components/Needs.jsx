import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import Draggable from "react-draggable";
import './Needs.css';
import Button from "./Button";

const Needs = ({ tripId, title }) => {
    const [isNeedsOpen, setIsNeedsOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState('');
    const room = String(tripId);
    
    const socket = useRef(null); // useRef를 사용하여 socket을 정의
    useEffect(() => {
        socket.current = io('wss://www.daebak.store/preparations'); 
        

        // 서버 연결 후 채팅방 입장
        socket.current.on('connect', () => {
            console.log('준비물 서버 연결되었습니다.');
            socket.current.emit('joinRoom', { room: room });
        });

        // 기존 준비물 목록 업데이트
        socket.current.on("preparationList", (preparations) => {
            setItems(preparations.map((item) => ({
                id: item.id,
                text: item.item,
                checked: item.isChecked,
            })));
            console.log("기존 목록 업데이트: ");
            console.log(preparations)
        });

        // 컴포넌트 언마운트 시 소켓 연결 종료
        return () => {
            socket.current.disconnect();
          };
    }, [room]);

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
        socket.current.emit("createItem", { room: room, item: newItem });
        const nextId = items.length > 0 ? items[items.length - 1].id + 1 : 1;
        setItems([...items, { id: nextId, text: newItem, checked: false }]);
        console.log("준비물이 추가 되었습니다.");
        setNewItem('');
    };

    // 준비 상태 변경 함수
    const handleCheckChange = (id) => {
        if (socket) {
            socket.current.emit("togglePreparationStatus", { id, room: room });
            console.log("준비 상태 변경");
        }
    };

    // 아이템 삭제 함수
    const handleDeleteItem = (id) => {
        if (socket) {
            socket.current.emit("deletePreparation", { id, room: room });
        }
    };

    return (
        <div>
            <Draggable>
                {isNeedsOpen ? (
                    /* 열려 있는 상태 */
                    <div className="needs-open-container">
                        <div className="needs-open-header">
                            <h3 className="needs-title">{title}</h3>
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
                                        className="checkbox-style"
                                        type="checkbox"
                                        checked={item.checked}
                                        onChange={() => handleCheckChange(item.id)}
                                    />
                                    <label className="label">{item.text}</label>
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
