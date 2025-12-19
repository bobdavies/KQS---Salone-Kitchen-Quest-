"use client";

import { useState, useEffect, useCallback } from "react";
import { useGame } from "@/lib/context";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "@/app/hooks/useAudio";
import { useHaptic } from "@/app/hooks/useHaptic";
import GhostHint from "../shared/GhostHint";
import { Flame, Heart, Sprout, Leaf, ShoppingBag, Terminal } from "lucide-react";

export default function CookingStage() {
    const { nextStage, theme } = useGame();
    const [progress, setProgress] = useState(0);
    const [heat, setHeat] = useState(50);
    const [isComplete, setIsComplete] = useState(false);
    const [hasStartedAudio, setHasStartedAudio] = useState(false);
    const { playSimmer, stopSimmer, playSuccess } = useAudio();
    const { vibrateLight } = useHaptic();

    const ensureAudio = useCallback(() => {
        if (!hasStartedAudio && !isComplete) {
            playSimmer();
            setHasStartedAudio(true);
        }
    }, [hasStartedAudio, isComplete, playSimmer]);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (!isComplete) {
            timer = setTimeout(ensureAudio, 500);
        } else {
            stopSimmer();
        }
        return () => {
            clearTimeout(timer);
            stopSimmer();
        };
    }, [isComplete, ensureAudio, stopSimmer]);

    useEffect(() => {
        if (isComplete) return;

        const interval = setInterval(() => {
            setProgress((prev) => {
                const next = prev + (heat / 100) * 0.5;
                if (next >= 100) {
                    playSuccess();
                    setIsComplete(true);
                    return 100;
                }
                if (Math.random() > 0.8) vibrateLight();
                return next;
            });
        }, 100);

        return () => {
            clearInterval(interval);
        };
    }, [isComplete, heat, playSuccess, vibrateLight]);

    useEffect(() => {
        if (isComplete) {
            const timer = setTimeout(nextStage, 2500);
            return () => clearTimeout(timer);
        }
    }, [isComplete, nextStage]);

    return (
        <div
            onPointerDown={ensureAudio}
            className="relative h-full w-full flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden bg-background transition-colors duration-1000"
        >
            {/* Background Ambience */}
            <div className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 opacity-30 ${theme === 'dark' ? 'bg-accent/10' : 'bg-accent/20'
                }`} />

            <div className="relative z-10 w-full max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">

                {/* Left: Flame & Soul Stats */}
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-12"
                    >
                        <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
                            <Flame className="w-5 h-5 text-accent animate-pulse" />
                            <span className="text-[10px] font-black tracking-[0.5em] text-foreground/40 uppercase">Hearth Phase: Final Synthesis</span>
                        </div>
                        <h2 className="text-6xl md:text-8xl lg:text-[10rem] font-ubuntu font-bold text-foreground leading-none hearth-glow-text">
                            The Heart <br />
                            <span className="vibrant-gradient italic">of the Home</span>
                        </h2>
                    </motion.div>

                    <div className="expert-card p-10 rounded-[50px] border-accent/20 space-y-8 w-full max-w-sm">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-black text-accent uppercase tracking-widest">
                                <span>Ancestral_Flame</span>
                                <span className="text-foreground animate-pulse">Radiating</span>
                            </div>
                            <div className="w-full h-3 bg-foreground/5 rounded-full overflow-hidden p-[2px]">
                                <motion.div
                                    animate={{ width: `${heat}%` }}
                                    className="h-full bg-accent rounded-full shadow-[0_0_30px_var(--accent)]"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="expert-card p-6 rounded-[30px] border-foreground/5 bg-foreground/[0.02]">
                                <div className="text-[9px] font-black text-accent/50 uppercase tracking-widest mb-1">Soul_Bond</div>
                                <div className="text-3xl font-ubuntu font-bold text-foreground">{Math.floor(progress)}%</div>
                            </div>
                            <div className="expert-card p-6 rounded-[30px] border-foreground/5 bg-foreground/[0.02]">
                                <div className="text-[9px] font-black text-accent/50 uppercase tracking-widest mb-1">Stability</div>
                                <div className="text-3xl font-ubuntu font-bold text-foreground">STABLE</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center: The Sacred Simmering Pot */}
                <div className="relative order-1 lg:order-2">
                    <motion.div
                        animate={{
                            scale: [1, 1.02, 1],
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className={`relative w-64 h-64 md:w-[600px] md:h-[600px] rounded-full border-4 transition-all duration-1000 p-8 md:p-12 flex items-center justify-center shadow-2xl overflow-hidden
                            ${theme === 'dark' ? 'border-accent/10 bg-black/40' : 'border-accent/20 bg-white/60'}
                        `}
                    >
                        {/* Woven Mat Halo */}
                        <div className="absolute inset-[-60px] border-[2px] border-accent/10 rounded-full animate-spin-slow opacity-20" />
                        <div className="absolute inset-[-30px] bg-accent/5 rounded-full blur-3xl" />

                        {/* Rising Steam */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            {[...Array(12)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        y: [0, -300],
                                        x: [0, Math.sin(i) * 80],
                                        opacity: [0, 0.4, 0],
                                        scale: [1, 4]
                                    }}
                                    transition={{
                                        duration: 5 + i,
                                        repeat: Infinity,
                                        delay: i * 0.4
                                    }}
                                    className="absolute w-16 h-16 bg-white/10 blur-3xl rounded-full"
                                />
                            ))}
                        </div>

                        <div className="text-center z-10">
                            <motion.div
                                animate={{
                                    scale: [1, 1.1, 1],
                                    rotate: [0, 2, -2, 0]
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="text-8xl md:text-[12rem] lg:text-[16rem] drop-shadow-[0_40px_80px_rgba(0,0,0,0.6)]"
                            >
                                🥘
                            </motion.div>
                            <div className="mt-12">
                                <div className="text-accent font-black text-xs md:text-sm uppercase tracking-[0.8em] mb-4 drop-shadow-sm">Simmering Essence</div>
                                <div className="text-foreground/30 text-[10px] md:text-xs uppercase font-inter tracking-[0.4em]">The Mother&apos;s Heritage</div>
                            </div>
                        </div>

                        {/* Radial Progress Gauge */}
                        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none z-20">
                            <circle
                                cx="50%"
                                cy="50%"
                                r="48%"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeDasharray="15 15"
                                className="text-foreground/5"
                            />
                            <motion.circle
                                cx="50%"
                                cy="50%"
                                r="48%"
                                fill="none"
                                stroke="var(--accent)"
                                strokeWidth="6"
                                strokeDasharray="1000"
                                animate={{ strokeDashoffset: 1000 - (1000 * progress) / 100 }}
                                className="opacity-70 drop-shadow-[0_0_30px_var(--accent)]"
                            />
                        </svg>
                    </motion.div>
                </div>

                {/* Right: Interaction & Lore Control */}
                <div className="flex flex-col items-center lg:items-end gap-12 order-3">
                    <div className="hidden lg:block text-right">
                        <div className="flex items-center gap-2 justify-end text-accent mb-4">
                            <Heart className="w-5 h-5 fill-current animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.5em]">Spirit_of_Salone</span>
                        </div>
                        <p className="text-foreground/30 text-xs font-inter leading-relaxed italic max-w-[240px]">
                            &quot;The slow flame whispers to the grain. Patience is the bond that turns food into memory.&quot;
                        </p>
                    </div>

                    <div className="expert-card p-10 rounded-[50px] border-accent/20 flex flex-col items-center gap-10 w-full md:w-64">
                        <div className="flex flex-col items-center gap-2">
                            <div className="text-[10px] font-black text-accent uppercase tracking-[0.6em]">Flame Control</div>
                            <div className="text-[8px] font-bold text-foreground/30 uppercase tracking-[0.4em]">Slide to Regulate</div>
                        </div>

                        <div className="relative h-64 w-6 bg-foreground/5 rounded-full p-[2px]">
                            <motion.div
                                animate={{ height: `${heat}%` }}
                                className="absolute bottom-0 left-0 right-0 bg-accent rounded-full shadow-[0_0_40px_var(--accent)]"
                            />
                            <input
                                type="range"
                                min="10"
                                max="100"
                                value={heat}
                                onChange={(e) => setHeat(parseInt(e.target.value))}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer -rotate-180 [appearance:slider-vertical]"
                            />
                        </div>

                        <div className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.5em] animate-float">
                            {heat > 80 ? "VIGOROUS_SIMMER" : "GENTLE_GLOW"}
                        </div>
                    </div>

                    <div className="flex gap-6">
                        {[Heart, ShoppingBag, Leaf].map((Icon, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ scale: 1.2, rotate: 10 }}
                                className="w-14 h-14 rounded-full expert-card border-foreground/5 flex items-center justify-center text-accent hover:border-accent transition-colors"
                            >
                                <Icon className="w-6 h-6" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            <GhostHint type="hold" />
        </div>
    );
}

