"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
                const next = prev + (heat / 100) * 0.8;
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

    const hasTriggeredNext = useRef(false);

    useEffect(() => {
        if (isComplete && !hasTriggeredNext.current) {
            hasTriggeredNext.current = true;
            const timer = setTimeout(nextStage, 150);
            return () => clearTimeout(timer);
        }
    }, [isComplete, nextStage]);

    return (
        <div
            onPointerDown={ensureAudio}
            className="relative min-h-[100dvh] w-full flex flex-col items-center justify-start py-12 md:py-24 p-4 md:p-12 overflow-x-hidden bg-background"
        >
            {/* Background Ambience */}
            <div className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 opacity-30 ${theme === 'dark' ? 'bg-accent/10' : 'bg-accent/20'
                }`} />

            <div className="relative z-10 w-full max-w-7xl flex flex-col items-center gap-12 md:gap-24">

                {/* Header: Title Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center w-full"
                >
                    <div className="flex items-center gap-3 mb-2 md:mb-4 justify-center">
                        <Flame className="w-5 h-5 text-accent animate-pulse" />
                        <span className="text-[10px] font-black tracking-[0.5em] text-foreground/40 uppercase">Hearth Phase: Final Synthesis</span>
                    </div>
                    <h2 className="text-[10vw] md:text-8xl lg:text-[10rem] font-ubuntu font-bold text-foreground leading-[0.9] hearth-glow-text mb-4 md:mb-8">
                        The Heart <br />
                        <span className="vibrant-gradient italic">of the Home</span>
                    </h2>
                </motion.div>

                <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-32 w-full">

                    {/* Visual: The Sacred Simmering Pot */}
                    <div className="relative">
                        <motion.div
                            animate={{
                                scale: [1, 1.02, 1],
                            }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className={`relative w-64 h-64 md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] rounded-full border-4 transition-all duration-1000 p-6 md:p-12 flex items-center justify-center shadow-2xl overflow-hidden
                                ${theme === 'dark' ? 'border-accent/10 bg-black/40' : 'border-accent/20 bg-white/60'}
                            `}
                        >
                            {/* Woven Mat Halo */}
                            <div className="absolute inset-[-40px] md:inset-[-60px] border-[2px] border-accent/10 rounded-full animate-spin-slow opacity-20" />
                            <div className="absolute inset-[-20px] md:inset-[-30px] bg-accent/5 rounded-full blur-3xl" />

                            {/* Rising Steam */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                {[...Array(8)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{
                                            y: [0, -200],
                                            x: [0, Math.sin(i) * 60],
                                            opacity: [0, 0.4, 0],
                                            scale: [1, 3]
                                        }}
                                        transition={{
                                            duration: 4 + i,
                                            repeat: Infinity,
                                            delay: i * 0.5
                                        }}
                                        className="absolute w-12 h-12 bg-white/10 blur-2xl rounded-full"
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
                                    className="text-7xl md:text-[12rem] lg:text-[16rem] drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                                >
                                    🥘
                                </motion.div>
                                <div className="mt-8 md:mt-12">
                                    <div className="text-accent font-black text-[10px] md:text-sm uppercase tracking-[0.6em] mb-2 drop-shadow-sm">Simmering Essence</div>
                                    <div className="text-foreground/30 text-[8px] md:text-xs uppercase font-inter tracking-[0.3em]">Mother&apos;s Heritage</div>
                                </div>
                            </div>

                            {/* Radial Progress Gauge */}
                            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none z-20">
                                <circle cx="50%" cy="50%" r="48%" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10 10" className="text-foreground/5" />
                                <motion.circle
                                    cx="50%" cy="50%" r="48%" fill="none" stroke="var(--accent)" strokeWidth="6" strokeDasharray="1000"
                                    animate={{ strokeDashoffset: 1000 - (1000 * progress) / 100 }}
                                    className="opacity-70 drop-shadow-[0_0_20px_var(--accent)]"
                                />
                            </svg>
                        </motion.div>
                    </div>

                    {/* Stats & Controls Cluster */}
                    <div className="flex flex-col items-center gap-12 w-full max-w-md">
                        <div className="expert-card p-8 md:p-10 rounded-[40px] border-accent/20 space-y-6 md:space-y-8 w-full">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-[10px] font-black text-accent uppercase tracking-widest">
                                    <span>Ancestral_Flame</span>
                                    <span className="text-foreground animate-pulse">{heat > 80 ? "VIGOROUS" : "GENTLE"}</span>
                                </div>
                                <div className="w-full h-3 bg-foreground/5 rounded-full overflow-hidden p-[2px]">
                                    <motion.div
                                        animate={{ width: `${heat}%` }}
                                        className="h-full bg-accent rounded-full shadow-[0_0_20px_var(--accent)]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 md:gap-6">
                                <div className="expert-card p-4 md:p-6 rounded-[24px] md:rounded-[30px] border-foreground/5 bg-foreground/[0.02]">
                                    <div className="text-[9px] font-black text-accent/50 uppercase tracking-widest mb-1">Soul_Bond</div>
                                    <div className="text-2xl md:text-3xl font-ubuntu font-bold text-foreground">{Math.floor(progress)}%</div>
                                </div>
                                <div className="expert-card p-4 md:p-6 rounded-[24px] md:rounded-[30px] border-foreground/5 bg-foreground/[0.02]">
                                    <div className="text-[9px] font-black text-accent/50 uppercase tracking-widest mb-1">Stability</div>
                                    <div className="text-xl md:text-2xl font-ubuntu font-bold text-foreground">STABLE</div>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Sliders Section */}
                        <div className="expert-card p-8 rounded-[40px] border-accent/20 flex flex-col items-center gap-8 w-full sm:w-64">
                            <div className="flex flex-col items-center gap-2">
                                <div className="text-[10px] font-black text-accent uppercase tracking-[0.5em]">Flame Control</div>
                                <div className="text-[8px] font-bold text-foreground/30 uppercase tracking-[0.4em]">Slide to Regulate</div>
                            </div>

                            <div className="relative h-48 md:h-64 w-6 bg-foreground/5 rounded-full p-[2px]">
                                <motion.div
                                    animate={{ height: `${heat}%` }}
                                    className="absolute bottom-0 left-0 right-0 bg-accent rounded-full shadow-[0_0_30px_var(--accent)]"
                                />
                                <input
                                    type="range" min="10" max="100" value={heat}
                                    onChange={(e) => setHeat(parseInt(e.target.value))}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer -rotate-180 [appearance:slider-vertical]"
                                />
                            </div>

                            <div className="text-[9px] font-black text-foreground/20 uppercase tracking-[0.4em] text-center">
                                {heat > 80 ? "RHYTHMIC_TURBULENCE" : "SACRED_SIMMER"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Tip */}
                <div className="text-center px-6">
                    <div className="flex items-center gap-2 justify-center text-accent mb-3">
                        <Heart className="w-4 h-4 fill-current animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-[0.4em]">Heritage Flow</span>
                    </div>
                    <p className="text-foreground/30 text-xs font-inter leading-relaxed italic max-w-[280px] mx-auto">
                        &quot;Patience is the secret spice of Sierra Leone. Let the flame guide the bond.&quot;
                    </p>
                </div>
            </div>

            <GhostHint type="hold" />
        </div>
    );
}
