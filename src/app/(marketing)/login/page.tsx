"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowRight, Smartphone, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  
  const [role, setRole] = useState<"FARMER" | "BUYER">("FARMER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1000);
    }
  };

  const handleDemoSignIn = (demoRole: "FARMER" | "BUYER") => {
    setRole(demoRole);
    setForm({
      email: demoRole === "FARMER" ? "farmer@annadata.in" : "buyer@annadata.in",
      password: "password123",
    });
  };

  const notifySocialMock = (provider: string) => {
    setError(`The ${provider} API is currently in sandbox mode. Use email/password.`);
  };

  return (
    <div className="min-h-screen w-full flex bg-background relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-primary/[0.03] rounded-full blur-[120px] pointer-events-none -translate-y-1/2 -translate-x-1/2 z-0" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-emerald-500/[0.04] rounded-full blur-[100px] pointer-events-none translate-y-1/2 translate-x-1/4 z-0" />

      {/* Left Pane: Visual Hero */}
      <div className="hidden lg:flex w-[48%] relative shrink-0 overflow-hidden bg-muted/20 m-4 rounded-[2.5rem] shadow-2xl z-10 border border-white/5">
        <AnimatePresence mode="wait">
          {role === "FARMER" ? (
            <motion.div
              key="farmer-bg"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 z-0"
            >
              <Image
                src="/images/farmer-bg.png"
                alt="Farming Fields"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
            </motion.div>
          ) : (
            <motion.div
              key="retailer-bg"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 z-0"
            >
              <Image
                src="/images/retailer-bg.png"
                alt="Retail Logistics"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative z-10 flex flex-col justify-end p-16 pb-20 text-white h-full w-full">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 shadow-lg shadow-black/20">
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span className="text-xs font-semibold tracking-wider uppercase text-emerald-50">Annadata Network</span>
            </div>
            
            <AnimatePresence mode="wait">
              {role === "FARMER" ? (
                <motion.div
                  key="farmer-text"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="text-4xl xl:text-5xl font-heading font-bold mb-5 leading-[1.1] tracking-tight text-white drop-shadow-md">
                    Empowering your farm's future.
                  </h1>
                  <p className="text-lg text-white/70 font-light leading-relaxed">
                    Join thousands of verified farmers sharing data, utilizing AI crop analysis, and connecting straight to high-value markets globally.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="buyer-text"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="text-4xl xl:text-5xl font-heading font-bold mb-5 leading-[1.1] tracking-tight text-white drop-shadow-md">
                    Supply chain excellence.
                  </h1>
                  <p className="text-lg text-white/70 font-light leading-relaxed">
                    Source premium, organic produce directly from verified growers. Manage procurement seamlessly from a single dashboard.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Right Pane: Form Module */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[420px] mx-auto space-y-8"
        >
          {/* Header & Logo */}
          <div className="text-center space-y-3">
            <Link href="/" className="inline-block transition-transform hover:scale-105 mb-2">
              <div className="bg-primary/10 p-3 rounded-2xl inline-flex shadow-sm shadow-primary/5">
                <Image src="/images/symbollogo.png" alt="Annadata Logo" width={48} height={48} className="h-10 w-10 object-contain drop-shadow-sm" />
              </div>
            </Link>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-foreground tracking-tight">Welcome back</h2>
            <p className="text-muted-foreground text-sm">Enter your credentials to access your account.</p>
          </div>

          {/* Quick Demo Login Tabs */}
          <div className="flex justify-center gap-2">
             <button
                type="button"
                onClick={() => handleDemoSignIn("FARMER")}
                className={`text-[13px] px-5 py-2 rounded-full font-semibold transition-colors border ${role === "FARMER" ? "bg-[#1b7b43] text-white border-transparent shadow-sm" : "bg-[#f8f9fa] border-gray-100 text-gray-500 hover:bg-gray-100"}`}
             >
                Farmer Example
             </button>
             <button
                type="button"
                onClick={() => handleDemoSignIn("BUYER")}
                className={`text-[13px] px-5 py-2 rounded-full font-semibold transition-colors border ${role === "BUYER" ? "bg-[#1b7b43] text-white border-transparent shadow-sm" : "bg-[#f8f9fa] border-gray-100 text-gray-500 hover:bg-gray-100"}`}
             >
                Retailer Example
             </button>
          </div>

          {/* Form */}
          <div className="bg-card/50 backdrop-blur-xl border border-border/60 rounded-3xl p-6 sm:p-8 shadow-xl shadow-black/[0.03]">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-muted-foreground/70 group-focus-within:text-primary transition-colors" />
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      required
                      className="pl-10 h-12 rounded-xl bg-background/50 border-border/60 focus-visible:ring-primary focus-visible:border-primary transition-all text-sm"
                      value={form.email}
                      onChange={(e) => { setForm({ ...form, email: e.target.value }); setError(""); }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</label>
                    <Link href="#" className="text-[11px] font-semibold text-primary hover:underline">Forgot password?</Link>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-muted-foreground/70 group-focus-within:text-primary transition-colors" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      required
                      className="pl-10 h-12 rounded-xl bg-background/50 border-border/60 focus-visible:ring-primary focus-visible:border-primary transition-all text-sm font-medium"
                      value={form.password}
                      onChange={(e) => { setForm({ ...form, password: e.target.value }); setError(""); }}
                    />
                  </div>
                </div>
              </div>

              <AnimatePresence mode="popLayout">
                {error && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-medium text-center">
                    {error}
                  </motion.div>
                )}
                {success && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-medium text-center flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Sign in successful...
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                disabled={loading || success}
                className="w-full h-12 rounded-xl text-[15px] font-bold shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 group"
              >
                {loading ? "Verifying Credentials..." : success ? "Redirecting..." : "Sign In"}
                {!loading && !success && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative py-6">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/80" /></div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-wider font-bold"><span className="bg-card px-3 text-muted-foreground/70">Or continue with</span></div>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
               <Button variant="outline" type="button" onClick={() => notifySocialMock("Google")} className="h-11 rounded-xl bg-background border-border/60 hover:bg-muted/50 transition-colors">
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
               </Button>
               <Button variant="outline" type="button" onClick={() => notifySocialMock("Facebook")} className="h-11 rounded-xl bg-background border-border/60 hover:bg-muted/50 transition-colors text-[#1877F2] hidden sm:flex">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
               </Button>
               <Button variant="outline" type="button" onClick={() => notifySocialMock("OTP / SMS")} className="h-11 rounded-xl bg-background border-border/60 hover:bg-muted/50 transition-colors text-foreground font-semibold gap-2">
                  <Smartphone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs">OTP</span>
               </Button>
            </div>
          </div>

          <div className="text-center">
            <span className="text-muted-foreground text-sm font-medium">
              Don't have an account?
            </span>
            <Link
              href="/register"
              className="ml-2 font-bold text-primary hover:underline transition-colors text-sm"
            >
              Create one for free
            </Link>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
