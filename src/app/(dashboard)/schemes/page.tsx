"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/section-heading";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Landmark, Sun, Tractor, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";

const schemes = [
  {
    title: "PM-KISAN Samman Nidhi",
    desc: "Income support of ₹6,000/year in three equal installments to all landholding farmer families.",
    icon: Landmark, color: "text-blue-500", bg: "bg-blue-500/8",
    eligibility: ["Must own cultivable land", "Valid Aadhaar", "Bank Account linked to Aadhaar"],
  },
  {
    title: "PM KUSUM (Solar Pumps)",
    desc: "Subsidy of up to 60% for standalone solar agriculture pumps to reduce diesel reliance.",
    icon: Sun, color: "text-orange-500", bg: "bg-orange-500/8",
    eligibility: ["Individual farmer", "Water source available", "Micro irrigation system preferred"],
  },
  {
    title: "PM Fasal Bima Yojana",
    desc: "Comprehensive crop insurance from pre-sowing to post-harvest losses against natural risks.",
    icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-500/8",
    eligibility: ["All farmers growing notified crops", "Sharecroppers and tenant farmers included"],
  },
  {
    title: "Agricultural Mechanization",
    desc: "Financial assistance for purchasing tractors, power tillers, and specialized machinery.",
    icon: Tractor, color: "text-violet-500", bg: "bg-violet-500/8",
    eligibility: ["Small and marginal farmers", "Women, SC/ST farmers get higher subsidy"],
  },
];

export default function SchemesPage() {
  return (
    <div className="container px-4 md:px-6 py-12 md:py-16 mx-auto min-h-screen">
      <SectionHeading
        title="Government Schemes"
        subtitle="Discover, check eligibility, and apply for agricultural subsidies directly through Annadata."
        alignment="center"
      />

      {/* Eligibility CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-lg mx-auto mb-14"
      >
        <div className="bg-primary/[0.04] border border-primary/10 rounded-2xl p-6 text-center">
          <h3 className="font-semibold text-base mb-2">Check Your Eligibility</h3>
          <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
            Update your profile to let our AI match you with the best financial assistance programs.
          </p>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button className="rounded-xl px-6 shadow-sm shadow-primary/10">Update Profile</Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Scheme cards */}
      <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
        {schemes.map((scheme, i) => {
          const Icon = scheme.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.08 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Card className="h-full flex flex-col border-border/60 transition-all duration-400 group card-hover">
                <CardHeader className="pb-3">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-3 ${scheme.bg} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-5 w-5 ${scheme.color}`} />
                  </div>
                  <CardTitle className="text-lg">{scheme.title}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                    {scheme.desc}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="pt-3 border-t border-border/50">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">Eligibility</p>
                    <ul className="space-y-2">
                      {scheme.eligibility.map((req, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-foreground/70">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full rounded-xl group-hover:bg-primary group-hover:text-white transition-colors duration-300" variant="outline">
                    Apply Now <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
