// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import io from 'socket.io-client';

import MainScreen from './MainScreen';
import PlayerScreen from './PlayerScreen';

const socket = io.connect('https://kbc9457.onrender.com');

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/player" element={<PlayerScreen socket={socket} />} />
        <Route path="/" element={<MainScreen socket={socket} />} />
      </Routes>
    </Router>
  );
}

export default App;
