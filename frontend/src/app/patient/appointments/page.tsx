'use client';

import { useState, useEffect } from 'react';
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Stethoscope,
  ChevronLeft,
  XCircle,
  FileText,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { api } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import { Appointment } from '@/types';

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const fetchAppointments = () => {
    api.get('/appointments')
      .then((res) => setAppointments(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAppointments();

    const socket = getSocket();
    if (socket) {
      socket.on('notification', () => fetchAppointments());
      socket.on('appointment_updated', () => fetchAppointments());
    }
  }, []);

  const handleCancel = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    setCancellingId(id);
    try {
      await api.put(`/appointments/${id}/status`, { status: 'cancelled' });
      fetchAppointments();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to cancel appointment');
    } finally {
      setCancellingId(null);
    }
  };

  const filtered = appointments.filter((apt) => {
    if (filter === 'all') return true;
    return apt.status === filter;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-4 border-b border-slate-200">
          <div>
            <Link
              href="/patient/dashboard"
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 font-medium mb-2"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Back to Dashboard
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              My Appointments History
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              View your consultation schedule, ticket numbers, and appointment status
            </p>
          </div>

          <Link
            href="/doctors"
            className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 py-2.5 rounded-full shadow-sm transition-all"
          >
            + Book New Appointment
          </Link>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                filter === tab
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-slate-200 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Calendar className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800">No Appointments Found</h3>
            <p className="text-xs text-slate-500 mt-1">You don&apos;t have any appointments matching this status.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((apt) => (
              <div
                key={apt.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                {/* Doctor info */}
                <div className="flex items-start gap-4">
                  <img
                    src={apt.doctor_image || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150'}
                    alt={apt.doctor_name}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-100 flex-shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-base">{apt.doctor_name}</h3>
                      <span className="text-[11px] font-mono font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        {apt.booking_id}
                      </span>
                    </div>
                    <p className="text-xs text-blue-600 font-medium mt-0.5">
                      {apt.specialization} · {apt.department_name}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" /> {apt.appointment_date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-slate-400" /> {apt.time_slot}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" /> OPD Room 204
                      </span>
                    </div>
                    {apt.reason && (
                      <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <span className="font-semibold text-slate-700">Reason:</span> {apt.reason}
                      </p>
                    )}
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                    apt.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    apt.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    apt.status === 'completed' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {apt.status}
                  </span>

                  {(apt.status === 'pending' || apt.status === 'confirmed') && (
                    <button
                      disabled={cancellingId === apt.id}
                      onClick={() => handleCancel(apt.id)}
                      className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 transition-colors"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      {cancellingId === apt.id ? 'Cancelling...' : 'Cancel Appointment'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
