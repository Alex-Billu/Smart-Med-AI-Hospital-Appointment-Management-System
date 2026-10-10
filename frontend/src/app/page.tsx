'use client';

import { useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import {
  Search,
  Heart,
  Activity,
  Brain,
  Stethoscope,
  Users,
  Building,
  CalendarCheck,
  ArrowRight,
  Star,
  CheckCircle2,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";

export default function Home() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/doctors?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push('/doctors');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-16 pb-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50/70 to-transparent -z-10" />
          
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
              <div className="flex-1 text-center lg:text-left space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                  </span>
                  KMCH SmartMed AI · Automated Hospital Scheduling
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-slate-950 tracking-tight">
                  Next-Generation <br className="hidden lg:block"/>
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Healthcare Scheduling
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Experience seamless doctor consultations at KMCH Hospital. Book in real-time, avoid waiting lines, and receive instant digital appointment passes.
                </p>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="bg-white p-2 rounded-2xl shadow-xl shadow-blue-900/5 max-w-2xl mx-auto lg:mx-0 flex items-center border border-slate-200">
                  <div className="flex-1 flex items-center px-4 gap-3">
                    <Search className="h-5 w-5 text-slate-400" />
                    <input 
                      type="text" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search doctor name, specialty, or condition..." 
                      className="w-full py-3 outline-none text-slate-700 bg-transparent text-sm"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="bg-blue-600 text-white px-7 py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Find Doctor
                  </button>
                </form>

                <div className="flex items-center justify-center lg:justify-start gap-6 pt-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Real-time slot availability
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                    Automated conflict prevention
                  </div>
                </div>
              </div>

              {/* Hero Showcase Card */}
              <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
                <div className="bg-white p-6 rounded-3xl shadow-xl shadow-blue-900/10 border border-slate-200 relative">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden relative shadow-inner">
                    <img
                      src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop"
                      alt="KMCH Hospital Building"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                      <span className="text-xs uppercase font-bold tracking-wider text-blue-300">KMCH Main Campus</span>
                      <h3 className="text-lg font-bold">Center for Advanced Healthcare</h3>
                    </div>
                  </div>
                  
                  {/* Floating badge */}
                  <div className="absolute -bottom-5 -left-5 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                    <div className="bg-emerald-100 p-2.5 rounded-xl">
                      <CalendarCheck className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500">Live Slots Available</p>
                      <p className="text-base font-bold text-slate-900">25+ Doctors On Duty</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Banner */}
        <section className="py-10 bg-white border-y border-slate-200">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-slate-100">
              {[
                { label: "Specialist Doctors", value: "250+", icon: Stethoscope },
                { label: "Patient Consultations", value: "50,000+", icon: Users },
                { label: "Medical Departments", value: "35+", icon: Building },
                { label: "Emergency Readiness", value: "24/7", icon: Activity },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center justify-center text-center px-4">
                  <div className="bg-blue-50 p-3 rounded-full mb-3 text-blue-600">
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-0.5">{stat.value}</h3>
                  <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Departments Section */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Featured Departments</h2>
                <p className="text-slate-600 text-sm max-w-xl">
                  Specialized medical centers staffed with dedicated healthcare professionals.
                </p>
              </div>
              <Link href="/departments" className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700">
                View All Departments <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "Cardiology", desc: "Advanced heart & vascular care", icon: Heart, id: 1 },
                { name: "Neurology", desc: "Brain, spine & neural health", icon: Brain, id: 2 },
                { name: "Orthopedics", desc: "Joint replacement & trauma care", icon: Activity, id: 3 },
                { name: "Pediatrics", desc: "Compassionate child healthcare", icon: Users, id: 5 },
              ].map((dept) => (
                <Link
                  href={`/doctors?department=${dept.id}`}
                  key={dept.name}
                  className="group bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-blue-300 transition-all block"
                >
                  <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors text-blue-600">
                    <dept.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{dept.name}</h3>
                  <p className="text-xs text-slate-500 mb-4">{dept.desc}</p>
                  <div className="text-xs font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Find Specialists <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Doctors Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-xl mx-auto mb-14">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Featured Medical Specialists</h2>
              <p className="text-slate-600 text-sm">
                Consult with nationally recognized doctors at KMCH Hospital.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  id: 1,
                  name: "Dr. Sarah Jenkins",
                  specialty: "Interventional Cardiology",
                  exp: "15 yrs exp",
                  fee: "₹800",
                  img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500"
                },
                {
                  id: 2,
                  name: "Dr. Arun Kumar",
                  specialty: "Neurologist & Neurosurgeon",
                  exp: "12 yrs exp",
                  fee: "₹1,000",
                  img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500"
                },
                {
                  id: 3,
                  name: "Dr. Priya Sharma",
                  specialty: "Clinical Dermatology",
                  exp: "8 yrs exp",
                  fee: "₹700",
                  img: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=500"
                }
              ].map((doc) => (
                <div key={doc.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                      <img
                        src={doc.img}
                        alt={doc.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500'; }}
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm text-slate-800">
                        <Star className="h-3.5 w-3.5 text-amber-400 fill-current" /> 4.9
                      </div>
                    </div>
                    <div className="p-6">
                      <span className="text-xs font-semibold text-blue-600">{doc.specialty}</span>
                      <h3 className="text-lg font-bold text-slate-900 mt-0.5">{doc.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">{doc.exp}</p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between mt-2">
                    <span className="font-bold text-slate-900 text-sm">{doc.fee} <span className="font-normal text-xs text-slate-400">/ visit</span></span>
                    <Link
                      href={`/doctors/${doc.id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
                    >
                      Book Visit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Activity className="h-5 w-5 text-blue-400" />
              KMCH SmartMed AI
            </div>
            <p>© 2026 KMCH Hospital Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
