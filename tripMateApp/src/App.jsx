import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import Home from './Pages/Home';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import Go from './Pages/Go';
import Chat from './Components/Chat';
import Mytrip from './Pages/Mytrip';
import Plan from './Pages/Plan';
import Calculate from './Pages/Calculate';
import Needs from './Components/Needs';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/go" element={<Go />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/mytrip" element={<Mytrip />} />
        <Route path="/plan" element={<Plan />} />
        <Route path="/calculate" element={<Calculate />} />
        <Route path="/needs" element={<Needs />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
