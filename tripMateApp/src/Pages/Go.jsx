import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../Components/Modal';
import Header from '../Components/Header';
import Button from '../Components/Button';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Go.css';
import { validateFriendId } from '../Services/authService';
import { createTrip, inviteFriend } from '../Services/tripService';

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
    const [validatedFriends, setValidatedFriends] = useState([]);
    const [tripId, setTripId] = useState(null);
    const [error, setError] = useState('');

    const handleOpenModal = (solo) => {
        setIsModalOpen(true);
        setIsSolo(solo);
        setStep(1);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleNextStep = async () => {
        try {
            /* 여행 생성 */
            // 1단계
            if (step === 1) {
                if (!title) {
                    alert('여행 제목을 입력하세요');
                    return;
                }
                setStep(step + 1);
            }

            // 2단계
            if (step === 2) {
                if (!selectedRange[0] || !selectedRange[1]) {
                    alert('여행 날짜를 선택하세요');
                    return;
                }
                setStep(step + 1);
            }

            // 3단계
            if (step === 3) {
                const tripResponse = await createTrip(title, selectedRange, startTime, endTime);
                setTripId(tripResponse.data.trip_id);
                if (!startTime || !endTime) {
                    alert('여행 시작 시간과 종료 시간을 모두 입력하세요');
                    return;
                }

                if (isSolo) {
                    setStep(5);
                    setTimeout(() => {
                        navigate(`/plan?tripId=${tripResponse.data.trip_id}&title=${title}`);
                    }, 2000);
                    return;
                }

                setStep(step + 1);
            } else if (step === 4 && !isSolo) {
                await inviteFriend(validatedFriends, tripId);
                setStep(step + 1);
            } else {
                setStep(step + 1);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handlePreviousStep = () => step > 1 && setStep(step - 1);

    const handleAddFriend = async () => {
        setError('');
        try {
            const data = await validateFriendId(friendId);
            setValidatedFriends([...validatedFriends, friendId]);
            setFriendId('');
        } catch (error) {
            alert('존재하지 않는 ID입니다.');
            setError(error.message);
        }
    };

    const handleRemoveFriend = (friend) => {
        setValidatedFriends((prevFriends) => prevFriends.filter(f => f !== friend));
        if (friend === friendId) {
            setFriendId('');
        }
    };

    useEffect(() => {
        if (step === 5) {
            const timer = setTimeout(() => {
                navigate(`/plan?tripId=${tripId}&title=${title}`);
            }, 2000);
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
                                    <button className="back-button" onClick={handlePreviousStep}></button>
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
                                    <button className="back-button" onClick={handlePreviousStep}></button>
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
                                <button className="next-button" onClick={handleNextStep}>
                                    다음
                                </button>
                            </>
                        )}
    
                        {step === 5 && (
                            <>
                                <h2>모든 설정이 완료되었습니다!</h2>
                                <p>잠시만 기다려 주세요...</p>
                                <div className="modal-buttons">
                                    <button className="back-button" onClick={handlePreviousStep}></button>
                                </div>
                            </>
                        )}
                    </Modal>
                )}
            </div>
        </div>
    );
}

