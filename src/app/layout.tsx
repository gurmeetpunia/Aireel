import type { Metadata } from "next";
import "@fontsource/orbitron/400.css";
import "@fontsource/orbitron/700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Sports Reels",
  description: "AI-generated sports celebrity history reels",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground font-orbitron">
        <main>{children}</main>
      </body>
    </html>
  );
}
