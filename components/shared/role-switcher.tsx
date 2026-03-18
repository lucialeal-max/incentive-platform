"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function RoleSwitcher() {
  const path = usePathname();
  const isAdmin = path.startsWith("/dashboard") || path.startsWith("/exceptions") || path.startsWith("/payout");
  return isAdmin ? (
    <Link href="/my-objectives" className="text-xs px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition">
      Vista empleado
    </Link>
  ) : (
    <Link href="/dashboard" className="text-xs px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
      Panel admin
    </Link>
  );
}