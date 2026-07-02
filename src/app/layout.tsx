import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import Container from "@/components/ui/container";
import Sidebar from "@/components/Sidebar";
import ActionIsland from "@/components/ActionIsland";

export const metadata: Metadata = {
  title: "Task Manager",
  description: "A simple task manager app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.className} ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <ThemeProvider>
          <Sidebar />
          <div className="h-dvh overflow-y-auto md:pl-[var(--sidebar-w,14rem)]">
            <Container>{children}</Container>
          </div>
          {/* Persistent - morphs between page views instead of remounting */}
          <ActionIsland />
        </ThemeProvider>
      </body>
    </html>
  );
}
