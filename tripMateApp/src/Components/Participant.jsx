import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { getParticipant, expelParticipant, inviteParticipant } from '../Services/tripService';
import Button from './Button';
import "./Participant.css";

const Participant = ({ tripId }) => {
    const [isParticipantOpen, setIsParticipantOpen] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newUserId, setNewUserId] = useState(''); // 새로운 참여자 ID 상태 추가

    const handleIconClick = () => {
        setIsParticipantOpen(true);
    };

    const handleCloseClick = () => {
        setIsParticipantOpen(false); 
    };

    // 참여자 목록 함수
    useEffect(() => {
        const fetchParticipants = async () => {
            setLoading(true); // 로딩 상태 시작
            try {
                const data = await getParticipant(tripId);
                console.log("data: ", data);
                
                // user_id만 추출하여 participants에 저장
                const userIds = data.map(participant => participant.userid);
                console.log("user_id: ", userIds);
                setParticipants(userIds);
            } catch (error) {
                console.error("참여자 목록을 가져오는 중 오류 발생:", error);
            } finally {
                setLoading(false); // 로딩 상태 끝
            }
        };

        if (isParticipantOpen) {
            fetchParticipants();
        }
    }, [isParticipantOpen, tripId]);

    // 참여자 내보내기 함수
    const handleExpel = async (userId) => {
        try {
            await expelParticipant(tripId, userId); // 참여자 강퇴 요청
            setParticipants(prev => prev.filter(id => id !== userId)); // 상태 업데이트
            console.log(`${userId}가 강퇴되었습니다.`);
        } catch (error) {
            alert(error.message); // 커스텀 에러 메시지 표시
            console.error("강퇴 실패:", error.message);
        }
    };

    // 참여자 초대 함수
    const handleInvite = async () => {
        if (!newUserId) {
            alert('초대할 참여자 ID를 입력하세요.'); // 입력 확인
            return;
        }
        try {
            await inviteParticipant(tripId, [newUserId]); // 참여자 초대 요청
            console.log(`${newUserId}가 초대되었습니다.`);
            setParticipants(prev => [...prev, newUserId]); // 초대된 참여자를 목록에 추가
            setNewUserId(''); // 입력 필드 초기화
        } catch (error) {
            alert(error.message); // 에러 메시지 표시
            console.error("초대 실패:", error.message);
        }
    };

    return (
        <Draggable>
            {isParticipantOpen ? (
                <div className='participant-container'>
                    <div className='participant-header'>
                        <h3 className='participant-list-text'>참여자</h3>
                        <Button 
                            text="x"
                            onClick={handleCloseClick}
                            customClass='participant-close-button'
                        />
                    </div>
                    <ul>
                        {participants.map((userId, index) => ( 
                            <li key={userId || index} className='participant-list'> 
                                {userId}
                                <Button 
                                    text="삭제"
                                    onClick={() => handleExpel(userId)}
                                    customClass='participant-delete-button'
                                />
                            </li>
                        ))}
                    </ul>
                    <div className='add-participant-footer'>
                        <input
                            type="text"
                            value={newUserId} // 초대할 참여자 ID 상태 연결
                            onChange={(e) => setNewUserId(e.target.value)} 
                            placeholder="참여자 ID 추가"
                            className='add-participant-form'
                        />
                        <Button 
                            text="+"
                            onClick={handleInvite} // 초대 요청
                            customClass='participant-add-button'
                        />
                    </div>
                </div>
            ) : (
                <div className='participants-icon' onClick={handleIconClick}>
                    참여자
                </div>
            )}
        </Draggable>
    );
};

export default Participant;
