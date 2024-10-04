import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Components/Button';
import Header from '../Components/Header';
import Form from '../Components/Form';
import './GoTogether.css';

const Go = () => {
    const navigate = useNavigate(); 
    const [isTogetherMode, setIsTogetherMode] = useState(false); // 상태로 UI를 변경

    // 친구 초대 관련 상태
    const [friendId, setFriendId] = useState('');
    const [invitedFriends, setInvitedFriends] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    // 친구 초대 함수
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
                const result = await response.json(); 
                setInvitedFriends([...invitedFriends, friendId]); // 친구 목록에 추가
                setFriendId(''); // 입력 필드 초기화
                setErrorMessage(''); // 오류 메시지 초기화
            } else {
                setErrorMessage('존재하지 않는 친구 아이디입니다.');
            }
        } catch (error) {
            console.error('Error inviting friend:', error);
            setErrorMessage('서버와의 연결 중 문제가 발생했습니다.'); 
        }
    };

    return (
        <div>
            <Header />
            {!isTogetherMode ? (
                // 기본 UI: '혼자 떠나요', '같이 떠나요' 버튼이 표시되는 부분
                <div className='plan-container'>
                    <div>
                        <Button
                            text="혼자 떠나요!"
                            onClick={() => navigate('/plan')}
                            className='alone-button'
                        />
                    </div>
                    <div>
                        <Button
                            text="같이 떠나요!"
                            onClick={() => setIsTogetherMode(true)} // 클릭 시 친구 초대 모드로 변경
                            className='together-button'
                        />
                    </div>
                </div>
            ) : (
                // 친구 초대 UI
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
            )}
        </div>
    );
}

export default Go;
