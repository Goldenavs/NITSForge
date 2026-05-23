// src/components/layout/MainLayout.tsx
import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import InteractiveBackground from '../ui/InteractiveBackground';
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

  // Helper function to dynamically check active route styling using semantic theme variables
  const getLinkClass = (path: string) => {
    const isActive = location.pathname === path || location.pathname.startsWith(`${path}/`);
    return `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
      isActive 
        ? 'bg-primary/10 text-primary font-semibold' 
        : 'text-text-muted hover:bg-surface-2 hover:text-text-main'
    }`;
  };

  return (
    // Outer shell: Transparent background, lets InteractiveBackground shine through
    <div className="flex h-screen w-screen overflow-hidden font-body antialiased text-text-main relative z-0">
      
      {/* THEME-AWARE INTERACTIVE BACKGROUND */}
      <InteractiveBackground />
      
      {/* 1. DESKTOP SIDEBAR */}
      <aside className="w-64 bg-surface/80 backdrop-blur-md border-r border-borderline hidden md:flex flex-col z-20 transition-colors duration-300">
        <div className="h-16 flex items-center px-6 border-b border-borderline">
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-surface font-bold text-lg shadow-sm shadow-primary/20 group-hover:scale-105 transition-transform">
              F
            </div>
            <span className="text-xl font-bold text-text-main tracking-tight font-display">
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
        <div className="p-4 border-t border-borderline flex flex-col gap-1 bg-surface-2/30">
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
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* MOBILE DRAWER MENU */}
      <aside className={`fixed top-0 bottom-0 left-0 w-72 bg-surface z-50 transform transition-transform duration-300 ease-out md:hidden flex flex-col border-r border-borderline ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-borderline">
          <span className="text-xl font-bold text-text-main tracking-tight font-display">Navigation</span>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-text-muted hover:bg-surface-2 rounded-lg transition-colors">
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
          <div className="my-2 border-t border-borderline" />
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
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Mobile Header Topbar */}
        <header className="md:hidden h-16 bg-surface/80 backdrop-blur-md border-b border-borderline px-4 flex justify-between items-center z-30 shrink-0 transition-colors duration-300">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-text-muted hover:bg-surface-2 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="text-lg font-bold text-text-main tracking-tight font-display">NITSForge</span>
          <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center border border-borderline">
            <User className="w-5 h-5 text-text-muted" />
          </div>
        </header>

        {/* Dynamic Route View Injected Here */}
        {/* Notice how bg is transparent here so the InteractiveBackground shows behind the pages */}
        <main className="flex-1 overflow-y-auto relative z-10">
          <div className="max-w-7xl mx-auto h-full w-full">
            <Outlet />
          </div>
        </main>

        {/* Mobile Bottom Quick-Nav Bar */}
        <nav className="md:hidden h-16 bg-surface border-t border-borderline px-2 flex justify-around items-center shrink-0 z-30 transition-colors duration-300">
          {navItems.slice(0, 3).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 text-xs font-medium rounded-lg transition-colors ${
                  isActive ? 'text-primary' : 'text-text-muted hover:text-text-main'
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
              location.pathname.startsWith('/profile') ? 'text-primary' : 'text-text-muted hover:text-text-main'
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