'use client';

import { useState, useEffect } from 'react';
import Navbar from "@/components/layout/Navbar";
import {
  Stethoscope,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  User,
  Phone,
  Mail,
  AlertCircle,
  Check,
  RefreshCw,
  Bell
} from "lucide-react";
import { api } from '@/lib/api';
import { getUser } from '@/lib/auth';
import { getSocket } from '@/lib/socket';
import { Appointment, User as UserType } from '@/types';
import { format } from 'date-fns';

export default function DoctorDashboardPage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('all');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchDoctorAppointments = () => {
    api.get('/appointments')
      .then((res) => setAppointments(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);
    fetchDoctorAppointments();

    const socket = getSocket();
    if (socket) {
      // Listen for instant booking notification from patient
      socket.on('new_appointment', (data) => {
        fetchDoctorAppointments();
      });
      socket.on('notification', () => {
        fetchDoctorAppointments();
      });
    }
  }, []);

  const handleStatusUpdate = async (id: number, status: 'confirmed' | 'completed' | 'cancelled') => {
    setUpdatingId(id);
    try {
      await api.put(`/appointments/${id}/status`, { status });
      fetchDoctorAppointments();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (filter === 'all') return true;
    return apt.status === filter;
  });

  const pendingCount = appointments.filter(a => a.status === 'pending').length;
  const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;
  const completedCount = appointments.filter(a => a.status === 'completed').length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
              <Stethoscope className="h-3.5 w-3.5" />
              Doctor Control Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Welcome, {user?.name || 'Doctor'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage patient consultations and real-time appointment updates
            </p>
          </div>

          <button
            onClick={fetchDoctorAppointments}
            className="mt-4 sm:mt-0 flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-4 py-2 rounded-xl shadow-sm transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh Schedule
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Appointments</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{appointments.length}</p>
          </div>
          <div className="bg-amber-50/70 rounded-2xl p-5 border border-amber-200 shadow-sm">
            <p className="text-xs text-amber-700 font-bold uppercase tracking-wider">Pending Action</p>
            <p className="text-2xl font-bold text-amber-900 mt-1">{pendingCount}</p>
          </div>
          <div className="bg-emerald-50/70 rounded-2xl p-5 border border-emerald-200 shadow-sm">
            <p className="text-xs text-emerald-700 font-bold uppercase tracking-wider">Confirmed</p>
            <p className="text-2xl font-bold text-emerald-900 mt-1">{confirmedCount}</p>
          </div>
          <div className="bg-blue-50/70 rounded-2xl p-5 border border-blue-200 shadow-sm">
            <p className="text-xs text-blue-700 font-bold uppercase tracking-wider">Completed</p>
            <p className="text-2xl font-bold text-blue-900 mt-1">{completedCount}</p>
          </div>
        </div>

        {/* Navigation Tabs (Appointments vs Availability) */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            {(['all', 'pending', 'confirmed', 'completed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                  filter === tab
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Doctor Status:</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              On Duty (OPD Active)
            </span>
          </div>
        </div>

        {/* Appointments Table / Cards */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-slate-200 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Calendar className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800">No Appointments</h3>
            <p className="text-xs text-slate-500 mt-1">There are no appointments matching this category.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((apt) => (
              <div
                key={apt.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md transition-shadow"
              >
                {/* Patient Info */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-base">{apt.patient_name}</h3>
                      <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold">
                        ID: {apt.booking_id}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5 text-slate-400" /> {apt.patient_email}
                      </span>
                      {apt.patient_phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5 text-slate-400" /> {apt.patient_phone}
                        </span>
                      )}
                    </div>
                    {apt.notes && (
                      <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <span className="font-semibold text-slate-800">Notes:</span> {apt.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Date & Action Buttons */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto justify-between border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <p className="text-xs font-bold text-slate-900">{apt.appointment_date}</p>
                    <p className="text-xs text-blue-600 font-semibold">{apt.time_slot}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${
                      apt.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' :
                      apt.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                      apt.status === 'completed' ? 'bg-blue-50 text-blue-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {apt.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {apt.status === 'pending' && (
                      <button
                        disabled={updatingId === apt.id}
                        onClick={() => handleStatusUpdate(apt.id, 'confirmed')}
                        className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1"
                      >
                        <Check className="h-3.5 w-3.5" /> Accept
                      </button>
                    )}

                    {apt.status === 'confirmed' && (
                      <button
                        disabled={updatingId === apt.id}
                        onClick={() => handleStatusUpdate(apt.id, 'completed')}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> Mark Completed
                      </button>
                    )}

                    {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                      <button
                        disabled={updatingId === apt.id}
                        onClick={() => handleStatusUpdate(apt.id, 'cancelled')}
                        className="px-3 py-2 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1"
                      >
                        <XCircle className="h-3.5 w-3.5" /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
