import type { Metadata } from "next";
import "./globals.css";
import SideBar from "./components/SideBar";
import TopBar from "./components/TopBar";

export const metadata: Metadata = {
  title: "RD System - Relatórios",
  description: "Visão consolidada das contas e saúde financeira operacional.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full bg-background text-on-surface font-inter antialiased">
        <SideBar />
        <main className="ml-64 min-h-screen">
          <TopBar />
          <div className="p-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
