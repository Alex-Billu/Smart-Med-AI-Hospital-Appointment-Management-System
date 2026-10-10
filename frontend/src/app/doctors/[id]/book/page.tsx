'use client';

import { useState, useEffect } from 'react';
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import {
  CheckCircle2,
  Download,
  CalendarPlus,
  QrCode,
  Clock,
  MapPin,
  Share2,
  FileText,
  AlertCircle
} from "lucide-react";
import { api } from '@/lib/api';
import { getUser } from '@/lib/auth';
import { Doctor, Appointment, User } from '@/types';

export default function BookingConfirmPage() {
  const router = useRouter();
  const routeParams = useParams();
  const id = routeParams?.id as string;
  const searchParams = useSearchParams();
  const date = searchParams.get('date') || '';
  const slot = searchParams.get('slot') || '';

  const [user, setUser] = useState<User | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);

    if (id) {
      api.get(`/doctors/${id}`)
        .then((res) => setDoctor(res.data))
        .catch((err) => console.error(err));
    }
  }, [id]);

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      router.push(`/login?redirect=/doctors/${id}/book?date=${date}&slot=${encodeURIComponent(slot)}`);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/appointments', {
        doctor_id: parseInt(id),
        appointment_date: date,
        time_slot: slot,
        notes: reason
      });
      setConfirmedAppointment(res.data.appointment);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to book appointment. Slot may already be taken.');
    } finally {
      setLoading(false);
    }
  };

  if (!date || !slot) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-800">No Slot Selected</h2>
          <Link href={`/doctors/${id || '1'}`} className="text-blue-600 font-semibold mt-4 inline-block">
            Return to Doctor Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-lg w-full">
          {!confirmedAppointment ? (
            /* Booking Form / Review */
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8">
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Review & Confirm</h1>
              <p className="text-slate-500 text-xs mb-6">Confirm details for your consultation at KMCH</p>

              {error && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                  {error}
                </div>
              )}

              {doctor && (
                <div className="bg-blue-50/60 rounded-2xl p-4 mb-6 border border-blue-100 flex items-center gap-4">
                  <img
                    src={doctor.photo_url || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400'}
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400'; }}
                    alt={doctor.name}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{doctor.name}</h3>
                    <p className="text-xs text-blue-600 font-medium">{doctor.specialization}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Fee: <span className="font-bold text-slate-900">₹{doctor.fee}</span>
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Selected Date:</span>
                  <span className="font-bold text-slate-800">{date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Selected Time:</span>
                  <span className="font-bold text-blue-600">{slot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Hospital Location:</span>
                  <span className="font-semibold text-slate-700">KMCH Main Campus OPD</span>
                </div>
              </div>

              <form onSubmit={handleConfirmBooking} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5 text-blue-600" />
                    Reason for Visit / Symptoms (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="E.g., Routine checkup, chest discomfort, follow up..."
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md transition-all disabled:opacity-50"
                >
                  {loading ? 'Processing Booking...' : 'Confirm & Book Appointment'}
                </button>
              </form>
            </div>
          ) : (
            /* Success Ticket */
            <div>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-3 animate-bounce">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-1">Appointment Confirmed!</h1>
                <p className="text-slate-500 text-xs">
                  Your appointment has been registered and sent to the doctor.
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-200 text-xs font-medium">Booking ID</p>
                      <p className="font-bold text-lg tracking-wider">{confirmedAppointment.booking_id}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur p-2.5 rounded-2xl">
                      <QrCode className="h-7 w-7 text-white" />
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Doctor</p>
                      <p className="font-bold text-slate-900">{doctor?.name}</p>
                      <p className="text-slate-500">{doctor?.specialization}</p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Patient</p>
                      <p className="font-bold text-slate-900">{user?.name}</p>
                      <p className="text-slate-500">{user?.email}</p>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-1">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
                        <CalendarPlus className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">Date & Time</p>
                        <p className="font-semibold text-slate-800">{confirmedAppointment.appointment_date} · {confirmedAppointment.appointment_time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400">Location</p>
                        <p className="font-semibold text-slate-800">KMCH Main OPD Block</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 flex gap-3">
                  <Link
                    href="/patient/appointments"
                    className="flex-1 text-center py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    My Appointments
                  </Link>
                  <Link
                    href="/doctors"
                    className="flex-1 text-center py-2.5 bg-blue-600 rounded-xl text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
                  >
                    Book Another
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
