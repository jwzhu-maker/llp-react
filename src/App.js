import './App.css';
import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import HomePage from './HomePage';
import SessionPage from './SessionPage';

function App() {
  return (
        <Router>
             <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/session/:sessionId" element={<SessionPage />} />
            </Routes>
        </Router>
    );
}

export default App;
