import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import './Chat.css';
import Button from "./Button";
import Form from "./Form";
import Header from "./Header";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem('access_token');
//   const room = 'trip_id';
  const room = 'testRoom'

  useEffect(() => {
    if (!token) {
      console.error("로컬 스토리지에 토큰값이 없습니다.");
      return;
    }

    const socket = io('wss://www.daebak.store/chat', {
      auth: { token }
    });

    socket.on('connect', () => {
      console.log('Connected to server');
      fetchChatHistory();
    });

    socket.on('message', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    socket.on('joinedRoom', (room) => {
      console.log(`Joined room: ${room}`);
    });

    socket.on('leftRoom', (room) => {
      console.log(`Left room: ${room}`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // 메세지 전송 함수
  const sendMessage = () => {
    const socket = io('wss://www.daebak.store/chat');

    // 자신이 보낸 메시지를 화면에 표시
    const myMessage = {
      sender: "나",
      content: message,
      createdAt: new Date().toISOString(), 
    };
    setMessages((prevMessages) => [...prevMessages, myMessage]);

    socket.emit('message', { room, content: message });
    setMessage("");
  };

  const joinRoom = () => {
    const socket = io('wss://www.daebak.store/chat');
    socket.emit('joinRoom', { room });
  };

  const leaveRoom = () => {
    const socket = io('wss://www.daebak.store/chat');
    socket.emit('leaveRoom', { room });
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
      <Header />
      <div className="chat-entry">
        <div className="past-messages">{renderMessages()}</div>
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
