"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  alignment?: "left" | "center" | "right";
  className?: string;
  badge?: string;
}

export function SectionHeading({
  title,
  subtitle,
  alignment = "center",
  className,
  badge,
}: SectionHeadingProps) {
  const alignClass =
    alignment === "left"
      ? "items-start text-left"
      : alignment === "right"
      ? "items-end text-right"
      : "items-center text-center";

  return (
    <div className={cn(`flex flex-col ${alignClass} mb-10 sm:mb-14 md:mb-20`, className)}>
      {badge && (
        <motion.span
          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-primary/8 text-primary font-medium text-[10px] sm:text-xs mb-4 sm:mb-5 inline-flex items-center gap-1.5 tracking-wide uppercase"
        >
          <span className="h-1 w-1 rounded-full bg-primary" />
          {badge}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-3 sm:mb-4 md:mb-5 max-w-3xl leading-[1.1]"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed font-light px-2 sm:px-0"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
