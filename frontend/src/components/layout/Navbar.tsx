'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Activity, Bell, User as UserIcon, LogOut, Shield, Stethoscope, Calendar, LayoutDashboard } from 'lucide-react';
import { getUser, clearAuth } from '@/lib/auth';
import { getSocket } from '@/lib/socket';
import { api } from '@/lib/api';
import { User } from '@/types';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);

    if (currentUser) {
      // Fetch initial unread notifications count
      api.get('/notifications')
        .then((res) => setUnreadCount(res.data.unread_count || 0))
        .catch(() => {});

      // Setup socket listener
      const socket = getSocket();
      if (socket) {
        socket.on('notification', () => {
          setUnreadCount((prev) => prev + 1);
        });
      }
    }
  }, [pathname]);

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-blue-100 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-xl shadow-md group-hover:scale-105 transition-transform">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-950 to-blue-700 bg-clip-text text-transparent">
            KMCH <span className="text-blue-600 font-light">SmartMed AI</span>
          </span>
        </Link>
        
        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link 
            href="/" 
            className={`transition-colors ${pathname === '/' ? 'text-blue-600 font-semibold' : 'text-zinc-600 hover:text-blue-600'}`}
          >
            Home
          </Link>
          <Link 
            href="/departments" 
            className={`transition-colors ${pathname === '/departments' ? 'text-blue-600 font-semibold' : 'text-zinc-600 hover:text-blue-600'}`}
          >
            Departments
          </Link>
          <Link 
            href="/doctors" 
            className={`transition-colors ${pathname.startsWith('/doctors') ? 'text-blue-600 font-semibold' : 'text-zinc-600 hover:text-blue-600'}`}
          >
            Find Doctors
          </Link>

          {/* Role specific links */}
          {user?.role === 'patient' && (
            <>
              <Link 
                href="/patient/dashboard" 
                className={`transition-colors ${pathname === '/patient/dashboard' ? 'text-blue-600 font-semibold' : 'text-zinc-600 hover:text-blue-600'}`}
              >
                My Dashboard
              </Link>
              <Link 
                href="/patient/appointments" 
                className={`transition-colors ${pathname === '/patient/appointments' ? 'text-blue-600 font-semibold' : 'text-zinc-600 hover:text-blue-600'}`}
              >
                My Appointments
              </Link>
            </>
          )}

          {user?.role === 'doctor' && (
            <Link 
              href="/doctor/dashboard" 
              className={`flex items-center gap-1.5 transition-colors ${pathname === '/doctor/dashboard' ? 'text-blue-600 font-semibold' : 'text-blue-700 hover:text-blue-900 font-medium'}`}
            >
              <Stethoscope className="h-4 w-4" />
              Doctor Portal
            </Link>
          )}

          {user?.role === 'admin' && (
            <Link 
              href="/admin" 
              className={`flex items-center gap-1.5 transition-colors ${pathname.startsWith('/admin') ? 'text-indigo-600 font-semibold' : 'text-indigo-700 hover:text-indigo-900 font-medium'}`}
            >
              <Shield className="h-4 w-4" />
              Admin Portal
            </Link>
          )}
        </nav>

        {/* Action buttons */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* Notification Bell */}
              <Link href="/notifications" className="relative p-2 text-zinc-600 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>

              {/* User profile info - clickable to /profile */}
              <div className="flex items-center gap-3 pl-2 border-l border-zinc-200">
                <Link href="/profile" className="text-right hidden sm:block group">
                  <p className="text-xs font-semibold text-zinc-800 leading-tight group-hover:text-blue-600 transition-colors">{user.name}</p>
                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full ${
                    user.role === 'admin' ? 'bg-indigo-100 text-indigo-700' :
                    user.role === 'doctor' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role}
                  </span>
                </Link>

                <button 
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-zinc-500 hover:text-rose-600 rounded-full hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-medium text-zinc-600 hover:text-blue-600 px-3 py-2">
                Sign In
              </Link>
              <Link href="/register" className="text-sm font-medium text-blue-600 border border-blue-200 hover:bg-blue-50 px-4 py-2 rounded-full transition-colors hidden sm:block">
                Register
              </Link>
              <Link href="/doctors" className="text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-full shadow-md hover:shadow-lg hover:brightness-105 transition-all">
                Book Appointment
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
