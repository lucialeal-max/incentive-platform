"use client";
import { useRouter } from "next/navigation";
import { DEMO_USERS, setSession } from "@/lib/session";

const ROLE_COLOR: Record<string, string> = {
  "RevOps Lead":       "bg-purple-100 text-purple-700",
  "AE / Admin":        "bg-indigo-100 text-indigo-700",
  "Account Executive": "bg-blue-100 text-blue-700",
  "Success Manager":   "bg-teal-100 text-teal-700",
  "BDR":               "bg-orange-100 text-orange-700",
};

const AVATAR_COLOR: Record<string, string> = {
  "AG": "bg-purple-600",
  "CL": "bg-indigo-600",
  "MP": "bg-blue-600",
  "JT": "bg-teal-600",
};

export function LoginPageClient() {
  const router = useRouter();

  function handleLogin(userId: string) {
    const user = DEMO_USERS.find(u => u.id === userId);
    if (!user) return;
    setSession(user);
    if (user.isAdmin) {
      router.push("/dashboard");
    } else {
      router.push("/my-objectives");
    }
  }

  const admins = DEMO_USERS.filter(u => u.isAdmin);
  const employees = DEMO_USERS.filter(u => !u.isAdmin);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-2xl mb-4">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="font-bold tracking-tight">Incentive Platform</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Selecciona tu perfil</h1>
          <p className="text-gray-400 text-sm mt-1">Demo hackathon — cada perfil tiene una experiencia diferente</p>
        </div>

        {/* Admins */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 px-1">Panel de administracion</p>
          <div className="space-y-3">
            {admins.map(user => (
              <button key={user.id} onClick={() => handleLogin(user.id)}
                className="w-full flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl hover:border-indigo-200 hover:shadow-md transition-all text-left group">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${AVATAR_COLOR[user.avatar] ?? "bg-gray-500"}`}>
                  {user.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900">{user.fullName}</p>
                    {user.isAdmin && user.jobRole === "AE / Admin" && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">IC + Admin</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${ROLE_COLOR[user.role] ?? "bg-gray-100 text-gray-600"}`}>
                    {user.role}
                  </span>
                  <svg className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Employees */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 px-1">Vista de empleado</p>
          <div className="space-y-3">
            {employees.map(user => (
              <button key={user.id} onClick={() => handleLogin(user.id)}
                className="w-full flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl hover:border-indigo-200 hover:shadow-md transition-all text-left group">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${AVATAR_COLOR[user.avatar] ?? "bg-gray-600"}`}>
                  {user.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{user.fullName}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${ROLE_COLOR[user.role] ?? "bg-gray-100 text-gray-600"}`}>
                    {user.role}
                  </span>
                  <svg className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-gray-300 mt-8">Hackathon demo — sin autenticacion real</p>
      </div>
    </div>
  );
}