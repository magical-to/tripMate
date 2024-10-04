import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import Home from './Pages/Home';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import Go from './Pages/Go';
import GoTogether from './Pages/GoTogether';
import GoAlone from './Pages/Plan';
import Plan from './Pages/Plan';
import Chat from './Pages/Chat';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/go" element={<Go />} />
        <Route path="/gotogether" element={<GoTogether />} />
        <Route path="/plan" element={<Plan />} />
        {/* <Route path="/ham" element={<Ham />} /> */}
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
