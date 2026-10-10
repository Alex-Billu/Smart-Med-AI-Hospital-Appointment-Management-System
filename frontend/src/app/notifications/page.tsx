'use client';

import { useState, useEffect } from 'react';
import Navbar from "@/components/layout/Navbar";
import { Bell, CheckCheck, Clock, ShieldAlert } from "lucide-react";
import { api } from '@/lib/api';
import { Notification } from '@/types';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = () => {
    api.get('/notifications')
      .then((res) => setNotifications(res.data.notifications || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkRead = async (id: number) => {
    try {
      await api.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Bell className="h-6 w-6 text-blue-600" />
              Notifications & Alerts
            </h1>
            <p className="text-xs text-slate-500 mt-1">Real-time updates regarding your hospital appointments</p>
          </div>

          {notifications.some(n => !n.is_read) && (
            <button
              onClick={handleMarkAllRead}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm"
            >
              <CheckCheck className="h-4 w-4" />
              Mark All as Read
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-slate-200 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Bell className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800">No Notifications</h3>
            <p className="text-xs text-slate-500 mt-1">You are all caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => !n.is_read && handleMarkRead(n.id)}
                className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 cursor-pointer ${
                  n.is_read
                    ? 'bg-white border-slate-200 text-slate-700'
                    : 'bg-blue-50/70 border-blue-200 text-slate-900 font-medium shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl mt-0.5 ${n.is_read ? 'bg-slate-100 text-slate-500' : 'bg-blue-600 text-white'}`}>
                    <Bell className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">{n.created_at}</span>
                  </div>
                </div>

                {!n.is_read && (
                  <span className="w-2.5 h-2.5 bg-blue-600 rounded-full flex-shrink-0 mt-1.5"></span>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
