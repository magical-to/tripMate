import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Components/Button';
import Header from '../Components/Header';
import Form from '../Components/Form';
import './GoTogether.css'

const GoTogether = () => {
    const [friendId, setFriendId] = useState('');
    const navigate = useNavigate(); 

    return (
        <div>
            <Header />
            <div className='gotogether-container'>
            <h2>친구의 아이디를 입력해 주세요!</h2>
            <Form
                id="friend-id" 
                // label="친구아이디" 
                value={friendId} 
                onChange={(e) => setFriendId(e.target.value)}
                placeholder="친구 아이디" 
                className="friendid-form" 
            />
            <Button 
                onClick={() => navigate('#')} 
                text="초대" 
                className="invite-button" 
            />
            </div>
        </div>
    )
};

export default GoTogether;
