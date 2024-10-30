import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import './Chat2.css';

const Chat2 = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem('access_token');
  const room = 'testRoom';

  // 소켓 초기화 및 연결
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

  // 메시지 전송 함수
  const sendMessage = () => {
    const socket = io('wss://www.daebak.store/chat');
    socket.emit('message', { room, content: message });
    setMessage("");
  };

  // 방 참여 및 나가기 함수
  const joinRoom = () => {
    const socket = io('wss://www.daebak.store/chat');
    socket.emit('joinRoom', { room });
  };

  const leaveRoom = () => {
    const socket = io('wss://www.daebak.store/chat');
    socket.emit('leaveRoom', { room });
  };

  // 채팅 기록 불러오기
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

  // 메시지 표시 함수
  const renderMessages = () =>
    messages.map((msg, index) => (
      <p key={index}>
        {msg.sender}: {msg.content} {msg.createdAt}
      </p>
    ));

  return (
    <div>
      <div id="messages">{renderMessages()}</div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
      <button onClick={joinRoom}>Join Room</button>
      <button onClick={leaveRoom}>Leave Room</button>
    </div>
  );
};

export default Chat2;
