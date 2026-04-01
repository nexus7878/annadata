"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Search,
  ShoppingCart,
  Bell,
  User,
  Mic,
  ChevronDown,
  MapPin,
} from "lucide-react";

interface MarketHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
  location: string;
  onLocationChange: (loc: string) => void;
  cartCount?: number;
}

export function MarketHeader({
  searchQuery,
  onSearchChange,
  onSearch,
  location,
  onLocationChange,
  cartCount = 0,
}: MarketHeaderProps) {
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [notificationCount] = useState(2);

  const locations = [
    "Auto Detect",
    "Pan India",
    "Delhi NCR",
    "Mumbai",
    "Karnal, Haryana",
    "Indore, MP",
    "Jaipur, Rajasthan",
    "Ludhiana, Punjab",
  ];

  const handleVoiceSearch = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        (window as Record<string, unknown>).webkitSpeechRecognition || (window as Record<string, unknown>).SpeechRecognition;
      const recognition = new (SpeechRecognition as { new(): { lang: string; continuous: boolean; interimResults: boolean; onresult: (event: { results: { 0: { 0: { transcript: string } } } }) => void; start: () => void } })();
      recognition.lang = "hi-IN";
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onSearchChange(transcript);
      };
      recognition.start();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-6"
    >
      {/* Logo / Title */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center justify-center">
          <Image 
            src="/symbollogo.png" 
            alt="Annadata Logo" 
            width={36} 
            height={36} 
            className="h-10 w-10 object-contain drop-shadow-sm"
          />
        </div>
        <div>
          <h1 className="text-xl font-heading font-bold text-foreground tracking-tight">
            Krishi Bazaar
          </h1>
          <p className="text-[11px] text-muted-foreground -mt-0.5 font-medium">
            Seeds • Fertilizers • Tools & More
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex-1 flex gap-2 max-w-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search seeds, fertilizers, pesticides, tools..."
            className="pl-10 pr-12 h-11 rounded-xl bg-card border-border/60 focus:border-primary/40 transition-colors"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
          />
          <button
            onClick={handleVoiceSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
            title="Voice Search (Hindi supported)"
          >
            <Mic className="h-3.5 w-3.5 text-primary" />
          </button>
        </div>
        <Button
          onClick={onSearch}
          className="h-11 rounded-xl px-6 shadow-sm shadow-primary/10"
        >
          Search
        </Button>
      </div>

      {/* Deliver To */}
      <div className="relative shrink-0">
        <button
          onClick={() => setShowLocationDropdown(!showLocationDropdown)}
          className="flex items-center gap-2 h-11 px-4 rounded-xl bg-card border border-border/60 hover:border-primary/30 transition-colors text-sm"
        >
          <MapPin className="h-4 w-4 text-primary" />
          <div className="text-left">
            <span className="text-[10px] text-muted-foreground block leading-none">Deliver to</span>
            <span className="text-xs font-semibold max-w-[100px] truncate block">{location}</span>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
        {showLocationDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="absolute top-full mt-1 right-0 w-52 bg-card border border-border/60 rounded-xl shadow-xl z-50 py-1 overflow-hidden"
          >
            {locations.map((loc) => (
              <button
                key={loc}
                onClick={() => {
                  onLocationChange(loc);
                  setShowLocationDropdown(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-muted/50 transition-colors flex items-center gap-2 ${
                  location === loc
                    ? "text-primary font-medium bg-primary/5"
                    : "text-foreground"
                }`}
              >
                {loc === "Auto Detect" && (
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                )}
                {loc}
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Cart & Notification */}
      <div className="flex items-center gap-2 shrink-0">
        <button className="relative h-10 w-10 rounded-xl bg-card border border-border/60 hover:border-primary/30 flex items-center justify-center transition-colors">
          <Bell className="h-4 w-4 text-muted-foreground" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4.5 w-4.5 min-w-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>
        <button className="relative h-10 w-10 rounded-xl bg-card border border-border/60 hover:border-amber-500/30 flex items-center justify-center transition-colors">
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4.5 w-4.5 min-w-[18px] bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
        <button className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20">
          <User className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
