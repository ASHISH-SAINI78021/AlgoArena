import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Home from './pages/Home/Home';
import CodingRealtime from './pages/CodingRealtime/CodingRealtime';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import SavedCodes from './pages/SavedCodes/SavedCodes';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/realtime-coding" element={
            <ProtectedRoute>
              <CodingRealtime />
            </ProtectedRoute>
          } />
          <Route path="/saved-codes" element={
            <ProtectedRoute>
              <SavedCodes />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App
