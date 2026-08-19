import './App.css'
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';

const Home = lazy(() => import('./pages/Home/Home'));
const CodingRealtime = lazy(() => import('./pages/CodingRealtime/CodingRealtime'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Signup = lazy(() => import('./pages/Auth/Signup'));
const SavedCodes = lazy(() => import('./pages/SavedCodes/SavedCodes'));
const GithubCallback = lazy(() => import('./pages/Auth/GithubCallback'));
const DuelArena = lazy(() => import('./pages/DuelArena/DuelArena'));
const Problems = lazy(() => import('./pages/Problems/Problems'));
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar/Navbar';

/* Layout wrapper — adds navbar top-padding on all pages except Home */
function Layout({ children }) {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  return (
    <>
      <Navbar />
      {/* Every page except Home gets 60px offset to clear the fixed navbar */}
      <div style={{ paddingTop: isHome ? 0 : '60px' }}>
        {children}
      </div>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Layout>
            <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#8b5cf6' }}>Loading...</div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/problems" element={<Problems />} />
                <Route path="/realtime-coding" element={<CodingRealtime />} />
                <Route path="/saved-codes" element={
                  <ProtectedRoute>
                    <SavedCodes />
                  </ProtectedRoute>
                } />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/auth/github/callback" element={<GithubCallback />} />
                <Route path="/duel" element={<DuelArena />} />
              </Routes>
            </Suspense>
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App