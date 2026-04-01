"use client";

import Link from "next/link";
import Image from "next/image";
import { Twitter, Facebook, Instagram, Mail, Phone, MapPin, Linkedin, Youtube } from "lucide-react";

const companyLinks = [
  { name: "About Us", href: "/#overview" },
  { name: "Careers", href: "https://linkedin.com/company/annadata/jobs" },
  { name: "Sustainability", href: "/#benefits" },
  { name: "Partner with Us", href: "mailto:partners@annadata.io" },
  { name: "Contact", href: "mailto:support@annadata.io" },
];

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com/annadata", label: "Twitter" },
  { icon: Facebook, href: "https://facebook.com/annadata", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com/annadata", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com/company/annadata", label: "LinkedIn" },
  { icon: Youtube, href: "https://youtube.com/annadata", label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-foreground/[0.02]">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/[0.04] blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Main footer content */}
        <div className="py-10 sm:py-14 md:py-16 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1 space-y-4 sm:space-y-5">
            <Link href="/" className="flex items-center group w-fit">
              <Image src="/symbollogo.png" alt="Annadata" width={40} height={40} className="h-10 w-10 object-contain group-hover:scale-105 transition-transform duration-300 dark:brightness-200" />
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
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="h-9 w-9 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 text-muted-foreground"
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </a>
                );
              })}
            </div>
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
            <Link href="/privacy" className="text-[10px] sm:text-xs text-muted-foreground/60 hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-[10px] sm:text-xs text-muted-foreground/60 hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
