'use client';

import { useState, useEffect } from 'react';
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Star,
  Filter,
  MapPin,
  Clock,
  ChevronRight,
  Brain,
  Heart,
  Activity,
  Users,
  Stethoscope,
  Bone,
  Eye,
  Sparkles
} from "lucide-react";
import { api } from '@/lib/api';
import { Doctor, Department } from '@/types';
import SymptomCheckerModal from '@/components/ai/SymptomCheckerModal';

export default function DoctorsPage() {
  const searchParams = useSearchParams();
  const initialDept = searchParams.get('department') || '';

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState(initialDept);
  const [maxFee, setMaxFee] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  useEffect(() => {
    // Fetch departments
    api.get('/departments')
      .then((res) => setDepartments(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: any = {};
    if (search) params.search = search;
    if (selectedDept) params.department_id = selectedDept;

    api.get('/doctors', { params })
      .then((res) => {
        let docs: Doctor[] = res.data;
        if (maxFee) {
          docs = docs.filter((d) => d.fee <= maxFee);
        }
        setDoctors(docs);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [search, selectedDept, maxFee]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <div className="container mx-auto px-4 py-10">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Find a Doctor</h1>
          <p className="text-slate-500">Book appointments with top-rated medical specialists at KMCH</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex items-center mb-8 max-w-2xl">
          <div className="flex-1 flex items-center px-4 gap-3">
            <Search className="h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by doctor name or specialization..."
              className="w-full py-2.5 outline-none text-slate-700 bg-transparent text-sm"
            />
          </div>
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="text-xs text-slate-400 hover:text-slate-600 px-3"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
            {/* Department Filter */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm">
                <Filter className="h-4 w-4 text-blue-600" />
                Department
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedDept('')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    selectedDept === ''
                      ? "bg-blue-50 text-blue-700 font-bold"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span>All Departments</span>
                </button>
                {departments.map((dept) => (
                  <button
                    key={dept.id}
                    onClick={() => setSelectedDept(dept.id.toString())}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      selectedDept === dept.id.toString()
                        ? "bg-blue-50 text-blue-700 font-bold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>{dept.name}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md">
                      {dept.doctor_count || 0}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Consultation Fee Filter */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4 text-sm">Consultation Fee</h3>
              <div className="space-y-2">
                {[
                  { label: 'All Prices', val: null },
                  { label: 'Under ₹500', val: 500 },
                  { label: 'Under ₹800', val: 800 },
                  { label: 'Under ₹1200', val: 1200 },
                ].map((opt) => (
                  <label key={opt.label} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="fee"
                      checked={maxFee === opt.val}
                      onChange={() => setMaxFee(opt.val)}
                      className="w-4 h-4 text-blue-600 accent-blue-600"
                    />
                    <span className="text-xs text-slate-700">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* AI Recommendation Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white shadow-lg shadow-blue-600/20">
              <div className="flex items-center gap-1.5 text-blue-200 text-xs font-semibold mb-1">
                <Sparkles className="h-4 w-4 text-blue-300" />
                AI Triage Assistant
              </div>
              <p className="font-bold text-sm mb-2">Unsure which doctor to consult?</p>
              <p className="text-[11px] text-blue-100 mb-3 leading-relaxed">
                Describe your symptoms and let our AI match you to the right clinical specialist.
              </p>
              <button
                onClick={() => setAiModalOpen(true)}
                className="w-full bg-white text-blue-700 py-2 rounded-xl text-xs font-bold hover:bg-blue-50 transition-colors shadow-xs"
              >
                Launch AI Assistant
              </button>
            </div>
          </aside>

          {/* AI Symptom Checker Modal */}
          <SymptomCheckerModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />

          {/* Doctor Listings */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-5">
              <p className="text-xs text-slate-500">
                Showing <span className="font-semibold text-slate-800">{doctors.length} doctors</span>
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-44 bg-slate-200 animate-pulse rounded-2xl"></div>
                ))}
              </div>
            ) : doctors.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <Stethoscope className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No Doctors Found</h3>
                <p className="text-xs text-slate-500 mt-1">Try adjusting your department or search filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {doctors.map((doc) => (
                  <div key={doc.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all p-5 flex flex-col justify-between">
                    <div className="flex gap-4">
                      <img
                        src={doc.photo_url || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400'}
                        alt={doc.name}
                        className="w-16 h-16 rounded-2xl object-cover border border-slate-100 flex-shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400'; }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-bold text-slate-900 text-base leading-snug">{doc.name}</h3>
                            <p className="text-xs text-blue-600 font-medium">{doc.specialization} · {doc.experience} yrs exp.</p>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 flex-shrink-0">
                            Available
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-2">
                          <Star className="h-3.5 w-3.5 text-amber-400 fill-current" />
                          <span className="font-bold text-slate-800 text-xs">{doc.rating}</span>
                          <span className="text-slate-400 text-xs">({doc.review_count} reviews)</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                          <span className="font-medium text-slate-700">{doc.qualification}</span>
                          <span>•</span>
                          <span>{doc.department_name}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400 block">Consultation Fee</span>
                        <span className="font-bold text-slate-900 text-base">₹{doc.fee}</span>
                      </div>
                      <Link
                        href={`/doctors/${doc.id}`}
                        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all"
                      >
                        Book Appointment
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
