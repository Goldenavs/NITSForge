// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';

// 1. Import Public Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import About from './pages/About';

// 2. Import Authenticated Pages (Dashboard & Core Features)
import Dashboard from './pages/Dashboard';
import QuizHub from './pages/QuizHub';
import QuizSession from './pages/QuizSession';
import QuizResults from './pages/QuizResults';
import QuizAI from './pages/QuizAI';
import Topics from './pages/Topics';
import TopicDetail from './pages/TopicDetail';
import DailyChallenge from './pages/DailyChallenge';
import History from './pages/History';
import Bookmarks from './pages/Bookmarks';
import BookmarkCollection from './pages/BookmarkCollection';
import Leaderboard from './pages/Leaderboard';
import Planner from './pages/Planner';
import Profile from './pages/Profile';
import Settings from './pages/Settings';



function App() {
  return (
    <Router>
      <Routes>
        {/* ============================== */}
        {/* PUBLIC ROUTES (No Sidebar)     */}
        {/* ============================== */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />

        {/* ============================== */}
        {/* PROTECTED ROUTES (With Sidebar)*/}
        {/* ============================== */}
        <Route element={<MainLayout />}>
          {/* Main Hub */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Quizzes */}
          <Route path="/quiz" element={<QuizHub />} />
          <Route path="/quiz/session" element={<QuizSession />} />
          <Route path="/quiz/results/:sessionId" element={<QuizResults />} />
          <Route path="/quiz/ai" element={<QuizAI />} />
          
          {/* Topics & Learning */}
          <Route path="/topics" element={<Topics />} />
          <Route path="/topics/:category" element={<TopicDetail />} />
          <Route path="/daily" element={<DailyChallenge />} />
          
          {/* User Data */}
          <Route path="/history" element={<History />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/bookmarks/:collectionId" element={<BookmarkCollection />} />
          
          {/* Social & Planning */}
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/planner" element={<Planner />} />
          
          {/* Account */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;