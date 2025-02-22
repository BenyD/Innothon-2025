import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Messages | Admin Panel",
  description: "Manage and respond to user messages",
};

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
