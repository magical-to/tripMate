import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import Home from './Pages/Home';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import Plan from './Pages/Plan';
import GoTogether from './Pages/GoTogether';
import GoAlone from './Pages/GoAlone';
// import Ham from './Pages/ham';
import Chat from './Pages/Chat';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/plan" element={<Plan />} />
        <Route path="/gotogether" element={<GoTogether />} />
        <Route path="/goalone" element={<GoAlone />} />
        {/* <Route path="/ham" element={<Ham />} /> */}
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
