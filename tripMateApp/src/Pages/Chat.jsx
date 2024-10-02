import React, { useState, useEffect } from 'react';
import io from 'socket.io-client'; // Socket.io import
import Header from '../Components/Header';
import Button from '../Components/Button';
import './Chat.css';

const socket = io(""); // 소켓 서버 주소 설정

const Chat = () => {
  const [message, setMessage] = useState(''); // 입력된 메시지 관리
  const [chatMessages, setChatMessages] = useState([
    { sender: 'choi', text: '하이루~', time: 'PM 15:30', isMine: false },
    { sender: 'yoon', text: '반갑습니다^^', time: 'PM 15:30', isMine: false },
    { sender: 'jung', text: 'ㅋㅋ', time: 'PM 15:30', isMine: false },
    { sender: 'jjang', text: '얘들아 안녕!!', time: 'PM 15:30', isMine: true },
    { sender: 'jjagn', text: '~~', time: 'PM 15:31', isMine: true },
  ]);

  useEffect(() => {
    // 서버에서 'message' 이벤트를 수신
    socket.on('message', (newMessage) => {
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // 컴포넌트가 언마운트될 때 소켓 연결 해제
    return () => {
      socket.disconnect();
    };
  }, []); // 빈 배열을 넣어 컴포넌트가 처음 마운트될 때만 실행

  // 메시지 전송 함수 (변수명은 예시)
  const sendMessage = () => {
    if (message.trim() !== '') {
      const newMessage = {
        sender: 'jjang',
        text: message,
        time: new Date().toLocaleTimeString(),
        isMine: true,
      };
      
      // 메시지 서버로 전송
      socket.emit('sendMessage', newMessage);

      // 전송 후 UI에 바로 반영
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage(''); // 입력 필드 초기화
    }
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <Header title="TripMate" />

      {/* 초대 메시지 */}
      <div className="invite-message">
        <p>윤재형님, 장성원님, 정진교님, 최윤서님이 초대되었습니다.</p>
        <p className="chat-date">2023-09-13</p>
      </div>

      {/* 메시지 목록 */}
      <div className="message-list">
        {chatMessages.map((msg, index) => (
          <div
            key={index}
            className={`message-item ${msg.isMine ? 'my-message' : 'received-message'}`}
          >
            {!msg.isMine && <p className="message-sender">{msg.sender}</p>}
            <p className="message-text">{msg.text}</p>
            <p className="message-time">{msg.time}</p>
          </div>
        ))}
      </div>

      {/* 메시지 입력 및 전송 */}
      <div className="message-input-container">
        <input
          type="text"
          placeholder="내용 입력"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="message-input"
        />
        <Button onClick={sendMessage} text="전송" className="send-button" />
      </div>
    </div>
  );
};

export default Chat;
