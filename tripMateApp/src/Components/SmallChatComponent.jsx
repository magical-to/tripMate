import React, { useState } from 'react';
import Draggable from 'react-draggable';
import ChatComponent from './ChatComponent';
import chatIcon from '../assets/chat.png'; 
import './SmallChatComponent.css'; 

const SmallChatComponent = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    return (
        <Draggable>
            <div className={`small-chat-window ${isOpen ? '' : 'open'}`}>
                {isOpen ? (
                    <>
                        <div className='chat-header'>
                            <button onClick={toggleChat}>닫기</button>
                        </div>
                        <div className='chat-body'>
                            <ChatComponent />
                        </div>
                    </>
                ) : (
                    <button className='chat-icon' onClick={toggleChat}>
                        <img src={chatIcon} alt="채팅 열기" />
                    </button>
                )}
            </div>
        </Draggable>
    );
};

export default SmallChatComponent;
