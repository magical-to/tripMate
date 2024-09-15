import './App.css'
import { BroswerRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';

function App() {
  return (
    <Route>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Route>
  );
};

export default App;
