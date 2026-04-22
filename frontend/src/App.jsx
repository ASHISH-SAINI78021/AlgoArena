import './App.css'
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from './pages/Home/Home';
import CodingRealtime from './pages/CodingRealtime/CodingRealtime';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import SavedCodes from './pages/SavedCodes/SavedCodes';
import GithubCallback from './pages/Auth/GithubCallback';
import DuelArena from './pages/DuelArena/DuelArena';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import SplashCursor from './reactbits/SplashCursor';
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
      <SplashCursor
        COLOR="#8b5cf6"
        SPLAT_RADIUS={0.2}
        SPLAT_FORCE={3000}
        DENSITY_DISSIPATION={4.0}
        VELOCITY_DISSIPATION={2.5}
        SIM_RESOLUTION={64}
        DYE_RESOLUTION={512}
        PRESSURE_ITERATIONS={10}
      />
      <BrowserRouter>
        <AuthProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
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
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App