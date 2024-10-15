const API_URL_LOGIN = 'https://www.daebak.store/auth/login';
const API_URL_SIGNUP = 'https://www.daebak.store/member';
const API_URL_USER_SESSION = '';

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
    throw new Error('Login failed: ' + error.message);
  }
};

// 회원가입 함수
export const signup = async (userid, password, useremail) => {
  try {
    const response = await fetch(API_URL_SIGNUP, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userid: userid, password: password, useremail: useremail })
    });

    if (!response.ok) {
      throw new Error('서버 응답이 성공적이지 않습니다.');
    }

    const data = await response.json();
    console.log("회원가입 응답: ");
    console.log(data);

  } catch (error) {
    throw new Error('Sign-up failed: ' + error.message);
  }
};

// 사용자 유효성 검사 함수
export const validateFriendId = async (friendId) => {
  try {
    const response = await fetch(API_URL_USER_SESSION, {
      method: 'GET',
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || '존재하지 않는 아이디입니다.');
    }
    return await response.json(); // 친구 아이디가 유효하면 데이터 반환
    
  } catch (error) {
    throw new Error(error.message || '서버에 문제가 발생했습니다.');
  }
};
