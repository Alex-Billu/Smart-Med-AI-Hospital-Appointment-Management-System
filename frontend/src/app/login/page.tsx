'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Activity, Mail, Lock, ArrowRight, ShieldCheck, UserCheck, Stethoscope } from 'lucide-react';
import { api } from '@/lib/api';
import { saveAuth } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      saveAuth(token, user);

      if (user.role === 'doctor') {
        router.push('/doctor/dashboard');
      } else if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/patient/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo Branding */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg">
              <Activity className="h-7 w-7" />
            </div>
            <span className="text-2xl font-bold text-blue-950">KMCH SmartMed AI</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 mt-2">Welcome Back</h1>
          <p className="text-slate-500 text-sm">Access your healthcare portal securely</p>
        </div>

        {/* Demo Credentials Helper */}
        <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 mb-6 text-xs">
          <p className="font-semibold text-blue-900 mb-2 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-blue-600" />
            Quick Demo Login Options:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleDemoLogin('patient@kmch.com', 'patient123')}
              className="bg-white hover:bg-blue-100 text-blue-800 font-medium py-1.5 px-2 rounded-lg border border-blue-200 text-center transition-colors flex flex-col items-center gap-1"
            >
              <UserCheck className="h-3.5 w-3.5 text-blue-600" />
              Patient
            </button>
            <button
              onClick={() => handleDemoLogin('arun@kmch.com', 'doctor123')}
              className="bg-white hover:bg-emerald-100 text-emerald-800 font-medium py-1.5 px-2 rounded-lg border border-emerald-200 text-center transition-colors flex flex-col items-center gap-1"
            >
              <Stethoscope className="h-3.5 w-3.5 text-emerald-600" />
              Doctor
            </button>
            <button
              onClick={() => handleDemoLogin('admin@kmch.com', 'admin@kmch123')}
              className="bg-white hover:bg-purple-100 text-purple-800 font-medium py-1.5 px-2 rounded-lg border border-purple-200 text-center transition-colors flex flex-col items-center gap-1"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-purple-600" />
              Admin
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-blue-600 font-semibold hover:underline">
              Register as Patient
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
