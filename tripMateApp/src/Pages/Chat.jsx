import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client'; 
import Header from '../Components/Header';
import Button from '../Components/Button';
import Form from '../Components/Form';
import calendar from '../assets/calendar.png';
import './Chat.css';


const socket = io(""); // 소켓 서버 주소 설정

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const Chat = () => {
  const navigate = useNavigate();

  const [userId, setUserId] = useState('jjang'); // 로그인한 사용자의 ID
  const [message, setMessage] = useState(''); // 입력된 메시지 관리
  const [chatMessages, setChatMessages] = useState([
    { sender: 'choi', text: '하이루~', time: '오후 15:30', date: '2023-09-13', isMine: false },
    { sender: 'yoon', text: '반갑습니다^^', time: '오후 15:30', date: '2023-09-13', isMine: false },
    { sender: 'jung', text: 'ㅋㅋ', time: '오후 15:30', date: '2023-09-13', isMine: false },
    { sender: 'jjang', text: '얘들아 안녕!!', time: '오후 15:30', date: '2023-09-13', isMine: true },
    { sender: 'jjagn', text: '~~', time: '오후 15:31', date: '2023-09-14', isMine: true },
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

  // 메시지 전송 함수
  const sendMessage = () => {
    if (message.trim() !== '') {
      const newMessage = {
        sender: userId,  // 현재 로그인한 사용자의 ID
        text: message, // 현재 입력된 메시지
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toISOString().split('T')[0], // 날짜를 YYYY-MM-DD 형식으로 저장
        isMine: true, // 내가 보낸 메시지인지 여부
      };
      
      // 메시지 서버로 전송
      socket.emit('sendMessage', newMessage);

      // 전송 후 UI에 바로 반영
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage(''); // 입력 필드 초기화
    }
  };

  let lastDate = null; // 이전 메시지의 날짜를 저장

  return (
    <div>
      <Header title="TripMate" />
      <div className="chat-container">
        {/* 초대 메시지 */}
        <div className="invite-message">
          <p>윤재형님, 장성원님, 정진교님, 최윤서님이 초대되었습니다.</p>
        </div>

        {/* 메시지 목록 */}
        <div className="message-list">
          {chatMessages.map((msg, index) => {
            const messageDate = formatDate(msg.date);
            const showDate = lastDate !== messageDate; // 날짜가 바뀔 때만 새로운 날짜 표시

            lastDate = messageDate; // 현재 메시지의 날짜를 저장

            return (
              <div key={index}>
                {showDate && <p className="chat-date">{messageDate}</p>} {/* 날짜가 바뀔 때마다 표시 */}
                <div className={`message-item ${msg.isMine ? 'my-message' : 'received-message'}`}>
                  {!msg.isMine && <p className="message-sender">{msg.sender}</p>}
                  <p className="message-text">{msg.text}</p>
                  <p className="message-time">{msg.time}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 메시지 입력 및 전송 */}
        <div className="message-input-container">
          <img 
            src={calendar} 
            alt="plan_icon" 
            className="calendar-icon"
            onClick={() => navigate('/plan')} /* 이미지 클릭 시 /plan으로 이동 */
            style={{ cursor: 'pointer' }} /* 이미지에 마우스 커서를 포인터로 변경 */
          />  
          <Form
            className="message-input"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="내용 입력"
          />
          <Button 
            onClick={sendMessage} 
            text="전송" className="send-button" 
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
