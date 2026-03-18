export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white px-4">
      <div className="w-full max-w-sm text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 mb-4">
          <span className="text-white text-2xl font-bold">IP</span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Incentive Platform</h1>
        <p className="text-sm text-gray-500 mb-6">Demo hackathon — elegir vista</p>
        <div className="space-y-3">
          <a href="/my-objectives"
            className="block w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition text-sm">
            Entrar como empleado (Maria Perez · AE)
          </a>
          <a href="/dashboard"
            className="block w-full py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition text-sm">
            Entrar como admin (Ana Garcia · RevOps)
          </a>
        </div>
        <p className="text-xs text-gray-400 mt-6">Sin autenticacion requerida en modo demo</p>
      </div>
    </div>
  );
}