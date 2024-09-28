const API_URL_LOGIN = 'https://your-backend-api/login';
const API_URL_SIGNUP = 'https://your-backend-api/signup';

// 로그인 함수
export const login = async (username, password) => {
  try {
    const response = await fetch(API_URL_LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Login failed: ' + error.message);
  }
};

// 회원가입 함수
export const signup = async (username, password, email) => {
  try {
    const response = await fetch(API_URL_SIGNUP, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, email }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Sign-up failed: ' + error.message);
  }
};