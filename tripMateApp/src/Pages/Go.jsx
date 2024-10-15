import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../Components/Modal';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Go.css';
import { validateFriendId } from '../Services/authService'; // API 함수 가져오기

export default function Go() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [isSolo, setIsSolo] = useState(false); // 혼자 떠나는 경우를 위한 상태
    const [title, setTitle] = useState('');
    const [selectedRange, setSelectedRange] = useState([null, null]);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [friendId, setFriendId] = useState('');
    const [friendsList, setFriendsList] = useState(['jjang', 'yoon', 'choi']);
    const [error, setError] = useState(''); // 에러 메시지를 위한 상태

    const handleOpenModal = (solo) => {
        setIsModalOpen(true);
        setIsSolo(solo); // 혼자 떠나는지 여부 설정
        setStep(1); // 스텝을 초기화
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleNextStep = () => {
        // 혼자 떠나는 경우 Step 3에서 바로 Step 5로 이동
        if (isSolo && step === 3) {
          setStep(5); // Step 4를 건너뜀
        } else {
        setStep(step + 1);
        }
    };

    const handlePreviousStep = () => step > 1 && setStep(step - 1);

    // 마지막 스텝일 때 5초 후에 모달 닫기
    useEffect(() => {
        if (step === 5) {
        const timer = setTimeout(() => {
            navigate('/plan');
        }, 5000); // 5초 후 모달 닫기

        return () => clearTimeout(timer); // 컴포넌트가 언마운트될 때 타이머 정리
        }
    }, [step]);

    // 친구 아이디 유효성 검사
    const handleAddFriend = async () => {
        setError(''); // 에러 초기화
        try {
        const data = await validateFriendId(friendId); // authService로부터 API 함수 호출
        // 친구 아이디가 유효하면 다음 단계로 넘어감
        setFriendsList([...friendsList, friendId]);
        setFriendId('');
        setStep(step + 1); // 다음 단계로 이동
        } catch (error) {
        // 서버에서 유효하지 않은 경우 또는 에러가 발생한 경우
        setError(error.message);
        }
    };

    return (
        <div>
        <button onClick={() => handleOpenModal(true)}>혼자 떠나요!</button> {/* 혼자 떠나요! */}
        <button onClick={() => handleOpenModal(false)}>같이 떠나요!</button> {/* 같이 떠나요! */}
        
        {isModalOpen && (
            <Modal onClose={handleCloseModal} onBack={handlePreviousStep} onNext={handleNextStep}>
            {/* STEP 1: 여행 제목 입력 */}
            {step === 1 && (
                <>
                <h2>STEP 1: 여행 제목을 입력하세요</h2>
                <input
                    type="text"
                    placeholder="여행 제목을 입력하세요"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <button onClick={handleNextStep}>다음</button>
                </>
            )}

            {/* STEP 2: 여행 일정 선택 */}
            {step === 2 && (
                <>
                <h2>STEP 2: 여행 일정을 선택하세요</h2>
                <Calendar
                    selectRange={true}
                    onChange={setSelectedRange}
                    value={selectedRange}
                />
                <button onClick={handleNextStep}>다음</button>
                </>
            )}

            {/* STEP 3: 여행 시간 설정 */}
            {step === 3 && (
                <>
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
                <button onClick={handleNextStep}>다음</button>
                </>
            )}

            {/* STEP 4: 친구 초대 (같이 떠날 때만 표시) */}
            {!isSolo && step === 4 && ( // isSolo 상태가 false일 때만 표시
                <>
                <h2>STEP 4: 친구를 초대하세요</h2>
                <input
                    type="text"
                    placeholder="친구 아이디 입력"
                    value={friendId}
                    onChange={(e) => setFriendId(e.target.value)}
                />
                <button onClick={handleAddFriend}>친구 추가</button>
                <ul>
                    {friendsList.map((friend, index) => (
                    <li key={index}>{friend}</li>
                    ))}
                </ul>
                </>
            )}

            {/* STEP 5: 완료 화면 */}
            {step === 5 && (
                <>
                <h2>모든 설정이 완료되었습니다!</h2>
                <p>잠시만 기다려 주세요...</p>
                </>
            )}
            </Modal>
        )}
        </div>
    );
}
