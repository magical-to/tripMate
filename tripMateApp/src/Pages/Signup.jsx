import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../Services/authService'; 
import Button from '../Components/Button';
import Form from '../Components/Form';
import Header from '../Components/Header';
import './Signup.css';

const SignUp = () => {
  const [userid, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [useremail, setUserEmail] = useState('');  
  const navigate = useNavigate();

  // API 관련 함수
  const handleSignUp = async (event) => {
    event.preventDefault(); // 폼 제출 기본 동작 방지
  
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다!");
      return;
    }
  
    // 회원가입 API 호출
    const result = await signup(userid, password, useremail);
  
    if (result.success) {
      alert("회원가입 완료!");
      navigate('/login'); // 로그인 페이지로 이동
    } else {
      alert(result.message); // 오류 메시지 표시
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
