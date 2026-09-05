import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Benju's Creamery",
  description: "Flavors That Shape Your Palate",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}