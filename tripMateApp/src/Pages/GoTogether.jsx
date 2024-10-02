import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Components/Button';
import Header from '../Components/Header';
import Form from '../Components/Form';
import './GoTogether.css'

const GoTogether = () => {
    const [friendId, setFriendId] = useState('');
    const [invitedFriends, setInvitedFriends] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate(); 

    // 초대 버튼 클릭 시 친구 목록에 추가하는 함수
    // 서버에 친구 아이디를 보내고 유효성 체크하는 함수
    const inviteFriend = async () => {
        if (!friendId) return; // 친구 아이디가 빈 경우 바로 리턴

        try {
            const response = await fetch("", {  
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ friendId }),
            });

            if (response.ok) {
                // 서버에서 200 응답을 받은 경우
                const result = await response.json(); // 서버 응답 데이터를 JSON으로 파싱 (필요한 경우)
                setInvitedFriends([...invitedFriends, friendId]); // 친구 목록에 추가
                setFriendId(''); // 입력 필드 초기화
                setErrorMessage(''); // 오류 메시지 초기화
            } else {
                // 서버 응답이 유효하지 않으면 경고 메시지 설정
                setErrorMessage('존재하지 않는 친구 아이디입니다.');
            }
        } catch (error) {
            console.error('Error inviting friend:', error);
            setErrorMessage('서버와의 연결 중 문제가 발생했습니다.'); // 네트워크 오류 처리
        }
    };


    return (
        <div>
            <Header />
            <div className='gotogether-container'>
                <h2>친구를 초대해 보세요!</h2>
                <div className="friend-invite-container">
                    <Form
                        id="friend-id" 
                        value={friendId} 
                        onChange={(e) => setFriendId(e.target.value)}
                        placeholder="친구 아이디" 
                        className="friendid-form" 
                    />
                    <Button 
                        onClick={inviteFriend}  
                        text="등록" 
                        className="invite-button" 
                    />
                </div>
                
                {/* 초대한 친구 목록 출력 */}
                <div className="invited-friends-list">
                    <h2>초대한 친구 목록 확인</h2>
                    <ul>
                        {invitedFriends.map((friend, index) => (
                            <p key={index}>{friend}</p> // 친구 아이디 출력
                        ))}
                    </ul>
                </div>
                <Button 
                    onClick={() => navigate('/chat')}  // 채팅방 이동 버튼 클릭시 채팅방으로 이동
                    text="초대" 
                    className="go-chat-button" 
                />
            </div>
        </div>
    )
};

export default GoTogether;
