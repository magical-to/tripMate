import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import Home from './Pages/Home';
import Login from './Pages/Login';
import SignUp from './Pages/Signup';
import Go from './Pages/Go';
import Mytrip from './Pages/Mytrip';
import Plan from './Pages/Plan';


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/go" element={<Go />} />
        <Route path="/mytrip" element={<Mytrip />} />
        <Route path="/plan" element={<Plan />} />
        <Route path="/chat2" element={<Chat2 />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
