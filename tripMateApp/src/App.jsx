import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import Home from './Pages/Home';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import Go from './Pages/Go';
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
        <Route path="/plan" element={<Plan />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
