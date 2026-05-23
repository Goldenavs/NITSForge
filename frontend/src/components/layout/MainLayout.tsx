// src/components/layout/MainLayout.tsx
import { Outlet, Link } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      {/* Desktop Sidebar Placeholder */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-orange-500">NITSForge</h2>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <Link to="/dashboard" className="p-2 hover:bg-slate-100 rounded">Dashboard</Link>
          <Link to="/quiz" className="p-2 hover:bg-slate-100 rounded">Quiz Hub</Link>
          <Link to="/topics" className="p-2 hover:bg-slate-100 rounded">Topics</Link>
          <Link to="/daily" className="p-2 hover:bg-slate-100 rounded">Daily Challenge</Link>
          <Link to="/leaderboard" className="p-2 hover:bg-slate-100 rounded">Leaderboard</Link>
          <Link to="/history" className="p-2 hover:bg-slate-100 rounded">History</Link>
          <Link to="/planner" className="p-2 hover:bg-slate-100 rounded">Planner</Link>
          <Link to="/bookmarks" className="p-2 hover:bg-slate-100 rounded">Bookmarks</Link>
        </nav>
        <div className="p-4 border-t border-slate-200">
          <Link to="/profile" className="p-2 hover:bg-slate-100 rounded block">Profile</Link>
          <Link to="/settings" className="p-2 hover:bg-slate-100 rounded block">Settings</Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Topbar */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-orange-500">NITSForge</h2>
          <button className="p-2">☰</button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet /> {/* This is where the specific page components will render */}
        </main>

        {/* Mobile Bottom Nav Placeholder */}
        <nav className="md:hidden bg-white border-t border-slate-200 p-4 flex justify-around">
           <Link to="/dashboard" className="text-sm">Home</Link>
           <Link to="/quiz" className="text-sm">Quiz</Link>
           <Link to="/leaderboard" className="text-sm">Ranks</Link>
           <Link to="/profile" className="text-sm">Profile</Link>
        </nav>
      </div>
    </div>
  );
}