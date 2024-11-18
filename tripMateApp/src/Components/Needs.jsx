// 준비물 컴포넌트
import React, { useState } from "react";
import Draggable from "react-draggable";
import './Needs.css';
import Header from "./Header";
import Button from "./Button";

const Needs = () => {
    const [isNeedsOpen, setIsNeedsOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState('');

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
        const nextId = items.length > 0 ? items[items.length - 1].id + 1 : 1;
        setItems([...items, { id: nextId, text: newItem, checked: false }]);
        setNewItem('');
    };

    const handleDone = () => {
        console.log("준비물 완료");
    }

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
                        <Button 
                            text="완료"
                            customClass="needs-done-button"
                            onClick={handleDone}
                        />
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
