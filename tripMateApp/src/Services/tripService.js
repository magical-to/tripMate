
import axios from 'axios';
const API_URL_MAKE_TRIP = 'https://www.daebak.store/trips';
const API_URL_GET_PARTICIPANTS = 'https://www.daebak.store/chat/participants';
const API_URL_DELETE_PARTICIPANTS = 'https://www.daebak.store/participants';
const API_URL_INVITE_PARTICIPANTS = 'https://www.daebak.store/participants'; 
const API_URL_MY_ENTIRE_TRIPS = 'https://www.daebak.store/trips/checkmytrips'; 

const token = localStorage.getItem('access_token');
console.log("꺼낸 token: ", token);

// 여행 생성 함수
export const createTrip = async (title, selectedRange, startTime, endTime) => {
    const startDate = selectedRange[0].toISOString().split('T')[0]; // 시작 날짜
    const endDate = selectedRange[1].toISOString().split('T')[0]; // 종료 날짜

    const tripData = {
        name: title,
        start_date: startDate,
        end_date: endDate,
        start_time: startTime.replace(':', ''), // HHMM 형식으로 변환
        end_time: endTime.replace(':', '') // HHMM 형식으로 변환
    };

    try {
        const response = await axios.post(API_URL_MAKE_TRIP, tripData, {
            headers: {
                'Authorization': `${token}` // 인증 토큰을 헤더에 추가
            }
        });

        // 반환된 값을 저장

        return response.data; // API 응답 데이터 반환
    } catch (error) {
        throw new Error('여행 생성에 실패했습니다: ' + error.message); // 에러 처리
    }
};

// 친구 초대 함수
export const inviteFriend = async (memberIds, tripId) => {
    const memberData = {
        memberIds: memberIds
    }
    try {
        const response = await axios.post(`https://www.daebak.store/participants/${tripId}/invite`, memberData, {
            headers: {
                'Authorization': `${token}` // 인증 토큰을 헤더에 추가
            }
        });
        console.log("친구 초대 완료~");
        return response.data;
    }
    catch (error) {
        throw new Error('친구 초대에 실패했습니다: ' + error.message); // 에러 처리
    }
};

// 참여자 목록 함수
export const getParticipant = async (tripId) => {
    try {
        const response = await axios.get(`${API_URL_GET_PARTICIPANTS}/${tripId}`, {
            headers: {
                'Authorization': `${token}` 
            }
        });
        return response.data; // 참여자 목록 반환
    } catch (error) {
        console.error('참여자 목록을 가져오는 중 오류 발생:', error);
        throw new Error('참여자 목록을 가져오는 데 실패했습니다: ' + error.message);
    }
};

// 참여자 내보내기 함수
export const expelParticipant = async (tripId, userId) => {
    try {
        const response = await axios.delete(`${API_URL_DELETE_PARTICIPANTS}/${tripId}/expel`, {
            params: { expelledname: userId }, // 쿼리 파라미터 설정
            headers: {
                'Authorization': `${token}` // 인증 토큰 추가
            }
        });
        return response.data; // API 응답 데이터 반환
    } catch (error) {
        // 401 에러 처리
        if (error.response && error.response.status === 401) {
            throw new Error('여행 생성자는 삭제할 수 없습니다.'); // 에러 메시지
        } else {
            throw new Error('참여자 강퇴에 실패했습니다: ' + error.message); // 일반 에러 처리
        }
    }
};

// 참여자 초대하기 함수
export const inviteParticipant = async (tripId, memberIds) => {
    try {
        const response = await axios.post(`${API_URL_INVITE_PARTICIPANTS}/${tripId}/invite`, {
            memberIds: memberIds // 요청 본문에 memberIds 추가
        }, {
            headers: {
                'Authorization': `${token}` // 인증 토큰 추가
            }
        });
        return response.data; // API 응답 데이터 반환
    } catch (error) {
        if (error.response && error.response.status === 404) {
            throw new Error('존재하지 않는 아이디 입니다.'); // 에러 메시지
        }
        else {
            throw new Error('참여자 강퇴에 실패했습니다: ' + error.message); // 일반 에러 처리
        }
    }
};

