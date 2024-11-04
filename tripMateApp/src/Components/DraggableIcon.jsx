import React, { useState } from "react";
import Draggable from "react-draggable";
import Chat from "./Chat";
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
                    <div>
                        <div className="chat-header">
                            <h3 className="chat-title">여행 제목</h3>
                            <Button
                                text="닫기"
                                customClass="chat-close-button"
                                onClick={handleCloseChat}
                            />
                        </div>
                        <Chat />
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
