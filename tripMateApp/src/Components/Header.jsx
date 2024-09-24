import React from 'react';
import logo from '../assets/app_logo.png'
import { useNavigate } from 'react-router-dom';
import './Header.css';
import Button from './Button';

const Header = ({ showButton = true }) => {
    const navigate = useNavigate(); 

    return (
        <header className="header">
            <div className="header-left">
                <img src={logo} alt="TripMate Logo" className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}/>
                <h1>TripMate</h1>
            </div>
            <div className="header-right">
                <img 
                    src="https://img.icons8.com/material-outlined/24/000000/user.png" 
                    alt="User Icon" 
                    className="user-icon" 
                />
                {showButton && (
                    <Button 
                        text="로그인" 
                        onClick={() => navigate('/login')}
                        className="login-button"
                    />
                )}
            </div>
        </header>
    );
};

export default Header;
