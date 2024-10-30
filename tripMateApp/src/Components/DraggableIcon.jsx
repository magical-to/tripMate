import React, { useState } from "react";
import Draggable from "react-draggable";
import ChatComponent from "./ChatComponent";
import Chat2 from "./Chat2";
import './DraggableIconChat.css';
import Button from "./Button";

const DraggableIconChat = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);

    const handleIconClick = () => {
        setIsChatOpen(true);
    };

    const handleCloseChat = () => {
        setIsChatOpen(false);
    };

    return (
        <Draggable>
            <div className="draggable-container">
                {isChatOpen ? (
                    <div className="chat-window">
                        <div className="chat-header">
                            <h3>여행 제목</h3>
                            <Button
                                text="닫기"
                                customClass="close-button"
                                onClick={handleCloseChat}
                            />
                        </div>
                        <Chat2 />
                    </div>
                ) : (
                    <div className="chat-icon" onClick={handleIconClick}>
                        👾
                    </div>
                )}
            </div>
        </Draggable>
    );
};

export default DraggableIconChat;
