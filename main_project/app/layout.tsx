import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FWPF Pixelwahl",
  description: "Statischer Frontend-Prototyp einer FWPF-Wahlseite als digitaler Stimmzettel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
