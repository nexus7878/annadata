"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Upload, ScanLine, X, ImageIcon, CheckCircle2, ShieldAlert, Sparkles,
  FlaskConical, Beaker, Leaf, AlertTriangle, ArrowRight, Droplets,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FertilizerRec {
  name: string;
  type: string;
  dosage: string;
  timing: string;
  method: string;
  icon: typeof FlaskConical;
  color: string;
  bg: string;
  border: string;
}

const fertilizerRecommendations: Record<string, {
  npk: string;
  fertilizers: FertilizerRec[];
  soilTip: string;
  warning: string;
}> = {
  "Early Leaf Blight": {
    npk: "Increase Potassium (K) — reduce excess Nitrogen (N)",
    fertilizers: [
      {
        name: "Potassium Chloride (MOP)",
        type: "Potassic",
        dosage: "25–30 kg/acre",
        timing: "Apply immediately after disease detection",
        method: "Side-dressing near root zone, followed by light irrigation",
        icon: FlaskConical,
        color: "text-violet-400",
        bg: "bg-violet-500/10",
        border: "border-violet-500/20",
      },
      {
        name: "Copper Oxychloride (Blitox-50)",
        type: "Fungicide + Micronutrient",
        dosage: "2.5–3g per litre of water",
        timing: "Foliar spray every 7–10 days until symptoms subside",
        method: "Spray evenly on upper and lower leaf surfaces early morning",
        icon: Droplets,
        color: "text-cyan-400",
        bg: "bg-cyan-500/10",
        border: "border-cyan-500/20",
      },
      {
        name: "Neem Cake (Organic)",
        type: "Organic Soil Amendment",
        dosage: "100–150 kg/acre",
        timing: "Apply 2 weeks after primary treatment",
        method: "Broadcast and mix into top 2 inches of soil",
        icon: Leaf,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
      },
    ],
    soilTip: "Test soil pH — Early Blight thrives in slightly acidic soil (pH 5.5–6.0). Lime application may help raise pH to 6.5–7.0 for better plant immunity.",
    warning: "Avoid excessive nitrogen (urea) during active infection — it promotes lush foliage growth that increases disease spread.",
  },
};

