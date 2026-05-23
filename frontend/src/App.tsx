// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';

// ==========================================
// PLACEHOLDER COMPONENTS (Create separate files for these later)
// ==========================================

// Public Pages
const LandingPage = () => <div className="p-10 text-center"><h1 className="text-4xl font-bold mb-4">Forge your path to the FE.</h1><Link to="/login" className="text-blue-500 underline mr-4">Login</Link><Link to="/dashboard" className="text-blue-500 underline">Guest Mode</Link></div>;
const Login = () => <div className="p-10"><h1>Login Page</h1></div>;
const Signup = () => <div className="p-10"><h1>Signup Page</h1></div>;
const About = () => <div className="p-10"><h1>About NITSForge</h1></div>;

// Authenticated Pages (Wrapped in MainLayout)
const Dashboard = () => <div><h1 className="text-3xl font-bold">Dashboard</h1><p>Welcome back, Engineer.</p></div>;
const QuizHub = () => <div><h1 className="text-3xl font-bold">Quiz Hub</h1><p>Select your mode.</p></div>;
const QuizSession = () => <div><h1 className="text-3xl font-bold">Active Quiz</h1><p>Question 1 of 10...</p></div>;
const QuizResults = () => <div><h1 className="text-3xl font-bold">Results</h1><p>You scored 85%.</p></div>;
const QuizAI = () => <div><h1 className="text-3xl font-bold">AI Practice</h1><p>Generate custom questions.</p></div>;
const Topics = () => <div><h1 className="text-3xl font-bold">Topics</h1><p>Explore 11 FE categories.</p></div>;
const TopicDetail = () => <div><h1 className="text-3xl font-bold">Topic Detail</h1><p>Deep dive into a category.</p></div>;
const DailyChallenge = () => <div><h1 className="text-3xl font-bold">Daily Challenge</h1><p>Today's 10 questions.</p></div>;
const History = () => <div><h1 className="text-3xl font-bold">Answer History</h1><p>Your past performance.</p></div>;
const Bookmarks = () => <div><h1 className="text-3xl font-bold">Bookmarks</h1><p>Saved questions.</p></div>;
const BookmarkCollection = () => <div><h1 className="text-3xl font-bold">Collection</h1><p>Specific bookmark folder.</p></div>;
const Leaderboard = () => <div><h1 className="text-3xl font-bold">Leaderboard</h1><p>Top scholars.</p></div>;
const Planner = () => <div><h1 className="text-3xl font-bold">Study Planner</h1><p>AI-generated study schedule.</p></div>;
const Profile = () => <div><h1 className="text-3xl font-bold">Profile</h1><p>Your badges and stats.</p></div>;
const Settings = () => <div><h1 className="text-3xl font-bold">Settings</h1><p>App preferences.</p></div>;

// ==========================================
// APP ROUTER
// ==========================================

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/guest" element={<Dashboard />} />
        <Route path="/about" element={<About />} />

        {/* Protected Routes inside Layout */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          
          <Route path="/quiz" element={<QuizHub />} />
          <Route path="/quiz/session" element={<QuizSession />} />
          <Route path="/quiz/results/:sessionId" element={<QuizResults />} />
          <Route path="/quiz/ai" element={<QuizAI />} />
          
          <Route path="/topics" element={<Topics />} />
          <Route path="/topics/:category" element={<TopicDetail />} />
          
          <Route path="/daily" element={<DailyChallenge />} />
          <Route path="/history" element={<History />} />
          
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/bookmarks/:collectionId" element={<BookmarkCollection />} />
          
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/planner" element={<Planner />} />
          
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:userId" element={<Profile />} />
          
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;