"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/exceptions", label: "Revisión" },
  { href: "/payout", label: "Payout" },
];

export function NavAdmin() {
  const path = usePathname();
  return (
    <nav className="flex gap-1">
      {LINKS.map(l => (
        <Link key={l.href} href={l.href}
          className={"text-sm px-3 py-1.5 rounded-lg transition " + (path.startsWith(l.href) ? "bg-indigo-50 text-indigo-700 font-medium" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50")}>
          {l.label}
        </Link>
      ))}
    </nav>
  );
}