export function CropAnalysisPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<{ disease: string; probability: number; action: string } | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      resetState();
    }
  };

  const handleSimulateScan = () => {
    if (!file) return;
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setResult({
        disease: "Early Leaf Blight",
        probability: 94.2,
        action: "Apply copper-based fungicide to affected areas. Ensure proper spacing between plants to improve air circulation and reduce humidity.",
      });
    }, 3000);
  };

  const resetState = () => {
    setIsScanning(false);
    setResult(null);
  };

  const fertData = result ? fertilizerRecommendations[result.disease] : null;

  return (
    <div className="bg-card/40 backdrop-blur-2xl rounded-2xl p-6 sm:p-8 flex flex-col h-full border border-white/5">
      <div className="mb-6">
        <h2 className="text-lg font-bold flex items-center gap-2 mb-1">
          <Sparkles className="h-5 w-5 text-emerald-400" />
          AI Diagnostic Engine
        </h2>
        <p className="text-xs text-muted-foreground">Upload an image of a leaf or crop to detect diseases and get fertilizer recommendations.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 flex-1">
        {/* Upload Area */}
        <div
          className={`relative overflow-hidden border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 transition-all duration-300 ${
            file
              ? "border-emerald-500/30 bg-emerald-500/[0.02]"
              : "border-border/60 hover:border-emerald-500/30 hover:bg-emerald-500/[0.02] cursor-pointer"
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => !file && document.getElementById("file-upload")?.click()}
        >
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

          {file ? (
            <div className="text-center relative z-10 w-full" onClick={(e) => e.stopPropagation()}>
              <div className="h-16 w-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 relative shadow-lg shadow-emerald-500/5 border border-emerald-500/20">
                <ImageIcon className="h-7 w-7 text-emerald-400" />
                <button
                  onClick={() => { setFile(null); resetState(); }}
                  className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 shadow-md hover:scale-110 transition-transform"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <p className="font-medium text-sm truncate max-w-[200px] mx-auto mb-6 text-foreground/90">{file.name}</p>
              <Button
                onClick={handleSimulateScan}
                disabled={isScanning || result !== null}
                className="w-full rounded-xl h-11 bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 font-bold tracking-wide"
              >
                {isScanning ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                      className="mr-2"
                    >
                      <ScanLine className="h-4 w-4" />
                    </motion.div>
                    Analyzing Image...
                  </>
                ) : result ? (
                  "Analysis Complete"
                ) : (
                  "Run AI Analysis"
                )}
              </Button>
            </div>
          ) : (
            <div className="text-center relative z-10 pointer-events-none">
              <div className="h-16 w-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-border/50">
                <Upload className="h-7 w-7 text-muted-foreground/70" />
              </div>
              <p className="font-semibold text-sm mb-1.5 text-foreground/80">Click or drag image here</p>
              <p className="text-xs text-muted-foreground/60">Supports JPG, PNG, WEBP (Max 5MB)</p>
            </div>
          )}

          <input
            id="file-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setFile(e.target.files[0]);
                resetState();
              }
            }}
          />

          {/* Scanning Overlay */}
          {isScanning && (
            <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
              <div className="absolute inset-0 bg-emerald-500/10" />
              <motion.div
                initial={{ top: "-10%" }}
                animate={{ top: "110%" }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-1 bg-emerald-400 shadow-[0_0_20px_4px_rgba(52,211,153,0.5)]"
              />
            </div>
          )}
        </div>

        {/* Results Area */}
        <div className="bg-black/20 rounded-2xl p-6 border border-white/5 relative overflow-hidden flex flex-col shadow-inner">
          <h4 className="font-semibold text-[10px] uppercase tracking-widest text-muted-foreground/80 mb-5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary/50" />
            Analysis Results
          </h4>

          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1 flex flex-col"
              >
                {/* Disease Detection Card */}
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-5 mb-5 box-border">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2 text-orange-400">
                      <ShieldAlert className="h-4 w-4" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Disease Detected</span>
                    </div>
                    <div className="bg-orange-500/20 border border-orange-500/30 text-orange-400 px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center gap-1">
                      <ScanLine className="h-3 w-3" />
                      {result.probability}% Match
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground font-heading">{result.disease}</h3>
                  <div className="mt-4">
                    <div className="flex justify-between text-[9px] text-orange-400/70 mb-1.5 font-medium uppercase tracking-wider">
                      <span>AI Confidence Score</span>
                      <span>High</span>
                    </div>
                    <div className="h-1.5 w-full bg-background/50 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.probability}%` }}
                        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-orange-500/50 to-orange-400 rounded-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Treatment Card */}
                <div className="bg-card/30 border border-border/40 rounded-xl p-5">
                  <p className="text-xs font-semibold mb-2.5 flex items-center gap-2 text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                    Recommended Treatment
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {result.action}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center opacity-40"
              >
                <div className="relative mb-4">
                  <ScanLine className="h-12 w-12 text-muted-foreground" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
                </div>
                <p className="text-xs text-muted-foreground max-w-[180px]">
                  Awaiting image upload to generate diagnostic report.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ============================================
          FERTILIZER RECOMMENDATION SECTION
          Shows after disease is detected
          ============================================ */}
      <AnimatePresence>
        {result && fertData && (
          <motion.div
            key="fertilizer-section"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 24 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 mb-5"
            >
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500/15 to-violet-500/5 border border-violet-500/20 flex items-center justify-center">
                <FlaskConical className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <h3 className="text-base font-bold font-heading flex items-center gap-2">
                  Fertilizer Recommendation
                  <span className="text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">AI Generated</span>
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Based on detected disease: <span className="font-semibold text-orange-400">{result.disease}</span>
                </p>
              </div>
            </motion.div>

            {/* NPK Summary Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-gradient-to-r from-primary/5 via-primary/8 to-primary/5 border border-primary/15 rounded-xl p-4 mb-5 flex items-center gap-3"
            >
              <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                <Beaker className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-primary/70 mb-0.5">NPK Strategy</p>
                <p className="text-xs font-medium text-foreground">{fertData.npk}</p>
              </div>
            </motion.div>

            {/* Fertilizer Cards */}
            <div className="grid sm:grid-cols-3 gap-3 mb-5">
              {fertData.fertilizers.map((fert, i) => {
                const Icon = fert.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ delay: 0.5 + i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className={`${fert.bg} border ${fert.border} rounded-xl p-4 hover:-translate-y-1 transition-all duration-300 group`}
                  >
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className={`p-1.5 rounded-lg ${fert.bg} border ${fert.border}`}>
                        <Icon className={`h-4 w-4 ${fert.color}`} />
                      </div>
                      <div>
                        <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">{fert.type}</p>
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-foreground mb-3 leading-tight">{fert.name}</h4>

                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60 w-14 shrink-0 pt-px">Dosage</span>
                        <p className="text-[11px] text-foreground/80 font-medium">{fert.dosage}</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60 w-14 shrink-0 pt-px">When</span>
                        <p className="text-[11px] text-foreground/80 font-medium">{fert.timing}</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60 w-14 shrink-0 pt-px">How</span>
                        <p className="text-[11px] text-foreground/80 font-medium">{fert.method}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Soil Tip + Warning */}
            <div className="grid sm:grid-cols-2 gap-3">
              {/* Soil Tip */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4 flex items-start gap-3"
              >
                <div className="p-1.5 rounded-lg bg-emerald-500/10 shrink-0 mt-0.5">
                  <Leaf className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">Soil Health Tip</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{fertData.soilTip}</p>
                </div>
              </motion.div>

              {/* Warning */}
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-4 flex items-start gap-3"
              >
                <div className="p-1.5 rounded-lg bg-amber-500/10 shrink-0 mt-0.5">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-1">Important Warning</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{fertData.warning}</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
