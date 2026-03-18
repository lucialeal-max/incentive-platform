"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getSession, clearSession } from "@/lib/session";
import type { SessionUser } from "@/lib/session";

const AVATAR_COLOR: Record<string, string> = {
  "AG": "bg-purple-600",
  "CL": "bg-indigo-600",
  "MP": "bg-blue-600",
  "JT": "bg-teal-600",
  "SR": "bg-orange-600",
  "DV": "bg-green-600",
};

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase();
}

export function SessionHeader({ adminNav, employeeNav }: { adminNav?: boolean; employeeNav?: boolean }) {
  const router = useRouter();
  const path = usePathname();
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    const s = getSession();
    if (!s) { router.push("/login"); return; }
    setUser(s);
  }, [router]);

  function handleLogout() {
    clearSession();
    router.push("/login");
  }

  const initials = user ? getInitials(user.fullName) : "??";
  const avatarBg = AVATAR_COLOR[initials] ?? "bg-gray-500";
  const isAdminArea = path.startsWith("/dashboard") || path.startsWith("/exceptions") || path.startsWith("/payout");

  if (!user) return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-10 h-14" />
  );

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Left: logo + nav */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-900 text-sm hidden sm:block">Incentive Platform</span>
          </div>

          {adminNav && (
            <nav className="flex gap-1">
              {[
                { href: "/dashboard", label: "Dashboard" },
                { href: "/exceptions", label: "Revision" },
                { href: "/payout", label: "Payout" },
              ].map(l => (
                <a key={l.href} href={l.href}
                  className={`text-sm px-3 py-1.5 rounded-lg transition ${path.startsWith(l.href) ? "bg-indigo-50 text-indigo-700 font-medium" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"}`}>
                  {l.label}
                </a>
              ))}
            </nav>
          )}

          {employeeNav && (
            <nav className="flex gap-1">
              {[
                { href: "/my-objectives", label: "Mis objetivos" },
                { href: "/my-bonus", label: "Mi bono" },
              ].map(l => (
                <a key={l.href} href={l.href}
                  className={`text-sm px-3 py-1.5 rounded-lg transition ${path.startsWith(l.href) ? "bg-indigo-50 text-indigo-700 font-medium" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"}`}>
                  {l.label}
                </a>
              ))}
            </nav>
          )}
        </div>

        {/* Right: role switch + user */}
        <div className="flex items-center gap-3">
          {/* Role switcher for dual-role users */}
          {user.isAdmin && (
            isAdminArea ? (
              <a href="/my-objectives"
                className="text-xs px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Vista empleado
              </a>
            ) : (
              <a href="/dashboard"
                className="text-xs px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Panel admin
              </a>
            )
          )}

          {/* User menu */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-gray-100">
            <div className={`w-8 h-8 ${avatarBg} rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
              {initials}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-medium text-gray-900 leading-tight">{user.fullName}</p>
              <p className="text-xs text-gray-400 leading-tight">{user.role}</p>
            </div>
            <button onClick={handleLogout}
              className="text-xs text-gray-400 hover:text-gray-600 ml-1 transition"
              title="Salir">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}