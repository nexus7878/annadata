"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Send, Sprout, Mic, Paperclip, Camera, Sparkles, MapPin, CloudRain } from "lucide-react";

const suggestions = [
  { icon: Sprout, title: "Fertilizer Guide", desc: "Best NPK ratios for current crop", query: "What fertilizer is best for wheat in early stages?" },
  { icon: Camera, title: "Disease Scanning", desc: "Upload leaf image for diagnosis", query: "Diagnose a disease from picture" },
  { icon: CloudRain, title: "Irrigation Schedule", desc: "Water needs based on weather", query: "How much water does sugarcane need this week?" },
  { icon: MapPin, title: "Mandi Analysis", desc: "Predict future crop rates", query: "What are the predicted tomato prices next month in Maharashtra?" },
];

const quickAddons = [
  "🌱 Crop Health Check", "💰 Live Mandi Rates", "🌦️ Weather Forecast", "📝 Subsidy Schemes"
];

export default function AiAssistantPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Namaste! I am Nivva AI. Your advanced agricultural intelligence engine. I can analyze crop diseases from images, provide real-time fertilizer schedules, forecast local weather impacts, and give you live market prices.\n\nHow can I help you grow better today?" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Based on the recent soil reports and weather patterns from your area, applying a 10:26:26 NPK fertilizer mixed with farmyard manure will yield the best results. Ensure soil moisture is above 60% before application.",
        },
      ]);
    }, 1500);
  };

  return (
    <div className="container px-4 md:px-6 py-4 md:py-8 mx-auto h-[calc(100vh-80px)] max-h-[1000px] flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-3 mb-6"
      >
        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
           <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-heading font-bold mb-0.5">Nivva AI</h1>
          <p className="text-sm text-muted-foreground">Supercharged Agri-Intelligence • Online 24/7</p>
        </div>
      </motion.div>

      <div className="flex-1 grid lg:grid-cols-4 gap-6 min-h-0">
        {/* Chat Interface */}
        <Card className="lg:col-span-3 h-full flex flex-col border-border/50 shadow-sm overflow-hidden relative bg-card/50 backdrop-blur-xl">
          {/* Watermark */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.015] dark:opacity-[0.03]">
            <Sparkles className="h-96 w-96 text-primary" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 relative z-10 scrollbar-thin">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                <div className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center mt-1 shadow-sm ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                }`}>
                  {msg.role === "user" ? <User size={15} /> : <Sparkles size={15} />}
                </div>

                <div className={`rounded-2xl px-4 py-3 shadow-sm ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                    : "bg-background border border-border/50 text-foreground rounded-tl-sm"
                }`}>
                  <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </motion.div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3 max-w-[85%] mr-auto"
              >
                <div className="h-8 w-8 shrink-0 rounded-full bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mt-1 shadow-sm">
                  <Sparkles size={15} />
                </div>
                <div className="bg-background border border-border/50 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5 h-10 shadow-sm">
                  <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="h-1.5 w-1.5 bg-primary/80 rounded-full" />
                  <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }} className="h-1.5 w-1.5 bg-primary/60 rounded-full" />
                  <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }} className="h-1.5 w-1.5 bg-primary/40 rounded-full" />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Addons */}
          <div className="px-4 pb-2 relative z-10">
             <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {quickAddons.map((addon, aIdx) => (
                  <button key={aIdx} onClick={() => setInput(addon)} className="shrink-0 whitespace-nowrap text-[11px] font-medium px-3 py-1.5 rounded-full bg-muted/50 border border-border/50 hover:bg-muted hover:border-primary/30 transition-all text-muted-foreground hover:text-foreground">
                    {addon}
                  </button>
                ))}
             </div>
          </div>

          {/* Input area */}
          <div className="p-3 sm:p-4 bg-background border-t border-border/50 relative z-10 rounded-b-xl">
            <div className="flex gap-1.5 sm:gap-2 items-center">
              
              {/* Addons (Attachments/Camera) */}
              <div className="flex gap-0.5 sm:gap-1 shrink-0">
                <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-[42px] sm:w-[42px] rounded-full text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors">
                  <Paperclip size={18} />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-[42px] sm:w-[42px] rounded-full text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors hidden sm:flex">
                  <Camera size={18} />
                </Button>
              </div>

              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask Nivva AI anything..."
                  className="w-full h-10 sm:h-[46px] rounded-full pl-4 pr-10 border-border/60 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary text-sm shadow-sm bg-muted/20"
                />
                <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-9 sm:w-9 rounded-full text-muted-foreground hover:text-primary transition-colors">
                  <Mic size={16} />
                </Button>
              </div>

              <motion.div whileTap={{ scale: 0.95 }} className="shrink-0 ml-0.5 sm:ml-1">
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="h-10 w-10 sm:h-[46px] sm:w-[46px] rounded-full p-0 shadow-sm shadow-primary/20 bg-primary hover:bg-primary/90 transition-all"
                >
                  <Send size={16} className={input.trim() ? "translate-x-0.5 -translate-y-0.5 transition-transform" : ""} />
                </Button>
              </motion.div>
            </div>
          </div>
        </Card>

        {/* Sidebar Suggestions */}
        <div className="hidden lg:flex flex-col gap-4">
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 shadow-sm">
             <h3 className="font-semibold text-[13px] text-primary flex items-center gap-2 mb-2">
               <Sparkles size={16} /> Welcome to Nivva
             </h3>
             <p className="text-[12px] text-muted-foreground leading-relaxed">
               Nivva AI is powered by specialized agricultural datasets. Upload images of diseased crops or ask for precision farming advice.
             </p>
          </div>

          <h3 className="font-semibold text-[11px] text-muted-foreground uppercase tracking-wider mt-2 mb-1 pl-1">Capability Add-ons</h3>

          {suggestions.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.button
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setInput(s.query)}
                className="bg-card border border-border/60 hover:border-primary/40 text-left p-4 rounded-xl transition-all duration-300 group hover:shadow-md hover:shadow-primary/5 flex items-start gap-4"
              >
                <div className="h-10 w-10 shrink-0 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[13px] text-foreground group-hover:text-primary transition-colors truncate">{s.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">{s.desc}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
