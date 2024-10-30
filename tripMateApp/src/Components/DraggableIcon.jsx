import React, { useState } from "react";
import Draggable from "react-draggable";
import ChatComponent from "./ChatComponent";

const DraggableIconChat = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);

    // 아이콘 클릭 시 채팅방 열기
    const handleIconClick = () => {
        setIsChatOpen(true);
    };

    // 채팅방 닫기 버튼 클릭 시 다시 아이콘으로 전환
    const handleCloseChat = () => {
        setIsChatOpen(false);
    };

    return (
        <Draggable>
            <div
                style={{
                    position: "fixed",
                    bottom: "10px",
                    right: "10px",
                    zIndex: 1000,
                    cursor: "pointer"
                }}
            >
                {/* 아이콘 또는 채팅방 조건부 렌더링 */}
                {isChatOpen ? (
                    <div
                        style={{
                            width: "250px",
                            height: "300px",
                            backgroundColor: "white",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                            padding: "10px",
                            borderRadius: "10px",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <h3>채팅방</h3>
                            <button onClick={handleCloseChat} style={{ cursor: "pointer" }}>
                                닫기
                            </button>
                        </div>
                        <ChatComponent />
                    </div>
                ) : (
                    // 채팅방이 닫힌 상태에서 아이콘 표시
                    <div
                        onClick={handleIconClick}
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            backgroundColor: "lightblue",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        👾
                    </div>
                )}
            </div>
        </Draggable>
    );
};

export default DraggableIconChat;
