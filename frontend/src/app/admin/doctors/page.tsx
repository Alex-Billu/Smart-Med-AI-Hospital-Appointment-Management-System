'use client';

import { useState, useEffect } from 'react';
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import {
  Stethoscope,
  Plus,
  ChevronLeft,
  Search,
  CheckCircle2,
  Mail,
  Phone,
  Calendar,
  X
} from "lucide-react";
import { api } from '@/lib/api';
import { Doctor, Department } from '@/types';

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    department_id: '',
    specialization: '',
    qualification: '',
    experience_years: 5,
    consultation_fee: 600,
    available_days: 'Mon,Tue,Wed,Thu,Fri',
    start_time: '09:00',
    end_time: '17:00',
    bio: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchDoctorsAndDepts = () => {
    Promise.all([
      api.get('/admin/doctors'),
      api.get('/departments')
    ]).then(([docRes, deptRes]) => {
      setDoctors(docRes.data);
      setDepartments(deptRes.data);
      if (deptRes.data.length > 0 && !formData.department_id) {
        setFormData(prev => ({ ...prev, department_id: deptRes.data[0].id.toString() }));
      }
    }).catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDoctorsAndDepts();
  }, []);

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    try {
      await api.post('/admin/doctors', {
        ...formData,
        department_id: parseInt(formData.department_id),
        experience_years: Number(formData.experience_years),
        consultation_fee: Number(formData.consultation_fee)
      });
      setShowAddModal(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        department_id: departments[0]?.id?.toString() || '',
        specialization: '',
        qualification: '',
        experience_years: 5,
        consultation_fee: 600,
        available_days: 'Mon,Tue,Wed,Thu,Fri',
        start_time: '09:00',
        end_time: '17:00',
        bio: ''
      });
      fetchDoctorsAndDepts();
    } catch (err: any) {
      setFormError(err.response?.data?.error || 'Failed to add doctor');
    } finally {
      setFormLoading(false);
    }
  };

  const filteredDoctors = doctors.filter((doc) =>
    doc.name.toLowerCase().includes(search.toLowerCase()) ||
    doc.specialization.toLowerCase().includes(search.toLowerCase()) ||
    (doc.department_name && doc.department_name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-6 border-b border-slate-200">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 font-medium mb-2"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Back to Admin Overview
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Doctor Roster & Shifts
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage doctor credentials, medical department assignments, and consultation fees
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 sm:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Doctor
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex items-center mb-6 max-w-md">
          <div className="flex-1 flex items-center px-3 gap-2">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by doctor, specialty, department..."
              className="w-full py-2 outline-none text-slate-700 bg-transparent text-xs"
            />
          </div>
        </div>

        {/* Doctors Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-44 bg-slate-200 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Stethoscope className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800">No Doctors Found</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={doc.image_url || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150'}
                        alt={doc.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-100"
                      />
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm leading-snug">{doc.name}</h3>
                        <p className="text-xs text-indigo-600 font-semibold">{doc.specialization}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {doc.department_name}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-500 py-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      <span>{doc.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>{doc.available_days} ({doc.start_time} - {doc.end_time})</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Fee: <strong className="text-slate-900 font-bold">₹{doc.consultation_fee}</strong></span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold text-[10px]">
                    Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Doctor Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-indigo-600" />
                  Register New Doctor
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {formError && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                  {formError}
                </div>
              )}

              <form onSubmit={handleAddDoctor} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Doctor Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Dr. Rajesh Gupta"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Email (Login ID)</label>
                    <input
                      type="email"
                      required
                      placeholder="rajesh@kmch.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Department</label>
                    <select
                      value={formData.department_id}
                      onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                    >
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Specialization</label>
                    <input
                      type="text"
                      required
                      placeholder="Interventional Cardiologist"
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Qualification</label>
                    <input
                      type="text"
                      required
                      placeholder="MBBS, MD (Cardiology)"
                      value={formData.qualification}
                      onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Consultation Fee (₹)</label>
                    <input
                      type="number"
                      required
                      value={formData.consultation_fee}
                      onChange={(e) => setFormData({ ...formData, consultation_fee: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Experience (Years)</label>
                    <input
                      type="number"
                      required
                      value={formData.experience_years}
                      onChange={(e) => setFormData({ ...formData, experience_years: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Start Time</label>
                    <input
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">End Time</label>
                    <input
                      type="time"
                      value={formData.end_time}
                      onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2.5 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition-all disabled:opacity-50"
                  >
                    {formLoading ? 'Adding...' : 'Register Doctor'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
