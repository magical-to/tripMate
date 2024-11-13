import React, { useState } from "react";
import Draggable from "react-draggable";
import Chat from "./Chat";
import './DraggableIconChat.css';
import Button from "./Button";
import chatImg from "../assets/chat.png"

const DraggableIcon = ({ tripId }) => {
    const [isChatOpen, setIsChatOpen] = useState(false);

    const handleIconClick = () => {
        setIsChatOpen(true);
    };

    const handleCloseChat = () => {
        setIsChatOpen(false); 
    };

    return (
        <Draggable>
                {isChatOpen ? (
                    <div className="chat-container"> 
                        <div className="chat-header">
                            <h3 className="chat-title">여행 제목</h3>
                            <Button
                                text="닫기"
                                customClass="chat-close-button"
                                onClick={handleCloseChat}
                            />
                        </div>
                        <Chat tripId={tripId} />
                    </div>
                ) : (
                    <div className="chat-icon" onClick={handleIconClick}>
                        ✉️
                    </div>
                )}
            
        </Draggable>
    );
};

export default DraggableIcon;