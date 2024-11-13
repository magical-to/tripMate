// tripMateApp/src/Components/Chat.jsx
import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import './Chat.css';
import Button from "./Button";
import Form from "./Form";

const Chat = ({ tripId }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem('access_token');
  const room = String(tripId);
  console.log(room);
  const socket = useRef(null); // useRef를 사용하여 socket을 정의

  useEffect(() => {
    socket.current = io('wss://www.daebak.store/chat', {
      auth: { token } 
    });

    if (!token) {
      console.error("로컬 스토리지에 토큰값이 없습니다.");
      return;
    }

    // 서버 연결 성공 시 채팅방 입장
    socket.current.on('connect', () => {
      console.log('채팅 서버 연결 성공! 채팅방 입장 중..');
      socket.current.emit('joinRoom', { room: room });
      fetchChatHistory();
    });

    // 메세지 수신
    socket.current.on('emitmessage', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // 컴포넌트 언마운트 시 소켓 연결 해제
    return () => {
      socket.current.emit('leaveRoom', { room });
      socket.current.disconnect();
    };
  }, [token]);

  // 메세지 전송 함수
  const sendMessage = () => {
    if (!message.trim()) return; // 빈 메시지 방지

    const myMessage = {
      sender: "나",
      content: message,
      createdAt: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, myMessage]);
    socket.current.emit('message', { room: room, content: message }); // socket.current 사용
    setMessage("");
  };

  // 채팅 기록 가져오기
  const fetchChatHistory = async () => {
    try {
      const response = await fetch(`https://www.daebak.store/chat/${room}`, {
        headers: {
          'Authorization': token,
        }
      });
      const chatHistory = await response.json();
      setMessages(chatHistory);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  // 같은 날짜끼리 메시지 그룹화
  const groupMessagesByDate = () => {
    const groupedMessages = {};
    messages.forEach(msg => {
      const date = new Date(msg.createdAt).toISOString().split('T')[0];
      if (!groupedMessages[date]) {
        groupedMessages[date] = [];
      }
      groupedMessages[date].push(msg);
    });
    return groupedMessages;
  };

  // 그룹화된 메시지 렌더링
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