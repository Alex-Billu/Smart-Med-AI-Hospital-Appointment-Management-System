'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Stethoscope, Heart, Brain, Bone, Activity, Baby, Eye, Sparkles, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { api } from '@/lib/api';
import { Department } from '@/types';

const ICON_MAP: Record<string, any> = {
  Heart,
  Brain,
  Bone,
  Stethoscope,
  Activity,
  Baby,
  Eye,
  Sparkles
};

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/departments')
      .then((res) => {
        setDepartments(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            Specialized Medical Care
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Centers of Excellence & Departments
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Explore KMCH Hospital&apos;s world-class departments equipped with cutting-edge medical technology and expert medical specialists.
          </p>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-48 bg-slate-200 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {departments.map((dept) => {
              const IconComponent = ICON_MAP[dept.icon] || Stethoscope;
              return (
                <div 
                  key={dept.id} 
                  className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="bg-blue-50 text-blue-600 p-3.5 rounded-2xl w-fit mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{dept.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-3 mb-4 leading-relaxed">
                      {dept.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">
                      {dept.doctor_count || 0} Available Doctors
                    </span>
                    <Link
                      href={`/doctors?department=${dept.id}`}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                    >
                      View Doctors
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
