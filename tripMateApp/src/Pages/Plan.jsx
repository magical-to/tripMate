// 사용자의 세션이 유효한 상태에서 넘어옴
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Components/Button';
import Header from '../Components/Header';
import './Plan.css'; 


const Plan = () => {
    const navigate = useNavigate(); 

    return (
        <div>
            <Header />
            <div className='plan-container'>
                <div>
                    <Button
                        text="혼자 떠나요!"
                        onClick={() => navigate('/goalone')}
                        className='alone-button'
                    />
                </div>
                <div>
                    <Button
                        text="같이 떠나요!"
                        onClick={() => navigate('/gotogether')}
                        className='together-button'
                    />
                </div>
            </div>
        </div>
    );

}

export default Plan;
