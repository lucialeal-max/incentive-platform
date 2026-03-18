// Client-side session management via localStorage
// No real auth needed for hackathon demo

export interface SessionUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isAdmin: boolean;
  avatar: string;
}

export const DEMO_USERS: SessionUser[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    fullName: "Ana Garcia",
    email: "ana@humand.co",
    role: "RevOps Lead",
    isAdmin: true,
    avatar: "AG",
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    fullName: "Carlos Lopez",
    email: "carlos@humand.co",
    role: "AE / Admin",
    isAdmin: true,
    avatar: "CL",
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    fullName: "Maria Perez",
    email: "maria@humand.co",
    role: "Account Executive",
    isAdmin: false,
    avatar: "MP",
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    fullName: "Juan Torres",
    email: "juan@humand.co",
    role: "Success Manager",
    isAdmin: false,
    avatar: "JT",
  },
];

export function getSession(): SessionUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("demo_session");
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function setSession(user: SessionUser): void {
  localStorage.setItem("demo_session", JSON.stringify(user));
}

export function clearSession(): void {
  localStorage.removeItem("demo_session");
}