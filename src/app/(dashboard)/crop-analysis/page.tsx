"use client";

import { motion, Variants } from "framer-motion";
import { SectionHeading } from "@/components/section-heading";
import { CropAnalysisPanel } from "@/components/dashboard/crop-analysis-panel";
import { Scan, Zap, BrainCircuit, Camera, UploadCloud, FileSearch } from "lucide-react";

const features = [
  { icon: Scan, title: "High Accuracy", desc: "Trained on millions of crop images across 50+ crop varieties.", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { icon: Zap, title: "Instant Results", desc: "Get real-time diagnostic reports within seconds of uploading.", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  { icon: BrainCircuit, title: "Actionable Advice", desc: "Receive immediate treatment and fertilizer recommendations.", color: "text-violet-500", bg: "bg-violet-500/10", border: "border-violet-500/20" },
];

const howToSteps = [
  { num: "01", title: "Capture Image", desc: "Take a clear photo of the affected leaf or crop.", icon: Camera },
  { num: "02", title: "Upload & Scan", desc: "Drag and drop the image into our AI engine.", icon: UploadCloud },
  { num: "03", title: "Get Diagnosis", desc: "Receive instant disease detection & treatment steps.", icon: FileSearch },
];

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { delay: 0.1 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function CropAnalysisPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background styling elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="container px-4 md:px-6 py-16 md:py-24 mx-auto">
        <SectionHeading
          badge="AI Diagnostics"
          title="AI Crop Analysis"
          subtitle="Upload photos of your crops to instantly detect diseases, pest infestations, and nutrient deficiencies with 98% accuracy."
          alignment="center"
        />

        <div className="max-w-6xl mx-auto mt-12 grid lg:grid-cols-12 gap-10 items-start">
          
          {/* Main Panel Column */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-8 space-y-8"
          >
            {/* The actual interactive tool */}
            <div className="bg-gradient-to-br from-card to-card/50 rounded-2xl border border-border/50 shadow-2xl p-1 relative overflow-hidden backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-primary/10 pointer-events-none" />
              <CropAnalysisPanel />
            </div>

            {/* Feature Highlights beneath the scanner */}
            <div className="grid sm:grid-cols-3 gap-4">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={i}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={itemVariants}
                    className={`bg-card/50 backdrop-blur-md border ${feature.border} rounded-xl p-5 hover:-translate-y-1 transition-transform duration-300 shadow-sm`}
                  >
                    <div className={`h-10 w-10 ${feature.bg} rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className={`h-5 w-5 ${feature.color}`} />
                    </div>
                    <h4 className="font-semibold text-sm mb-1.5">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* How To Use Guide Column */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-4"
          >
            <div className="sticky top-24 bg-card/60 backdrop-blur-2xl border border-border/80 rounded-2xl p-6 md:p-8 shadow-xl">
              <div className="mb-6">
                <h3 className="text-xl font-bold font-heading mb-2">How it works</h3>
                <p className="text-sm text-muted-foreground">Follow these simple steps to get an accurate diagnosis of your crop&apos;s health.</p>
              </div>

              <div className="space-y-6 relative">
                {/* Connecting Line */}
                <div className="absolute left-6 top-10 bottom-10 w-px bg-border/80" />

                {howToSteps.map((step, idx) => {
                  const Icon = step.icon;
                  return (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + idx * 0.15 }}
                      className="relative flex gap-5 items-start"
                    >
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-background border-2 border-primary/20 flex items-center justify-center shadow-md shadow-primary/5 text-primary">
                          <Icon className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="pt-1.5 pb-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-sm">STEP {step.num}</span>
                        </div>
                        <h4 className="font-bold text-sm text-foreground mb-1">{step.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Tips Section */}
              <div className="mt-8 pt-6 border-t border-border/50">
                <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex items-start gap-3">
                  <span className="text-lg">💡</span>
                  <div>
                    <h5 className="text-xs font-bold text-foreground mb-1">Pro Tip</h5>
                    <p className="text-[11px] text-muted-foreground">Ensure your photo is well-lit, in focus, and clearly shows the affected area of the leaf for the most accurate AI prediction.</p>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
