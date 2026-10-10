'use client';

import { useState, useEffect } from 'react';
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { useRouter, useParams } from 'next/navigation';
import {
  Star,
  MapPin,
  Clock,
  CheckCircle2,
  Calendar,
  Award,
  GraduationCap,
  ChevronLeft,
  Sparkles,
  Phone,
  MessageSquare,
  AlertCircle
} from "lucide-react";
import { api } from '@/lib/api';
import { Doctor, Slot } from '@/types';
import { format, addDays } from 'date-fns';

export default function DoctorProfilePage() {
  const router = useRouter();
  const routeParams = useParams();
  const id = routeParams?.id as string;

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);

  // Generate next 5 dates
  const nextDates = [0, 1, 2, 3, 4].map((dayOffset) => {
    const d = addDays(new Date(), dayOffset);
    return {
      formatted: format(d, 'yyyy-MM-dd'),
      displayDay: format(d, 'EEE'),
      displayDate: format(d, 'MMM d'),
    };
  });

  useEffect(() => {
    if (!id) return;
    api.get(`/doctors/${id}`)
      .then((res) => setDoctor(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id || !selectedDate) return;
    setSlotsLoading(true);
    api.get(`/doctors/${id}/slots`, { params: { date: selectedDate } })
      .then((res) => {
        setSlots(res.data.slots || []);
        setSelectedSlot('');
      })
      .catch((err) => console.error(err))
      .finally(() => setSlotsLoading(false));
  }, [id, selectedDate]);

  const handleProceedToBooking = () => {
    if (!selectedSlot || !id) return;
    router.push(`/doctors/${id}/book?date=${selectedDate}&slot=${encodeURIComponent(selectedSlot)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="h-96 bg-slate-200 animate-pulse rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-800">Doctor Not Found</h2>
          <Link href="/doctors" className="text-blue-600 font-semibold mt-4 inline-block">
            Back to Doctor Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <div className="container mx-auto px-4 py-10">
        {/* Back link */}
        <Link href="/doctors" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6 transition-colors">
          <ChevronLeft className="h-4 w-4" />
          Back to Doctors
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Doctor Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <img
                  src={doctor.photo_url || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400'}
                  alt={doctor.name}
                  className="w-28 h-28 rounded-2xl object-cover border border-slate-100 shadow-sm flex-shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400'; }}
                />
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-bold text-slate-900">{doctor.name}</h1>
                      <p className="text-blue-600 font-semibold text-sm">{doctor.specialization} · {doctor.department_name}</p>
                      <p className="text-slate-500 text-xs mt-1 flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" /> KMCH Main Campus, OPD Room 304
                      </p>
                    </div>
                    <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Verified Specialist
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 text-amber-400 fill-current" />
                      <span className="font-bold text-slate-800 text-sm">{doctor.rating}</span>
                      <span className="text-slate-400 text-xs">({doctor.review_count} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 text-xs font-medium">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <span>{doctor.experience} years experience</span>
                    </div>
                    <div className="text-sm font-bold text-slate-900">
                      ₹{doctor.fee} <span className="font-normal text-slate-400 text-xs">/ consultation</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-base font-bold text-slate-900 mb-3">About Doctor</h2>
              <p className="text-slate-600 text-sm leading-relaxed">{doctor.bio}</p>
            </div>

            {/* Qualifications & Schedule Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  Qualification & Medical Degree
                </h2>
                <div className="bg-blue-50/60 rounded-xl p-3 text-xs font-semibold text-blue-900">
                  {doctor.qualification}
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-blue-600" />
                  Available Working Days
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {(doctor as any).schedules?.length > 0
                    ? (doctor as any).schedules.map((s: any) => (
                        <span key={s.id} className="bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-lg">
                          {s.day_of_week} ({s.start_time}–{s.end_time})
                        </span>
                      ))
                    : <span className="text-xs text-slate-400">Schedule not available</span>
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Real-Time Slot Picker & Booking */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sticky top-24">
              <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Select Appointment Date
              </h2>

              {/* Date Selector */}
              <div className="grid grid-cols-5 gap-1.5 mb-6">
                {nextDates.map((item) => (
                  <button
                    key={item.formatted}
                    onClick={() => setSelectedDate(item.formatted)}
                    className={`py-2 rounded-xl text-center border transition-all ${
                      selectedDate === item.formatted
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md font-bold'
                        : 'border-slate-200 text-slate-700 hover:border-blue-300 bg-slate-50'
                    }`}
                  >
                    <span className="block text-[10px] uppercase opacity-80">{item.displayDay}</span>
                    <span className="block text-xs font-bold">{item.displayDate}</span>
                  </button>
                ))}
              </div>

              {/* Slots grid */}
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Available Time Slots
              </h3>

              {slotsLoading ? (
                <div className="grid grid-cols-3 gap-2 py-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-9 bg-slate-200 animate-pulse rounded-xl"></div>
                  ))}
                </div>
              ) : slots.length === 0 ? (
                <div className="text-center py-6 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xs text-slate-500 font-medium">Doctor is not available on this date.</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
                  {slots.map((slot) => (
                    <button
                      key={slot.time}
                      disabled={!slot.available}
                      onClick={() => setSelectedSlot(slot.time)}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                        !slot.available
                          ? 'bg-slate-100 text-slate-400 border-slate-200 line-through cursor-not-allowed'
                          : selectedSlot === slot.time
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                          : 'border-slate-200 text-slate-700 hover:border-blue-500 hover:bg-blue-50'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              )}

              {/* Proceed CTA */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs mb-4">
                  <span className="text-slate-500">Selected Slot:</span>
                  <span className="font-bold text-blue-600">
                    {selectedSlot ? `${selectedDate} at ${selectedSlot}` : 'None selected'}
                  </span>
                </div>
                <button
                  disabled={!selectedSlot}
                  onClick={handleProceedToBooking}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Proceed to Book
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
