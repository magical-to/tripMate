
import axios from 'axios';
const API_URL_MAKE_TRIP = 'https://www.daebak.store/trips';
const API_URL_GET_PARTICIPANTS = 'https://www.daebak.store/chat/participants';
const API_URL_DELETE_PARTICIPANTS = 'https://www.daebak.store/participants';
const API_URL_INVITE_PARTICIPANTS = 'https://www.daebak.store/participants'; 

const token = localStorage.getItem('access_token');

// 여행 생성 함수
export const createTrip = async (title, selectedRange, startTime, endTime) => {
    const startDate = selectedRange[0].toISOString().split('T')[0]; // 시작 날짜
    const endDate = selectedRange[1].toISOString().split('T')[0]; // 종료 날짜

    console.log(startDate, endDate);

    const tripData = {
        name: title,
        start_date: startDate,
        end_date: endDate,
        start_time: startTime.replace(':', ''), // HHMM 형식으로 변환
        end_time: endTime.replace(':', '') // HHMM 형식으로 변환
    };

    console.log("tripDate: " + tripData);

    try {
        console.log("토큰:");
        console.log(token);
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
    console.log("반환된 값 확인: ");
    
    console.log(tripId);

    const memberData = {
        memberIds: memberIds
    }

    console.log(memberData);

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
    console.log("token: ", token);
    try {
        const response = await axios.get(`${API_URL_GET_PARTICIPANTS}/${tripId}`, {
            headers: {
                'Authorization': `${token}` 
            }
        });
        console.log(response.data);
        return response.data; // 참여자 목록 반환
    } catch (error) {
        console.error('참여자 목록을 가져오는 중 오류 발생:', error);
        throw new Error('참여자 목록을 가져오는 데 실패했습니다: ' + error.message);
    }
};

// 참여자 내보내기 함수
export const expelParticipant = async (tripId, userId) => {
    console.log("token: ", token);
    try {
        const response = await axios.delete(`${API_URL_DELETE_PARTICIPANTS}/${tripId}/expel`, {
            params: { expelledname: userId }, // 쿼리 파라미터 설정
            headers: {
                'Authorization': `${token}` // 인증 토큰 추가
            }
        });
        console.log("삭제 반환: ", response.data);
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
        console.log("초대 반환: ", response.data);
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
