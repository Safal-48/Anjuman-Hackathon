"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Brain, Bot } from "lucide-react";

interface AIOrbProps {
  status?: "idle" | "thinking" | "active";
  size?: "sm" | "md" | "lg";
}

export function AIOrb({ status = "idle", size = "md" }: AIOrbProps) {
  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-14 w-14",
    lg: "h-20 w-20",
  };

  const isThinking = status === "thinking";

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses[size]}`}>
      {/* Outer ambient glow pulse */}
      <motion.div
        animate={{
          scale: isThinking ? [1, 1.25, 1] : [1, 1.1, 1],
          opacity: isThinking ? [0.4, 0.8, 0.4] : [0.3, 0.5, 0.3],
        }}
        transition={{
          repeat: Infinity,
          duration: isThinking ? 1.5 : 3,
          ease: "easeInOut",
        }}
        className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 via-violet-500 to-emerald-500 blur-md pointer-events-none"
      />

      {/* Rotating Cyber Ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: isThinking ? 4 : 12,
          ease: "linear",
        }}
        className="absolute inset-0 rounded-full border border-cyan-400/40 border-dashed"
      />

      {/* Core Orb Center */}
      <div className="relative h-full w-full rounded-full bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 border border-cyan-400/50 flex items-center justify-center shadow-glow-sm overflow-hidden">
        <motion.div
          animate={{
            scale: isThinking ? [0.85, 1.1, 0.85] : [0.95, 1.05, 0.95],
          }}
          transition={{
            repeat: Infinity,
            duration: isThinking ? 1.2 : 2.5,
            ease: "easeInOut",
          }}
          className="flex items-center justify-center text-cyan-300"
        >
          {isThinking ? (
            <Sparkles className="h-5 w-5 animate-spin" />
          ) : (
            <Bot className="h-6 w-6 text-cyan-400" />
          )}
        </motion.div>
      </div>
    </div>
  );
}