// 전체 여행 조회 함수 (개인 + 단체)
export const getMyTrips = async () => {
    try {
        const response = await axios.get(API_URL_MY_ENTIRE_TRIPS, {
            headers: {
                'Authorization': `${token}` 
            }
        });
        return response.data; 
    } catch (error) {
        throw new Error('여행 목록 조회에 실패했습니다: ' + error.message); 
    }
};

// 개인 일정 조회 함수
export const getPersonalTrips = async () => {
    try {
        const response = await fetch('https://www.daebak.store/trips/checkpersonaltrips', {
            method: 'GET', // GET 요청
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`, // 토큰 추가
            },
        });

        if (!response.ok) {
            throw new Error('네트워크 응답이 비정상적입니다.');
        }

        const data = await response.json(); // JSON 형태로 응답 데이터 파싱
        return data; // 데이터를 반환
    } catch (error) {
        console.error('개인 일정을 가져오는 중 오류 발생:', error);
        throw error; // 오류를 다시 던져서 호출하는 쪽에서 처리할 수 있게 함
    }
};

// 단체 일정 조회 함수
export const getGroupTrips = async () => {
    try {
        const response = await fetch('https://www.daebak.store/trips/checkgrouptrips', {
            method: 'GET', // GET 요청
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`, // 토큰 추가
            },
        });

        if (!response.ok) {
            throw new Error('네트워크 응답이 비정상적입니다.');
        }

        const data = await response.json(); // JSON 형태로 응답 데이터 파싱
        return data; // 데이터를 반환
    } catch (error) {
        console.error('단체 일정을 가져오는 중 오류 발생:', error);
        throw error; // 오류를 다시 던져서 호출하는 쪽에서 처리할 수 있게 함
    }
};

// 여행 나가기 함수
export const leaveTrip = async (tripId) => {
    try {
        const response = await axios.delete(`https://www.daebak.store/participants/${tripId}/escape`, {
            headers: {
                Authorization: `${token}` // 인증 헤더 추가
            }
        });
        if (response.status === 200) {
            console.log("여행에서 나갔습니다.", response.data);
            return true; // 성공적으로 나갔음을 반환
        } else {
            console.error("여행 나가기 실패:", response.data);
            return false; // 실패했음을 반환
        }
    } catch (error) {
        console.error("여행 나가기 중 오류 발생:", error);
        return false; // 오류 발생 시 실패 반환
    }
};

// 여행 삭제하기 함수
export const deleteTrip = async (tripId) => {
    try {
        const response = await fetch(`https://www.daebak.store/trips/${tripId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `${token}`, 
            },
        });
        if (!response.ok) {
            throw new Error(`여행 삭제 실패: ${response.statusText}`);
        }
        alert("여행이 삭제되었습니다."); // 사용자 알림
    } catch (error) {
        console.error("여행 삭제 중 오류 발생:", error);
        alert("여행 삭제에 실패했습니다. 다시 시도해 주세요."); // 오류 알림
    }
};

// 여행 수정하기 함수
export const updateTrip = async (tripId, tripData) => {
    console.log(tripId);
    const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰 가져오기

    // 시간 형식을 HH:mm에서 HHmm으로 변환하는 함수
    const convertTimeToHHmm = (time) => {
        if (!time) return ''; // 유효성 검사
        return time.replace(':', ''); // HH:mm -> HHmm 형식으로 변환
    };

    // tripData의 start_time과 end_time 변환
    tripData.start_time = convertTimeToHHmm(tripData.start_time);
    tripData.end_time = convertTimeToHHmm(tripData.end_time);

    console.log(tripData);
    // const tripDatas = JSON.stringify(tripData)
    // console.log("서버가 수신한 tripData: ", tripDatas);

    try {
        const response = await axios.put(`https://www.daebak.store/trips/${tripId}`, tripData, {
            headers: {
                'Authorization': `${token}`
            }
        });

        return response.data;
    }
    catch (error) {
        throw new Error('여행 수정 실패' , + error.message);
    }
};
