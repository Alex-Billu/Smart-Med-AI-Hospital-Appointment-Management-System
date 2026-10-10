'use client';

import { useState, useEffect } from 'react';
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import {
  Shield,
  Users,
  Stethoscope,
  Calendar,
  TrendingUp,
  Activity,
  CheckCircle2,
  Clock,
  XCircle,
  PlusCircle,
  UserCheck
} from "lucide-react";
import { api } from '@/lib/api';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-semibold mb-2">
              <Shield className="h-3.5 w-3.5" />
              KMCH Hospital Administration
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Hospital Operations Overview
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Real-time monitoring of doctors, patients, OPD appointments, and hospital capacity
            </p>
          </div>

          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <Link
              href="/admin/doctors"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Manage Doctors
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-slate-200 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400 font-bold uppercase">Total Patients</span>
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                    <Users className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-slate-900">{data?.stats?.totalPatients || 0}</p>
                <p className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5" /> Active in system
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400 font-bold uppercase">Specialist Doctors</span>
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                    <Stethoscope className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-slate-900">{data?.stats?.totalDoctors || 0}</p>
                <p className="text-xs text-slate-500 mt-2">Across 8 Medical Depts</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400 font-bold uppercase">Total Bookings</span>
                  <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                    <Calendar className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-slate-900">{data?.stats?.totalAppointments || 0}</p>
                <p className="text-xs text-slate-500 mt-2">All time registrations</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400 font-bold uppercase">Today&apos;s Appointments</span>
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                    <Activity className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-slate-900">{data?.stats?.todayAppointments || 0}</p>
                <p className="text-xs text-amber-600 font-semibold mt-2">Scheduled for today</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Bookings Feed */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                  Recent Hospital Bookings
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase">
                        <th className="pb-3">Booking ID</th>
                        <th className="pb-3">Patient</th>
                        <th className="pb-3">Doctor</th>
                        <th className="pb-3">Date & Time</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data?.recentAppointments?.map((apt: any) => (
                        <tr key={apt.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 font-mono font-bold text-indigo-700">{apt.booking_id}</td>
                          <td className="py-3 font-semibold text-slate-800">{apt.patient_name}</td>
                          <td className="py-3 text-slate-600">{apt.doctor_name}</td>
                          <td className="py-3 text-slate-500">{apt.appointment_date} · {apt.appointment_time}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                              apt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                              apt.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                              apt.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {apt.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Status Breakdown & Quick Actions */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-indigo-600" />
                    Appointment Status Breakdown
                  </h2>
                  <div className="space-y-3">
                    {data?.statusBreakdown?.map((item: any) => (
                      <div key={item.status} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="font-semibold text-xs capitalize text-slate-700">{item.status}</span>
                        <span className="font-bold text-xs bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs">
                          {item.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-700 to-blue-800 rounded-2xl p-6 text-white shadow-lg">
                  <h3 className="font-bold text-base mb-1">Doctor & Shift Management</h3>
                  <p className="text-indigo-100 text-xs mb-4">
                    Add new specialist doctors, assign OPD rooms, set consultation fees and weekly shift schedules.
                  </p>
                  <Link
                    href="/admin/doctors"
                    className="inline-flex items-center gap-2 bg-white text-indigo-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-50 transition-colors shadow-sm"
                  >
                    Manage Doctors Directory
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
