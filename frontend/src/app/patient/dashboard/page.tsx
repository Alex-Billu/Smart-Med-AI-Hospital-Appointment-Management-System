'use client';

import { useState, useEffect } from 'react';
import Navbar from "@/components/layout/Navbar";
import {
  Calendar,
  Activity,
  FileText,
  Bell,
  Heart,
  TrendingUp,
  Clock,
  CheckCircle2,
  ChevronRight,
  User,
  Stethoscope,
  Pill,
  XCircle
} from "lucide-react";
import Link from "next/link";
import { api } from '@/lib/api';
import { getUser } from '@/lib/auth';
import { getSocket } from '@/lib/socket';
import { Appointment, User as UserType, Notification } from '@/types';
import { format } from 'date-fns';
import SymptomCheckerModal from '@/components/ai/SymptomCheckerModal';

export default function PatientDashboard() {
  const [user, setUser] = useState<UserType | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  const fetchAppointments = () => {
    api.get('/appointments')
      .then((res) => setAppointments(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const fetchNotifications = () => {
    api.get('/notifications')
      .then((res) => setNotifications(res.data.notifications || []))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);
    fetchAppointments();
    fetchNotifications();

    const socket = getSocket();
    if (socket) {
      socket.on('notification', () => {
        fetchNotifications();
        fetchAppointments();
      });
      socket.on('appointment_updated', () => {
        fetchAppointments();
      });
    }
  }, []);

  const handleCancelAppointment = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await api.put(`/appointments/${id}/status`, { status: 'cancelled' });
      fetchAppointments();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to cancel appointment');
    }
  };

  const healthMetrics = [
    { label: "Heart Rate", value: "72", unit: "bpm", icon: Heart, color: "text-rose-500", bg: "bg-rose-50", trend: "+2%" },
    { label: "Blood Pressure", value: "120/80", unit: "mmHg", icon: Activity, color: "text-blue-500", bg: "bg-blue-50", trend: "Normal" },
    { label: "Blood Sugar", value: "98", unit: "mg/dL", icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-50", trend: "-5%" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Welcome Back, {user?.name || 'Patient'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              KMCH Health Portal · {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <button
              onClick={() => setAiModalOpen(true)}
              className="flex items-center gap-1.5 border border-blue-200 text-blue-600 hover:bg-blue-50 font-semibold text-xs px-4 py-2.5 rounded-full transition-all"
            >
              ✦ AI Symptom Check
            </button>
            <Link
              href="/doctors"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 py-2.5 rounded-full shadow-sm transition-all"
            >
              + Book Appointment
            </Link>
          </div>
        </div>

        {/* AI Symptom Checker Modal */}
        <SymptomCheckerModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />

        {/* Health Metrics */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {healthMetrics.map((metric) => (
            <div key={metric.label} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${metric.bg}`}>
                  <metric.icon className={`h-5 w-5 ${metric.color}`} />
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${metric.bg} ${metric.color}`}>
                  {metric.trend}
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {metric.value}
                <span className="text-xs font-normal text-slate-400 ml-1">{metric.unit}</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">{metric.label}</p>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Appointments Feed */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Your Appointments
                </h2>
                <Link href="/patient/appointments" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
                  Full History <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-20 bg-slate-200 animate-pulse rounded-xl"></div>
                  ))}
                </div>
              ) : appointments.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl">
                  <Stethoscope className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700">No Appointments Booked</p>
                  <p className="text-xs text-slate-400 mt-0.5">Explore available doctors and book your first visit.</p>
                  <Link href="/doctors" className="inline-block mt-4 text-xs font-semibold text-blue-600 hover:underline">
                    Browse Doctors
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((apt) => (
                    <div key={apt.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition-all gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={apt.doctor_image || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150'}
                          alt={apt.doctor_name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-100 flex-shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{apt.doctor_name}</p>
                          <p className="text-xs text-blue-600 font-medium">{apt.specialization} · {apt.department_name}</p>
                          <p className="text-[11px] text-slate-400 mt-1">Booking ID: <span className="font-mono font-semibold text-slate-700">{apt.booking_id}</span></p>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                        <div className="text-left sm:text-right">
                          <p className="text-xs font-bold text-slate-800">{apt.appointment_date}</p>
                          <p className="text-xs text-slate-500 font-medium">{apt.time_slot}</p>
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            apt.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' :
                            apt.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                            apt.status === 'completed' ? 'bg-blue-50 text-blue-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {apt.status.toUpperCase()}
                          </span>

                          {apt.status === 'pending' && (
                            <button
                              onClick={() => handleCancelAppointment(apt.id)}
                              title="Cancel appointment"
                              className="text-xs text-rose-600 hover:text-rose-800 font-medium underline ml-2"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar: Notifications */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
                <Bell className="h-5 w-5 text-blue-600" />
                Live Alerts & Notifications
              </h2>

              {notifications.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No recent notifications</p>
              ) : (
                <div className="space-y-3">
                  {notifications.slice(0, 5).map((n) => (
                    <div key={n.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <p className="font-bold text-slate-800">{n.title}</p>
                      <p className="text-slate-600 text-[11px] mt-0.5">{n.message}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{n.created_at}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
