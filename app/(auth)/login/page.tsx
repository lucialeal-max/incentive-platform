import { LoginForm } from "@/components/shared/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 mb-4">
            <span className="text-white text-2xl font-bold">IP</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Incentive Platform</h1>
          <p className="text-gray-500 text-sm mt-1">Iniciá sesión para continuar</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}