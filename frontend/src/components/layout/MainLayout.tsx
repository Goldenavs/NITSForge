// src/components/layout/MainLayout.tsx
import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  HelpCircle, 
  BookOpen, 
  Calendar, 
  Trophy, 
  History as HistoryIcon, 
  Bookmark, 
  User, 
  Settings as SettingsIcon,
  Menu,
  X
} from 'lucide-react';

export default function MainLayout() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Define navigation configuration for unified maintenance
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Quiz Hub', path: '/quiz', icon: HelpCircle },
    { name: 'Topics', path: '/topics', icon: BookOpen },
    { name: 'Daily Challenge', path: '/daily', icon: Calendar },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'History', path: '/history', icon: HistoryIcon },
    { name: 'Bookmarks', path: '/bookmarks', icon: Bookmark },
  ];

  const footerNavItems = [
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  // Helper function to dynamically check active route styling
  const getLinkClass = (path: string) => {
    const isActive = location.pathname === path || location.pathname.startsWith(`${path}/`);
    return `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
      isActive 
        ? 'bg-orange-50 text-orange-600' 
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }`;
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans antialiased text-slate-900">
      
      {/* 1. DESKTOP SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200/80 hidden md:flex flex-col z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white font-bold text-lg shadow-sm shadow-orange-500/20">
              F
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">
              NITSForge
            </span>
          </Link>
        </div>
        
        {/* Main Links */}
        <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path} className={getLinkClass(item.path)}>
                <Icon className="w-5 h-5 stroke-[2]" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Settings/Profile */}
        <div className="p-4 border-t border-slate-100 flex flex-col gap-1 bg-slate-50/50">
          {footerNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path} className={getLinkClass(item.path)}>
                <Icon className="w-5 h-5 stroke-[2]" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </aside>

      {/* 2. MOBILE DRAWER OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* MOBILE DRAWER MENU */}
      <aside className={`fixed top-0 bottom-0 left-0 w-72 bg-white z-50 transform transition-transform duration-300 ease-out md:hidden flex flex-col border-r border-slate-200 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
          <span className="text-xl font-bold text-slate-900 tracking-tight">Navigation</span>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto" onClick={() => setIsMobileMenuOpen(false)}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path} className={getLinkClass(item.path)}>
                <Icon className="w-5 h-5 stroke-[2]" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          <div className="my-2 border-t border-slate-100" />
          {footerNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path} className={getLinkClass(item.path)}>
                <Icon className="w-5 h-5 stroke-[2]" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* 3. APP VIEWPANEL CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header Topbar */}
        <header className="md:hidden h-16 bg-white border-b border-slate-200/80 px-4 flex justify-between items-center z-30 shrink-0">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="text-lg font-bold text-slate-900 tracking-tight">NITSForge</span>
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
            <User className="w-5 h-5 text-slate-500" />
          </div>
        </header>

        {/* Dynamic Route View Injected Here */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50">
          <Outlet />
        </main>

        {/* Mobile Bottom Quick-Nav Bar */}
        <nav className="md:hidden h-16 bg-white border-t border-slate-200 px-2 flex justify-around items-center shrink-0 z-30">
          {navItems.slice(0, 3).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 text-xs font-medium rounded-lg transition-colors ${
                  isActive ? 'text-orange-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon className="w-5 h-5 stroke-[2]" />
                <span>{item.name.split(' ')[0]}</span>
              </Link>
            );
          })}
          <Link 
            key="/profile" 
            to="/profile" 
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 text-xs font-medium rounded-lg transition-colors ${
              location.pathname.startsWith('/profile') ? 'text-orange-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <User className="w-5 h-5 stroke-[2]" />
            <span>Profile</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}