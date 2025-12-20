"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useGame } from "@/lib/context";
import { useAudio } from "@/app/hooks/useAudio";
import { useHaptic } from "@/app/hooks/useHaptic";
import { Flame, Droplets, Info, Wind, Sparkles } from "lucide-react";
import GhostHint from "../shared/GhostHint";

export default function RiceCooking() {
    const { nextStage, theme } = useGame();
    const { playSplash, playSimmer, stopSimmer, playSuccess } = useAudio();
    const { vibrateLight, vibrateMedium } = useHaptic();
    const potRef = useRef<HTMLDivElement>(null);

    const [riceDropped, setRiceDropped] = useState(false);
    const [progress, setProgress] = useState(0);
    const [heat, setHeat] = useState(30);
    const [isComplete, setIsComplete] = useState(false);
    const [hasStartedAudio, setHasStartedAudio] = useState(false);
    const hasTriggeredNext = useRef(false);

    const ensureAudio = useCallback(() => {
        if (!hasStartedAudio && !isComplete) {
            playSimmer();
            setHasStartedAudio(true);
        }
    }, [hasStartedAudio, isComplete, playSimmer]);

    const [isPouring, setIsPouring] = useState(false);

    const handlePour = useCallback(() => {
        if (isPouring || riceDropped) return;
        setIsPouring(true);

        // Cinematic sequence
        setTimeout(() => {
            playSplash();
            vibrateMedium();
            setRiceDropped(true);
            setIsPouring(false);
            ensureAudio();
        }, 1500); // Wait for the "pour" animation to reach peak
    }, [isPouring, riceDropped, playSplash, vibrateMedium, ensureAudio]);

    useEffect(() => {
        if (isComplete) {
            stopSimmer();
        }
        return () => {
            stopSimmer();
        };
    }, [isComplete, stopSimmer]);

    useEffect(() => {
        if (!riceDropped || isComplete) return;

        const interval = setInterval(() => {
            setProgress((prev) => {
                // Slightly faster cooking for better game flow
                const step = (heat / 100) * 1.5;
                const next = prev + step;

                if (next >= 100) {
                    playSuccess();
                    stopSimmer();
                    setIsComplete(true);
                    return 100;
                }

                if (Math.random() > 0.85) vibrateLight();
                return next;
            });
        }, 100);

        return () => {
            clearInterval(interval);
        };
    }, [riceDropped, isComplete, heat, playSuccess, vibrateLight, stopSimmer]);

    useEffect(() => {
        if (isComplete && !hasTriggeredNext.current) {
            hasTriggeredNext.current = true;
            // Shorter delay for Snappy feel, but enough to see 100%
            const timer = setTimeout(() => {
                nextStage();
            }, 1200);
            return () => clearTimeout(timer);
        }
    }, [isComplete, nextStage]);

    return (
        <div className="relative min-h-[100dvh] w-full flex flex-col items-center justify-start py-8 md:py-24 p-4 md:p-12 overflow-x-hidden bg-background">
            {/* Background Ambience */}
            <div className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 opacity-20 ${theme === 'dark' ? 'bg-accent/5' : 'bg-accent/10'}`} />

            <div className="relative z-10 w-full max-w-7xl flex flex-col items-center gap-8 md:gap-24">
                {/* Header Section */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center w-full">
                    <div className="flex items-center gap-3 mb-2 md:mb-4 justify-center">
                        <Wind className="w-5 h-5 text-accent animate-pulse" />
                        <span className="text-[10px] font-black tracking-[0.5em] text-foreground/40 uppercase">Hearth Phase: Grain Bliss</span>
                    </div>
                    <h2 className="text-[10vw] md:text-8xl lg:text-[10rem] font-ubuntu font-bold text-foreground leading-[0.9] hearth-glow-text mb-4 md:mb-8">
                        Pure <br />
                        <span className="vibrant-gradient italic">Synthesis</span>
                    </h2>
                </motion.div>

                {/* Main Interaction Area: Responsive Vertical on Mobile, Horizontal on Desktop */}
                <div className="flex flex-col items-center justify-center gap-12 lg:gap-32 w-full">
                    {/* Phase 1: The Source (Grains) */}
                    <div className="flex flex-col items-center gap-8 w-full max-w-md">
                        <AnimatePresence mode="wait">
                            {!riceDropped ? (
                                <motion.div
                                    key="drop-source"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={isPouring ? {
                                        x: [0, 0, 0],
                                        y: [0, 100, 200],
                                        rotate: [0, -15, -45],
                                        scale: [1, 1.1, 0.6],
                                        opacity: [1, 1, 0]
                                    } : { opacity: 1, scale: 1 }}
                                    transition={isPouring ? { duration: 1.5, ease: "easeInOut" } : {}}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    onClick={handlePour}
                                    className="expert-card p-6 md:p-8 rounded-[40px] border-accent/20 flex flex-col items-center gap-4 md:gap-6 w-full sm:w-64 cursor-pointer hover:border-accent/60 transition-colors group z-50"
                                >
                                    <div className="text-[9px] font-black text-accent uppercase tracking-[0.5em] leading-none group-hover:animate-pulse">Sacred Grains</div>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-24 h-24 md:w-32 md:h-32 rounded-[32px] expert-card border-accent/40 flex items-center justify-center shadow-2xl relative overflow-hidden">
                                        <Image src="/raw-rice.jpg" alt="Sacred Rice Grains" fill className="object-cover" />
                                        <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="text-white text-[10px] font-black uppercase tracking-widest">TAP_TO_ADD</span>
                                        </div>
                                    </motion.div>
                                    <span className="text-[8px] font-black text-foreground/30 uppercase tracking-[0.4em]">Tap to Add to Pot</span>
                                </motion.div>
                            ) : null}
                        </AnimatePresence>
                    </div>

                    {/* Phase 2: The Vessel (Pot) */}
                    <div className="relative">
                        <motion.div
                            ref={potRef}
                            animate={{ scale: riceDropped ? [1, 1.02, 1] : 1 }}
                            transition={{ scale: riceDropped ? { duration: 0.1, repeat: Infinity } : { duration: 0.2 } }}
                            className={`relative w-64 h-64 md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] rounded-full border-4 transition-all duration-1000 p-6 md:p-12 flex items-center justify-center shadow-2xl overflow-hidden pot-target ${theme === 'dark' ? 'border-accent/10 bg-black/40' : 'border-accent/20 bg-white/60'}`}
                        >
                            <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 1, -1, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-0 z-0">
                                <Image src="/boiling-pot.jpg" alt="Boiling Water Pot" fill className={`object-cover transition-all duration-1000 ${theme === 'dark' ? 'brightness-[0.4] contrast-[1.3]' : 'brightness-[0.8] contrast-[1.1]'}`} priority />
                            </motion.div>
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,var(--background)_100%)] pointer-events-none z-10" />
                            <AnimatePresence mode="wait">
                                <motion.div key={riceDropped ? "cooked" : "waiting"} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="relative w-40 h-40 md:w-80 md:h-80 rounded-full expert-card flex items-center justify-center overflow-hidden">
                                    <div className="absolute inset-0 bg-accent/5 rounded-full" />
                                    {riceDropped ? (
                                        <Image src="/raw-rice.jpg" alt="Sacred Rice Synthesis" fill className="object-cover brightness-110 saturate-[0.8]" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-4">
                                            <span className="text-4xl md:text-8xl opacity-20 transform">🍲</span>
                                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-foreground/20">Awaiting Grains</span>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none z-20">
                                <circle cx="50%" cy="50%" r="48%" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10 10" className="text-foreground/5" />
                                <motion.circle cx="50%" cy="50%" r="48%" fill="none" stroke="var(--accent)" strokeWidth="4" strokeDasharray="1000" animate={{ strokeDashoffset: 1000 - (1000 * progress) / 100 }} className="opacity-60 drop-shadow-[0_0_20px_var(--accent)]" />
                            </svg>
                        </motion.div>
                    </div>

                    {/* Phase 3: Controls & Stats */}
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-8 w-full max-w-4xl">
                        {riceDropped && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="expert-card p-6 md:p-8 rounded-[40px] border-accent/20 flex flex-col items-center gap-6 w-full sm:w-64">
                                <div className="text-[10px] font-black text-accent uppercase tracking-[0.5em]">Flame Control</div>
                                <div className="relative h-32 md:h-48 w-6 bg-foreground/5 rounded-full p-[2px]">
                                    <motion.div animate={{ height: `${heat}%` }} className="absolute bottom-0 left-0 right-0 bg-accent rounded-full shadow-[0_0_30px_var(--accent)]" />
                                    <input type="range" min="10" max="100" value={heat} onChange={(e) => setHeat(parseInt(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer -rotate-180 [appearance:slider-vertical] touch-none" />
                                </div>
                                <div className="text-[8px] font-black text-foreground/20 uppercase tracking-[0.3em]">{heat > 80 ? "VIGOROUS" : "PATIENT"}</div>
                            </motion.div>
                        )}
                        <div className="expert-card p-8 md:p-10 rounded-[40px] border-accent/20 space-y-8 w-full max-w-md">
                            <div className="flex justify-between items-end border-b border-foreground/10 pb-4 md:pb-6">
                                <div>
                                    <div className="text-[10px] font-black text-accent uppercase tracking-[0.4em] mb-2">Thermal_Depth</div>
                                    <div className="text-3xl md:text-4xl font-ubuntu font-bold text-foreground leading-none">{Math.floor(heat)}<span className="text-xs text-foreground/30 font-black ml-2">°H</span></div>
                                </div>
                                <Flame className={`w-8 h-8 transition-colors ${riceDropped ? "text-accent animate-pulse" : "text-foreground/10"}`} />
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-foreground/40">
                                    <span>Hydration_Level</span>
                                    <span>{Math.floor(progress)}%</span>
                                </div>
                                <div className="w-full h-3 bg-foreground/5 rounded-full overflow-hidden p-[2px]">
                                    <motion.div animate={{ width: `${progress}%` }} className="h-full bg-accent rounded-full shadow-[0_0_20px_var(--accent)]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Tip */}
                <div className="text-center px-6">
                    <p className="text-foreground/30 text-xs font-inter leading-relaxed italic max-w-[280px] mx-auto">
                        &quot;The water is the bridge. The heat is the path. Patient hands make the softest rice.&quot;
                    </p>
                </div>
            </div>

            <GhostHint type="tap" />
        </div>
    );
}
