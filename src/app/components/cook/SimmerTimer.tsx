"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Zap, AlertTriangle } from "lucide-react";
import { useAudio } from "@/app/hooks/useAudio";

interface SimmerTimerProps {
    heat: number; // 0, 1, 2
    onComplete: () => void;
    onRicePrompt: () => void;
    riceStarted: boolean;
}

export default function SimmerTimer({ heat, onComplete, onRicePrompt, riceStarted }: SimmerTimerProps) {
    const [timeLeft, setTimeLeft] = useState(30);
    const [isFinishing, setIsFinishing] = useState(false);
    const [promptedRice, setPromptedRice] = useState(false);
    const { playHover, playSuccess } = useAudio();

    const multipliers = [1, 2, 4.5];
    const currentSpeed = multipliers[heat];

    useEffect(() => {
        if (timeLeft <= 10 && !promptedRice && !riceStarted) {
            setPromptedRice(true);
            onRicePrompt();
        }

        if (timeLeft <= 0) {
            if (!isFinishing) {
                setIsFinishing(true);
                playSuccess();
                setTimeout(onComplete, 1000);
            }
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev > 0) playHover(); // Subtle tick
                return Math.max(0, prev - 1);
            });
        }, 1000 / currentSpeed);

        return () => clearInterval(interval);
    }, [currentSpeed, timeLeft, onComplete, isFinishing, playHover, playSuccess, promptedRice, onRicePrompt, riceStarted]);

    const progress = ((30 - timeLeft) / 30) * 100;

    return (
        <div className="relative flex flex-col items-center">
            {/* Immersive Holographic Ring */}
            <div className="relative w-56 h-56 md:w-80 md:h-80 flex items-center justify-center">
                {/* Decorative Grid Circles */}
                <div className="absolute inset-0 border border-white/5 rounded-full" />
                <div className="absolute inset-4 border border-white/5 rounded-full" />

                <svg className="absolute inset-0 w-full h-full -rotate-90">
                    {/* Background Track */}
                    <circle
                        cx="50%"
                        cy="50%"
                        r="45%"
                        fill="transparent"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="8"
                        strokeDasharray="4 4"
                    />
                    {/* Primary Progress */}
                    <motion.circle
                        cx="50%"
                        cy="50%"
                        r="45%"
                        fill="transparent"
                        stroke={heat === 2 ? "var(--color-palm-oil)" : "var(--color-cyber-gold)"}
                        strokeWidth="8"
                        strokeDasharray="283"
                        animate={{ strokeDashoffset: 283 - (283 * progress) / 100 }}
                        strokeLinecap="round"
                        className="drop-shadow-[0_0_15px_rgba(255,184,0,0.4)] transition-colors duration-500"
                    />
                </svg>

                {/* Central Display */}
                <div className="flex flex-col items-center z-10">
                    <motion.div
                        key={timeLeft}
                        initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        className="text-7xl md:text-9xl font-mono font-black text-salone-white cyber-glow-text"
                    >
                        {Math.ceil(timeLeft)}
                    </motion.div>
                    <div className="flex items-center gap-2 mt-[-10px]">
                        <Clock className="w-4 h-4 text-terracotta" />
                        <span className="text-[10px] font-black tracking-[0.5em] text-terracotta uppercase">heritage_val</span>
                    </div>

                    {/* Rice Status mini-hud */}
                    {riceStarted && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 flex items-center gap-2 px-3 py-1 bg-cyber-gold/20 border border-cyber-gold/40 rounded-full"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-cyber-gold animate-pulse" />
                            <span className="text-[8px] font-black text-cyber-gold uppercase tracking-widest">Rice_Synthesis_Active</span>
                        </motion.div>
                    )}
                </div>

                {/* Binary Floating Bits (Decorative) */}
                <div className="absolute inset-0 pointer-events-none hologram-flicker">
                    <div className="absolute top-10 left-10 text-[8px] font-mono text-cyber-neon/40">10110</div>
                    <div className="absolute bottom-10 right-10 text-[8px] font-mono text-cyber-neon/40">00101</div>
                </div>
            </div>

            {/* Control Status Console */}
            <motion.div
                animate={{
                    borderColor: heat === 2 ? "rgba(255,69,0,0.5)" : "rgba(255,184,0,0.5)",
                    backgroundColor: heat === 2 ? "rgba(255,69,0,0.1)" : "rgba(255,184,0,0.1)"
                }}
                className="mt-12 px-10 py-4 rounded-2xl border border-cyber-gold/30 flex items-center gap-8 clay-glass"
            >
                <div className="flex flex-col">
                    <span className="text-[8px] font-black text-white/40 uppercase tracking-tighter">Engine_Load</span>
                    <div className="flex gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className={`w-3 h-1 rounded-full ${i <= heat * 2 ? (heat === 2 ? "bg-cyber-orange animate-pulse" : "bg-cyber-neon") : "bg-white/10"}`} />
                        ))}
                    </div>
                </div>

                <div className="w-[1px] h-8 bg-white/10" />

                <div className="flex items-center gap-3">
                    {heat === 2 ? (
                        <AlertTriangle className="w-5 h-5 text-cyber-orange animate-bounce" />
                    ) : (
                        <Zap className="w-5 h-5 text-cyber-neon fill-current" />
                    )}
                    <span className={`text-sm font-black font-mono tracking-tighter ${heat === 2 ? "text-cyber-orange" : "text-cyber-neon"}`}>
                        {heat === 0 ? "STABLE_IDLE" : heat === 1 ? "OPT_SIMMER" : "CRITICAL_OVERDRIVE"}
                    </span>
                </div>
            </motion.div>
        </div>
    );
}
