import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

import MainPage from './pages/MainPage/MainPage';
import SignUpPage from './pages/SignUp/SignUpPage';

function App() {
  return (
    <Router>
      {/* Routes 안에 여러 페이지 경로 설정 */}
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </Router>
  );
}

export default App;
