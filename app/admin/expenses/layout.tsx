import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Expense Tracker | Admin Panel",
  description: "Track and manage event expenses",
};

export default function ExpensesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 