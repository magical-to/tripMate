import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../Components/Modal';
import Header from '../Components/Header';
import Calendar from 'react-calendar';
import Button from '../Components/Button';
import 'react-calendar/dist/Calendar.css';
import './Go.css';
import { validateFriendId } from '../Services/authService'; // API 함수 가져오기
import { createTrip, inviteFriend } from '../Services/tripService'; // API 함수 가져오기

export default function Go() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [isSolo, setIsSolo] = useState(false);
    const [title, setTitle] = useState('');
    const [selectedRange, setSelectedRange] = useState([null, null]);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [friendId, setFriendId] = useState('');
    const [validatedFriends, setValidatedFriends] = useState([]); // 검증된 친구 아이디 저장
    const [tripId, setTripId] = useState(null); // tripId 상태 변수 추가
    const [error, setError] = useState('');

    // 친구를 제거하는 함수
    const handleRemoveFriend = (friend) => {
        // validatedFriends에서 해당 친구를 삭제
        setValidatedFriends((prevFriends) => prevFriends.filter(f => f !== friend));
        
        // 만약 삭제한 친구가 friendId와 일치하면, friendId 상태를 초기화
        if (friend === friendId) {
            setFriendId('');
        }
    };

    const handleOpenModal = (solo) => {
        setIsModalOpen(true);
        setIsSolo(solo);
        setStep(1);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleNextStep = async () => {
        /* 여행 생성 */
        // 1단계
        if (!isSolo && step == 1) {
            if (!title) {
                alert('여행 제목을 입력하세요');
                return
            }
            setStep(step + 1);
        }

        // 2단계
        if (!isSolo && step == 2) {
            if (!selectedRange[0] || !selectedRange[1]) {
                alert('여행 날짜를 선택하세요');
                return 
            }
            setStep(step + 1);
        }

        // 3단계
        if (!isSolo && step === 3) {
            console.log("3단계");
            if (!startTime || !endTime) {
                alert('여행 시작 시간과 종료 시간을 모두 입력하세요');
                return 
            }

            try {
                const tripResponse = await createTrip(title, selectedRange, startTime, endTime);
                console.log(tripResponse.data);
                setTripId(tripResponse.data.trip_id); // tripId 상태에 저장
                console.log('여행 생성 성공:', tripResponse.trip_id);
                setStep(step + 1);
            } 
            catch (error) {
                setError(error.message); // 에러 처리
            }
        } 

        // 친구 초대 
        else if (!isSolo && step === 4) {
            if (validatedFriends.length === 0) {
                alert('친구를 초대해주세요');
                return 
            }

            console.log("4단계");
            try {
                await inviteFriend(validatedFriends, tripId); // tripId와 함께 친구 초대
                setStep(step + 1);
            } 
            catch (error) {
                setError(error.message); // 에러 처리
            }
        } 
    };

    const handlePreviousStep = () => step > 1 && setStep(step - 1);

    const handleAddFriend = async () => {
        setError('');
        try {
            const data = await validateFriendId(friendId); // 친구 아이디 검증
            setValidatedFriends([...validatedFriends, friendId]); // 검증된 친구 아이디 추가
            setFriendId(''); // 입력 필드 초기화
        } catch (error) {
            alert('존재하지 않는 ID입니다.'); // 경고창으로 메시지 표시
            setError(error.message); // 에러 처리 (필요시)
        }
    };

    useEffect(() => {
        if (step === 5) {
            const timer = setTimeout(() => {
                navigate(`/plan?tripId=${tripId}&title=${encodeURIComponent(title)}`);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [step]);

    return (
        <div className="go-container">
            <Header />

            <div className="content">
                <div className="button-container">
                    <button onClick={() => handleOpenModal(true)}>혼자 떠나요!</button>
                    <button onClick={() => handleOpenModal(false)}>같이 떠나요!</button>
                </div>

                {isModalOpen && (
                    <Modal
                        customClass="step-modal"
                        onClose={handleCloseModal}
                        onBack={handlePreviousStep}
                        onNext={handleNextStep}
                    >
                        {step === 1 && (
                            <>
                                <h2>STEP 1: 여행 제목을 입력하세요</h2>
                                <input
                                    type="text"
                                    placeholder="여행 제목을 입력하세요"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                <div className="modal-buttons">
                                    <button className="next-button" onClick={handleNextStep}>
                                        다음
                                    </button>
                                </div>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <h2>STEP 2: 여행 일정을 선택하세요</h2>
                                <Calendar
                                    className="calender-custom"
                                    selectRange={true}
                                    onChange={setSelectedRange}
                                    value={selectedRange}
                                />
                                <div className="modal-buttons">
                                    <button className="back-button" onClick={handlePreviousStep}>
                                    </button>
                                    <button className="next-button" onClick={handleNextStep}>
                                        다음
                                    </button>
                                </div>
                            </>
                        )}

                        {step === 3 && (
                            <div className="time-container">
                                <h2>STEP 3: 여행 시간을 설정하세요</h2>
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                />
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                />
                                <div className="modal-buttons">
                                    <button className="back-button" onClick={handlePreviousStep}>
                                    </button>
                                    <button className="next-button" onClick={handleNextStep}>
                                        다음
                                    </button>
                                </div>
                            </div>
                        )}

                        {!isSolo && step === 4 && (
                            <>
                                <h2>STEP 4: 친구를 초대하세요</h2>
                                <div className='friend-invite-form'>
                                    <input
                                        className='friend-invite-input'
                                        type="text"
                                        placeholder="친구 아이디 입력"
                                        value={friendId}
                                        onChange={(e) => setFriendId(e.target.value)}
                                    />
                                
                                    <Button 
                                        onClick={handleAddFriend}
                                        text="초대"
                                        customClass='friend-invite-button'
                                    />
                                </div>
                                
                                <div className='friends-list'>
                                    {validatedFriends.map((friend, index) => (
                                        <div key={index} className='one-friend-list'>
                                            <span className='friend-id'>
                                                {friend}
                                            </span>
                                            <Button 
                                                text="x"
                                                onClick={() => handleRemoveFriend(friend)} // x 버튼 클릭 시 해당 친구 제거
                                                customClass='friend-remove-button'
                                            />
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="modal-buttons">
                                    <button className="back-button" onClick={handlePreviousStep}>
                                    </button>
                                    <button className="next-button" onClick={handleNextStep}>
                                        다음
                                    </button>
                                </div>
                            </>
                        )}

                        {step === 5 && (
                            <>
                                <h2>모든 설정이 완료되었습니다!</h2>
                                <p>잠시만 기다려 주세요...</p>
                                <div className="modal-buttons">
                                    <button className="back-button" onClick={handlePreviousStep}>
                                    </button>
                                </div>
                            </>
                        )}
                    </Modal>
                )}
            </div>
        </div>
    );
}