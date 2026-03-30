"use client";

import Link from "next/link";
import Image from "next/image";
import { Twitter, Facebook, Instagram, Mail, Phone, MapPin, Linkedin, Youtube } from "lucide-react";

const platformLinks = [
  { name: "AI Crop Analysis", href: "/crop-analysis" },
  { name: "Smart Irrigation", href: "/irrigation" },
  { name: "Mandi Prices", href: "/mandi-prices" },
  { name: "Warehouse Finder", href: "/warehouse" },
  { name: "Government Schemes", href: "/schemes" },
  { name: "AI Assistant", href: "/ai-assistant" },
  { name: "Market", href: "/market" },
];

const companyLinks = [
  { name: "About Us", href: "#" },
  { name: "Careers", href: "#" },
  { name: "Sustainability", href: "#" },
  { name: "Partner with Us", href: "#" },
  { name: "Contact", href: "#" },
];

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-foreground/[0.02]">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/[0.04] blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Main footer content */}
        <div className="py-10 sm:py-14 md:py-16 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1 space-y-4 sm:space-y-5">
            <Link href="/" className="flex items-center group w-fit">
              <Image src="/images/symbollogo.png" alt="Annadata" width={32} height={32} className="h-8 w-8 object-contain group-hover:scale-105 transition-transform duration-300" />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              India&apos;s most advanced AI-driven smart farming ecosystem — empowering farmers with technology.
            </p>
            <div className="flex gap-2 flex-wrap">
              {socialLinks.map((social, i) => {
                const Icon = social.icon;
                return (
                  <a
                    key={i}
                    href={social.href}
                    aria-label={social.label}
                    className="h-9 w-9 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 text-muted-foreground"
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Platform links */}
          <div>
            <h3 className="font-semibold text-xs sm:text-sm uppercase tracking-wider text-foreground/60 mb-4 sm:mb-5">
              Platform
            </h3>
            <ul className="space-y-2.5 sm:space-y-3">
              {platformLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="font-semibold text-xs sm:text-sm uppercase tracking-wider text-foreground/60 mb-4 sm:mb-5">
              Company
            </h3>
            <ul className="space-y-2.5 sm:space-y-3">
              {companyLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="font-semibold text-xs sm:text-sm uppercase tracking-wider text-foreground/60 mb-4 sm:mb-5">
              Contact
            </h3>
            <ul className="space-y-3 sm:space-y-3.5">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  AgriTech Hub, Agriculture Sector<br />New Delhi, India 110001
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span className="text-xs sm:text-sm text-muted-foreground">+91 1800-123-FARM</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span className="text-xs sm:text-sm text-muted-foreground">support@annadata.io</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-4 sm:py-5 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] sm:text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} Annadata Platform. All rights reserved.
          </p>
          <div className="flex gap-4 sm:gap-5">
            <Link href="#" className="text-[10px] sm:text-xs text-muted-foreground/60 hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-[10px] sm:text-xs text-muted-foreground/60 hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
