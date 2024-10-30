import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import './Chat2.css';

const Chat2 = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem('access_token');
  const room = 'testRoom';

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
      sender: "You",
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
