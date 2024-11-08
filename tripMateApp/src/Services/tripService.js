
import axios from 'axios';
const API_URL_MAKE_TRIP = 'https://www.daebak.store/trips';
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
