'use client';

import { useState, useEffect } from 'react';
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  Shield,
  Edit3,
  Calendar,
  CheckCircle2,
  Save,
  X,
  Activity,
  Stethoscope
} from "lucide-react";
import { api } from '@/lib/api';
import { getUser, saveAuth } from '@/lib/auth';
import { User as UserType } from '@/types';

export default function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [appointmentStats, setAppointmentStats] = useState({ total: 0, upcoming: 0, completed: 0 });

  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);
    if (currentUser) {
      setFormData({ name: currentUser.name, phone: currentUser.phone || '' });
    }

    // Fetch appointment stats for patient
    api.get('/appointments/my-appointments')
      .then((res) => {
        const apts = res.data;
        const now = new Date().toISOString().split('T')[0];
        setAppointmentStats({
          total: apts.length,
          upcoming: apts.filter((a: any) => a.appointment_date >= now && (a.status === 'confirmed' || a.status === 'pending')).length,
          completed: apts.filter((a: any) => a.status === 'completed').length,
        });
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const res = await api.put('/auth/profile', formData);
      const updated = { ...user, ...formData };
      setUser(updated);
      const token = document.cookie.match(/kmch_token=([^;]+)/)?.[1] || '';
      saveAuth(token, updated);
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <main className="container mx-auto px-4 py-10 max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
          <p className="text-xs text-slate-500 mt-1">Manage your personal information and account details</p>
        </div>

        {/* Profile Header Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white mb-6 shadow-xl shadow-blue-600/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-white font-bold text-3xl shadow-lg border border-white/30">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <p className="text-blue-200 text-sm mt-0.5">{user?.email}</p>
              <div className="flex items-center gap-3 mt-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  user?.role === 'admin' ? 'bg-white/20 text-white' :
                  user?.role === 'doctor' ? 'bg-emerald-400/30 text-emerald-100' : 'bg-white/15 text-blue-100'
                }`}>
                  {user?.role === 'admin' && <Shield className="h-3 w-3" />}
                  {user?.role === 'doctor' && <Stethoscope className="h-3 w-3" />}
                  {user?.role === 'patient' && <User className="h-3 w-3" />}
                  {user?.role?.charAt(0).toUpperCase()}{user?.role?.slice(1)}
                </span>
                <span className="text-blue-200 text-xs">KMCH Patient ID: #{user?.id?.toString().padStart(5, '0')}</span>
              </div>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white px-4 py-2 rounded-xl text-xs font-semibold backdrop-blur border border-white/20 transition-all"
            >
              <Edit3 className="h-3.5 w-3.5" />
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          {[
            { label: 'Total Appointments', value: appointmentStats.total, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Upcoming Visits', value: appointmentStats.upcoming, icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Completed', value: appointmentStats.completed, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
              <div className={`${stat.bg} p-3 rounded-xl`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Profile Details / Edit Form */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Personal Information
          </h3>

          {saved && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2 font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              Profile updated successfully!
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              ) : (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <User className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-800">{user?.name}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <Mail className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-800">{user?.email}</span>
                <span className="ml-auto text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md font-bold">Verified</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number</label>
              {editing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              ) : (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-800">{user?.phone || 'Not provided'}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Account Role</label>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <Shield className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-800 capitalize">{user?.role}</span>
              </div>
            </div>
          </div>

          {editing && (
            <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => setEditing(false)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl text-xs hover:bg-slate-50 transition-all"
              >
                <X className="h-3.5 w-3.5" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-sm transition-all disabled:opacity-50"
              >
                <Save className="h-3.5 w-3.5" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}

          {!editing && (
            <div className="mt-6 pt-4 border-t border-slate-100 flex gap-3">
              <Link
                href="/patient/appointments"
                className="flex-1 text-center text-xs font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 py-2.5 rounded-xl transition-colors"
              >
                View All Appointments
              </Link>
              <Link
                href="/doctors"
                className="flex-1 text-center text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl shadow-sm transition-all"
              >
                Book New Appointment
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
