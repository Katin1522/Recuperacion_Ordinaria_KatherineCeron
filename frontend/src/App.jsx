// src/App.jsx
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Bienvenida from './pages/Bienvenida';
import PaginaPrincipal from './pages/PaginaPrincipal';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to="/bienvenida" replace />} />
        
        <Route path='/bienvenida' element={<Bienvenida />} />
        <Route path='/dashboard' element={<PaginaPrincipal />} />
        
        <Route path='*' element={<Navigate to="/bienvenida" replace />} />
      </Routes>
    </Router>
  );
}

export default App;