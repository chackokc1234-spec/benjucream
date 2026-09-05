import "./globals.css";

export const metadata = {
  title: "Benju's Creamery",
  description: "Flavors That Shape Your Palate",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}