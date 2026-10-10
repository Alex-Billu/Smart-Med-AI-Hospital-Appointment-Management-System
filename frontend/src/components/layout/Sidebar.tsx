import Link from "next/link";
import { LayoutDashboard, Calendar, Users, FileText, Settings, LogOut, Bell } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-zinc-100 flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-blue-600 p-2 rounded-lg">
            <LayoutDashboard className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-blue-950">SmartMed AI</span>
        </div>

        <nav className="space-y-1">
          <Link href="/patient/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 text-blue-700 font-medium">
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 font-medium transition-colors">
            <Calendar className="h-5 w-5" />
            Appointments
          </Link>
          <Link href="/doctors" className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 font-medium transition-colors">
            <Users className="h-5 w-5" />
            Find Doctors
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 font-medium transition-colors">
            <FileText className="h-5 w-5" />
            Medical Records
          </Link>
          <Link href="#" className="flex items-center justify-between px-4 py-3 rounded-xl text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 font-medium transition-colors">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5" />
              Notifications
            </div>
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">3</span>
          </Link>
        </nav>
      </div>

      <div className="mt-auto p-6">
        <nav className="space-y-1">
          <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 font-medium transition-colors">
            <Settings className="h-5 w-5" />
            Settings
          </Link>
          <Link href="/login" className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 font-medium transition-colors">
            <LogOut className="h-5 w-5" />
            Logout
          </Link>
        </nav>
      </div>
    </aside>
  );
}
