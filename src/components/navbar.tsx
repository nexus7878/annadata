"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, Droplets, Building2, Landmark, Bot, Leaf, TrendingUp, ShoppingBag, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";

const navLinks = [
  { name: "Home", href: "/", icon: Leaf },
  { name: "Crop Analysis", href: "/crop-analysis", icon: Search },
  { name: "Irrigation", href: "/irrigation", icon: Droplets },
  { name: "Mandi Prices", href: "/mandi-prices", icon: TrendingUp },
  { name: "Warehouse", href: "/warehouse", icon: Building2 },
  { name: "Schemes", href: "/schemes", icon: Landmark },
  { name: "AI Assistant", href: "/ai-assistant", icon: Bot },
  { name: "Market", href: "/market", icon: ShoppingBag },
];

export function Navbar() {
  const { data: session, status } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-500 ease-out",
          isScrolled
            ? "py-1.5 sm:py-2"
            : "py-2.5 sm:py-4"
        )}
      >
        <div className={cn(
          "mx-auto max-w-7xl px-3 sm:px-4 md:px-6 transition-all duration-500",
          isScrolled ? "mx-2 sm:mx-4 md:mx-8" : ""
        )}>
          <div className={cn(
            "flex items-center justify-between rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 transition-all duration-500",
            isScrolled
              ? "glass-strong shadow-lg shadow-black/[0.03] glow-sm"
              : "bg-transparent"
          )}>
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center"
              >
                <Image src="/images/symbollogo.png" alt="Annadata" width={36} height={36} className="h-9 w-9 object-contain" />
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-0.5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "relative px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-300",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {link.name}
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-primary/[0.08] rounded-xl -z-10"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden xl:flex items-center gap-3">
              <ThemeToggle />
              
              {status === "loading" ? (
                 <div className="h-9 w-24 bg-muted animate-pulse rounded-xl" />
              ) : session ? (
                <div className="flex items-center gap-2">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      href="/dashboard"
                      className="bg-primary/10 text-primary px-5 py-2 rounded-xl text-[13px] font-semibold transition-all duration-300 hover:bg-primary/20 inline-block"
                    >
                      Dashboard
                    </Link>
                  </motion.div>
                  <Button variant="ghost" size="icon" onClick={() => signOut()} className="rounded-xl h-9 w-9 hover:bg-destructive/10 hover:text-destructive">
                    <LogOut size={16} />
                  </Button>
                </div>
              ) : (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/login"
                    className="bg-primary text-primary-foreground px-5 py-2 rounded-xl text-[13px] font-semibold transition-all duration-300 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 inline-block"
                  >
                    Login
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Mobile Toggle */}
            <div className="xl:hidden flex items-center gap-2">
              <ThemeToggle />
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="p-2 text-foreground rounded-xl hover:bg-muted transition-colors"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 xl:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-[85vw] max-w-sm bg-background z-50 flex flex-col xl:hidden border-l border-border shadow-2xl"
            >
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border">
                <div className="flex items-center">
                  <Image src="/images/symbollogo.png" alt="Annadata" width={32} height={32} className="h-8 w-8 object-contain" />
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-xl hover:bg-muted transition-colors"
                    aria-label="Close navigation menu"
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto py-3 sm:py-4 px-2 sm:px-3">
                {navLinks.map((link, index) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index, duration: 0.3 }}
                    >
                      <Link
                        href={link.href}
                        className={cn(
                          "flex items-center gap-3 px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl text-sm font-medium transition-all duration-200 mb-0.5",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-foreground/70 hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                        {link.name}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-3 sm:p-4 border-t border-border space-y-2"
              >
                <Link
                  href="/dashboard"
                  className="flex items-center justify-center w-full bg-primary text-primary-foreground py-3 sm:py-3.5 rounded-xl font-semibold text-sm shadow-md shadow-primary/20 transition-all hover:shadow-lg"
                >
                  Open Dashboard
                </Link>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
