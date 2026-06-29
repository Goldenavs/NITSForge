// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 1. Import Auth Context & Protections
import { AuthProvider } from './store/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';

// 2. Import Public Pages
import LandingPage from './pages/LandingPage';
import About from './pages/About';

// 3. Import Authenticated Pages (Dashboard & Core Features)
import Dashboard from './pages/Dashboard';
import QuizHub from './pages/QuizHub';
import QuizSession from './pages/QuizSession';
import QuizResults from './pages/QuizResults';
import Topics from './pages/Topics';
import TopicDetail from './pages/TopicDetail';
import History from './pages/History';
import Bookmarks from './pages/Bookmarks';
import BookmarkCollection from './pages/BookmarkCollection';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ============================== */}
          {/* PUBLIC ROUTES (No Sidebar)     */}
          {/* ============================== */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LandingPage />} />
          <Route path="/signup" element={<LandingPage />} />
          <Route path="/about" element={<About />} />

          {/* ============================== */}
          {/* PROTECTED ROUTES (With Sidebar)*/}
          {/* ============================== */}
          {/* The ProtectedRoute acts as the gatekeeper */}
          <Route element={<ProtectedRoute />}>
            {/* The MainLayout wraps the UI for all allowed routes */}
            <Route element={<MainLayout />}>
              
              {/* Main Hub */}
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Quizzes */}
              <Route path="/quiz" element={<QuizHub />} />
              <Route path="/quiz/session" element={<QuizSession />} />
              <Route path="/quiz/results/:sessionId" element={<QuizResults />} />
              {/* Learning Hub */}
              <Route path="/learning" element={<Topics />} />
              <Route path="/learning/:category" element={<TopicDetail />} />
              
              {/* User Data */}
              <Route path="/history" element={<History />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
              <Route path="/bookmarks/:collectionId" element={<BookmarkCollection />} />
              
              {/* Social & Planning */}
              <Route path="/leaderboard" element={<Leaderboard />} />
              
              {/* Account */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/:userId" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />

            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;