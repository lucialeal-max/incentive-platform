import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Incentive Platform",
  description: "Gestión de incentivos y bonos",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}