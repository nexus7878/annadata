"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex bg-background min-h-screen text-foreground selection:bg-primary/20 transition-colors duration-300">
      <DashboardSidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 relative">
        <DashboardHeader
          onMobileMenuToggle={() => setMobileMenuOpen((v) => !v)}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto w-full relative">
          {children}
        </main>
      </div>
    </div>
  );
}
