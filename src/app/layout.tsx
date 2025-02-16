import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import Container from "@/components/ui/container";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={`${inter.className}`}>
        <ThemeProvider>
          <ThemeToggleButton />
          <Container>{children}</Container>
        </ThemeProvider>
      </body>
    </html>
  );
}
