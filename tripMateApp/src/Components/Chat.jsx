import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import './Chat.css';
import Button from "./Button";
import Form from "./Form";
// import Header from "./Header";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem('access_token');
  const room = 'testRoom';
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) {
      console.error("로컬 스토리지에 토큰값이 없습니다.");
      return;
    }

    socketRef.current = io('wss://www.daebak.store/chat', {
      auth: { token }
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to server');
      fetchChatHistory();
    });

    socketRef.current.on('message', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // 메세지 전송 함수
  const sendMessage = () => {
    const myMessage = {
      sender: "나",
      content: message,
      createdAt: new Date().toISOString(), 
    };
    setMessages((prevMessages) => [...prevMessages, myMessage]);

    socketRef.current.emit('message', { room: room, content: message });
    setMessage("");
  };

  // 채팅 기록 가져오기
  const fetchChatHistory = async () => {
    try {
      const response = await fetch(`https://www.daebak.store/chat/${room}`, {
        headers: {
          'Authorization': token
        }
      });
      const chatHistory = await response.json();
      setMessages(chatHistory);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  // 같은 날짜끼리 그룹화하기
  const groupMessagesByDate = () => {
    const groupedMessages = {}; // 빈 객체 (key: 날짜, value: 메세지 배열)

    messages.forEach(msg => {
      const date = new Date(msg.createdAt).toISOString().split('T')[0]; // '2024-10-13'
      if (!groupedMessages[date]) {
        groupedMessages[date] = [];
      }
      groupedMessages[date].push(msg);
    });
    console.log(groupedMessages);
    return groupedMessages;
  };

  // const appendMessages



  const renderMessages = () => {
    const groupedMessages = groupMessagesByDate();
    return Object.keys(groupedMessages).map(date => (
      <div key={date} className="message-group">
        <h3 className="message-date">{date}</h3>
        {groupedMessages[date].map((msg, index) => (
          <div key={index} className={`message ${msg.sender === "나" ? "my-message-list" : "other-message-list"}`}>
            <p className="message-sender">{msg.sender}</p>
            <p className="message-content">{msg.content}</p>
            <p className="message-time">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        ))}
      </div>
    ));
  };


  
  return (
    <div>
      {/* <Header /> */}
      <div className="entire-chat">
        <div className="entire-messages">{renderMessages()}</div>
        <div className="message-footer">
          <Form 
              value={message}
              type="text"
              onChange={(e) => setMessage(e.target.value)}
              placeholder="메세지를 입력해주세요."
              className="message-form"
              /> 
          <Button 
              text="전송"
              onClick={sendMessage}
              customClass="message-send-button" 
              />
        </div>
        
      </div>
    </div>
    
  );
};

export default Chat;