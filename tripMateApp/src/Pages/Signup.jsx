import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../Services/authService'; 
import Button from '../Components/Button';
import Form from '../Components/Form';
import Header from '../Components/Header';
import './SignUp.css'; 

const SignUp = () => {
  const [userid, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [useremail, setUserEmail] = useState('');  
  const navigate = useNavigate();

  // API 관련 함수
  const handleSignUp = async (event) => {
    event.preventDefault(); // 폼 제출 시 페이지 리프레시 방지

    if (password !== confirmPassword) {
      console.error('비밀번호가 일치하지 않습니다!');
      return;
    }

    try {
      const data = await signup(userid, password, useremail); // authService에서 회원가입 함수 호출

      // 서버에서 반환된 데이터 출력
      console.log('회원가입 성공: ', data);

      // 회원가입 성공 후 로그인 페이지로 리다이렉트
      navigate('/login');

    } catch (error) {
      // 에러 처리
      console.error('회원가입 에러: ', error);
      // 사용자에게 오류 메시지 표시를 위한 로직 추가 가능
    }
  };

  return (
    <div>
      <Header showButton={false} /> {/* Header에서 Button 제외 */}
      <div className="signup-container">
        <h2>TripMate</h2>
        <form className="signup-form" onSubmit={handleSignUp}>
          <Form
            id="user_id"
            type="text"
            value={userid}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="아이디"
            className="signup-username"
          />
          <Form
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            className="signup-password"
          />
          <Form
            id="confirm_password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="비밀번호 확인"
            className="signup-confirm-password"
          />
          <Form
            id="user_email"
            type="email"  // 이메일 타입으로 변경
            value={useremail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="이메일"
            className="signup-email"
          />
          <Button
            onClick={handleSignUp}
            text="회원가입"
            customClass='signup-button'
          />
        </form>
      </div>
    </div>
  );
};

export default SignUp;
