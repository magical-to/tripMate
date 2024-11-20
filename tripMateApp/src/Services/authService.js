const API_URL_LOGIN = 'https://www.daebak.store/auth/login';
const API_URL_SIGNUP = 'https://www.daebak.store/member';
const API_URL_USER_SESSION = 'https://www.daebak.store/participants/searchparticipant?searchedname=';
const API_URL_LOGIN_CHECK = 'https://www.daebak.store/auth/logincheck';

// 로그인 함수
export const login = async (userid, password) => {
  try {
    const response = await fetch(API_URL_LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // 전송할 데이터를 Json 문자열로 변환
      body: JSON.stringify({ userid, password }),
    });

    // 응답이 성공적이지 않을 때 (catch문으로 이동)
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    // 응답이 성공적일 때
    const data = await response.json();
    
    // access_token 저장
    const access_token = data.access_token;
    localStorage.setItem('access_token', access_token);

  } 

  catch (error) {
    throw new Error("로그인 실패");
  }
};

// 회원가입 함수
export const signup = async (userid, password, useremail) => {
  const response = await fetch(API_URL_SIGNUP, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userid: userid, password: password, useremail: useremail }),
  });

  const data = response;

  // 서버에서 반환된 상태 코드에 따른 처리
  if (data.status === 201) {
    console.log("회원가입 성공");
    return { success: true, message: data.message }; // 성공적인 응답
  } else if (data.status === 409) {
    console.log("이미 존재하는 userid입니다!");
    return { success: false, message: "이미 존재하는 userid입니다!" }; // 중복된 ID
  } else if (data.status === 500) {
    console.log("회원가입에 실패하였습니다!");
    return { success: false, message: "회원가입에 실패하였습니다!" }; // 서버 오류
  } else {
    // 예상치 못한 상태 코드 처리
    console.log("알 수 없는 오류:", data);
    return { success: false, message: "알 수 없는 오류가 발생했습니다." };
  }
};

// 사용자 유효성 검사 함수
export const validateFriendId = async (freindId) => {
  try {
    const response = await fetch(API_URL_USER_SESSION+`${freindId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || '존재하지 않는 아이디입니다.');
    }
    return await response.json(); // 유효한 경우 데이터 반환

  } catch (error) {
    throw new Error(error.message || '서버에 문제가 발생했습니다.');
  }
};

// 로그인 체크 함수
export const loginCheck = async (access_token) => {
  const response = await fetch(API_URL_LOGIN_CHECK, {
    method: 'GET',
    headers: {
      'Authorization': `${access_token}`,  
    },
  });

  const data = response;
  console.log("로그인체크 응답: ", data);

  if (data.status == 409) {
    alert('사용자 세션이 만료되었습니다. 다시 로그인을 진행해주세요!');
    // 로컬스토리지에서 쿠키값 삭제하기
    localStorage.removeItem('access_token');
    return { success: false }
  }
  return await response.json();
};
