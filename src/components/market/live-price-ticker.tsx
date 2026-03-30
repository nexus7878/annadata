"use client";

import { useState } from "react";
import { Tag, Truck, ShieldCheck, Percent } from "lucide-react";

interface DealItem {
  label: string;
  highlight: string;
  icon: React.ReactNode;
}

const deals: DealItem[] = [
  { label: "Free Delivery on orders above ₹999", highlight: "FREE DELIVERY", icon: <Truck className="h-3.5 w-3.5" /> },
  { label: "Flat 20% off on all Organic Seeds", highlight: "20% OFF", icon: <Percent className="h-3.5 w-3.5" /> },
  { label: "Genuine Products • Direct from Manufacturers", highlight: "100% GENUINE", icon: <ShieldCheck className="h-3.5 w-3.5" /> },
  { label: "Kisan Credit Card accepted • EMI Available", highlight: "EMI", icon: <Tag className="h-3.5 w-3.5" /> },
  { label: "Bulk Order Discounts for Farmer Groups (FPOs)", highlight: "BULK DEALS", icon: <Percent className="h-3.5 w-3.5" /> },
  { label: "Season Sale: Up to 35% off on Fertilizers", highlight: "SEASON SALE", icon: <Tag className="h-3.5 w-3.5" /> },
  { label: "Same-Day Dispatch on 500+ products", highlight: "FAST SHIPPING", icon: <Truck className="h-3.5 w-3.5" /> },
  { label: "Expert Agronomist Advice on every product", highlight: "EXPERT HELP", icon: <ShieldCheck className="h-3.5 w-3.5" /> },
];

export function LivePriceTicker() {
  const [paused, setPaused] = useState(false);

  const doubled = [...deals, ...deals];

  return (
    <div
      className="w-full overflow-hidden bg-gradient-to-r from-emerald-900/90 via-green-800/90 to-emerald-900/90 backdrop-blur-lg border-b border-emerald-700/30"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative py-2.5">
        <div
          className={`flex gap-8 whitespace-nowrap ${paused ? "" : "animate-ticker"}`}
          style={{ width: "max-content" }}
        >
          {doubled.map((item, i) => (
            <div
              key={i}
              className="inline-flex items-center gap-2.5 px-4 py-1 rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-default"
            >
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm bg-amber-400/20 text-amber-300">
                {item.icon}
                {item.highlight}
              </span>
              <span className="text-sm font-medium text-emerald-100">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes ticker-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-ticker {
          animation: ticker-scroll 45s linear infinite;
        }
      `}</style>
    </div>
  );
}
