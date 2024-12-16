import React from 'react';
import './global.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './pages/signUp';
import Login from './pages/login';
import HomePage from './pages/home';
import Conversation from './pages/conversation';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/" element={<HomePage />} />
        <Route path="conversation/:id" element={<Conversation />} />
      </Routes>
    </Router>
  );
}

export default App;