"use client";

import { useState, useEffect, useCallback } from "react";
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

    const [riceDropped, setRiceDropped] = useState(false);
    const [progress, setProgress] = useState(0);
    const [heat, setHeat] = useState(30);
    const [isComplete, setIsComplete] = useState(false);
    const [hasStartedAudio, setHasStartedAudio] = useState(false);

    const ensureAudio = useCallback(() => {
        if (!hasStartedAudio && !isComplete) {
            playSimmer();
            setHasStartedAudio(true);
        }
    }, [hasStartedAudio, isComplete, playSimmer]);

    const handleDrop = useCallback((info: any) => {
        const pot = document.querySelector(".pot-target");
        if (!pot) return;

        const potRect = pot.getBoundingClientRect();
        const { x, y } = info.point;

        if (
            x >= potRect.left &&
            x <= potRect.right &&
            y >= potRect.top &&
            y <= potRect.bottom
        ) {
            playSplash();
            vibrateMedium();
            setRiceDropped(true);
            ensureAudio();
        }
    }, [playSplash, vibrateMedium, ensureAudio]);

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
        if (!riceDropped || isComplete) return;

        const interval = setInterval(() => {
            setProgress((prev) => {
                const step = (heat / 100) * 0.8;
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
    }, [riceDropped, isComplete, heat, playSuccess, vibrateLight]);

    useEffect(() => {
        if (isComplete) {
            const timer = setTimeout(nextStage, 2500);
            return () => clearTimeout(timer);
        }
    }, [isComplete, nextStage]);

    return (
        <div
            onPointerDown={ensureAudio}
            className="relative min-h-[100dvh] w-full flex flex-col items-center justify-start py-12 md:py-24 p-4 md:p-12 overflow-x-hidden bg-background"
        >
            {/* Background Ambience */}
            <div className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 opacity-20 ${theme === 'dark' ? 'bg-accent/5' : 'bg-accent/10'
                }`} />

            <div className="relative z-10 w-full max-w-7xl flex flex-col items-center gap-12 md:gap-24">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center w-full"
                >
                    <div className="flex items-center gap-3 mb-4 justify-center">
                        <Wind className="w-5 h-5 text-accent animate-pulse" />
                        <span className="text-[10px] font-black tracking-[0.5em] text-foreground/40 uppercase">Hearth Phase: Grain Bliss</span>
                    </div>
                    <h2 className="text-[12vw] md:text-8xl lg:text-[10rem] font-ubuntu font-bold text-foreground leading-[0.9] hearth-glow-text mb-8">
                        Pure <br />
                        <span className="vibrant-gradient italic">Synthesis</span>
                    </h2>
                </motion.div>

                <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-32 w-full">

                    {/* Visual: The Sacred Boiling Pot */}
                    <div className="relative">
                        <motion.div
                            animate={riceDropped ? { scale: [1, 1.02, 1] } : {}}
                            transition={{ duration: 0.1, repeat: Infinity }}
                            className={`relative w-64 h-64 md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] rounded-full border-4 transition-all duration-1000 p-6 md:p-12 flex items-center justify-center shadow-2xl overflow-hidden pot-target
                                ${theme === 'dark' ? 'border-accent/10 bg-black/40' : 'border-accent/20 bg-white/60'}
                            `}
                        >
                            {/* Liquid Visuals */}
                            <motion.div
                                animate={{ scale: [1, 1.1, 1], rotate: [0, 1, -1, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-0 z-0"
                            >
                                <Image
                                    src="/boiling-pot.jpg"
                                    alt="Boiling Water Pot"
                                    fill
                                    className={`object-cover transition-all duration-1000 ${theme === 'dark' ? 'brightness-[0.4] contrast-[1.3]' : 'brightness-[0.8] contrast-[1.1]'}`}
                                    priority
                                />
                            </motion.div>

                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,var(--background)_100%)] pointer-events-none z-10" />

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={riceDropped ? "cooked" : "waiting"}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative w-48 h-48 md:w-80 md:h-80 rounded-full expert-card flex items-center justify-center overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-accent/5 rounded-full" />
                                    {riceDropped ? (
                                        <Image
                                            src="/raw-rice.jpg"
                                            alt="Sacred Rice Synthesis"
                                            fill
                                            className="object-cover brightness-110 saturate-[0.8]"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center gap-4">
                                            <span className="text-6xl md:text-8xl opacity-20 transform">🍲</span>
                                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-foreground/20">Awaiting Grains</span>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            {/* Radial Progress */}
                            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none z-20">
                                <circle cx="50%" cy="50%" r="48%" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10 10" className="text-foreground/5" />
                                <motion.circle
                                    cx="50%" cy="50%" r="48%" fill="none" stroke="var(--accent)" strokeWidth="4" strokeDasharray="1000"
                                    animate={{ strokeDashoffset: 1000 - (1000 * progress) / 100 }}
                                    className="opacity-60 drop-shadow-[0_0_20px_var(--accent)]"
                                />
                            </svg>
                        </motion.div>
                    </div>

                    {/* Stats & Control Interaction */}
                    <div className="flex flex-col items-center gap-12 w-full max-w-md">
                        <div className="expert-card p-8 md:p-10 rounded-[40px] border-accent/20 space-y-8 w-full">
                            <div className="flex justify-between items-end border-b border-foreground/10 pb-4 md:pb-6">
                                <div>
                                    <div className="text-[10px] font-black text-accent uppercase tracking-[0.4em] mb-2">Thermal_Depth</div>
                                    <div className="text-3xl md:text-4xl font-ubuntu font-bold text-foreground leading-none">
                                        {Math.floor(heat)}<span className="text-xs text-foreground/30 font-black ml-2">°H</span>
                                    </div>
                                </div>
                                <Flame className={`w-8 h-8 transition-colors ${riceDropped ? "text-accent animate-pulse" : "text-foreground/10"}`} />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-foreground/40">
                                    <span>Hydration_Level</span>
                                    <span>{Math.floor(progress)}%</span>
                                </div>
                                <div className="w-full h-3 bg-foreground/5 rounded-full overflow-hidden p-[2px]">
                                    <motion.div
                                        animate={{ width: `${progress}%` }}
                                        className="h-full bg-accent rounded-full shadow-[0_0_20px_var(--accent)]"
                                    />
                                </div>
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {!riceDropped ? (
                                <motion.div
                                    key="drop-target"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    className="expert-card p-8 rounded-[40px] border-accent/20 flex flex-col items-center gap-6 w-full sm:w-64"
                                >
                                    <div className="text-[9px] font-black text-accent uppercase tracking-[0.5em] leading-none mb-2">Sacred Grains</div>
                                    <motion.div
                                        drag dragSnapToOrigin onDragEnd={(_, info) => handleDrop(info)}
                                        whileHover={{ scale: 1.1 }} whileDrag={{ scale: 1.3, zIndex: 100 }}
                                        className="w-28 h-28 rounded-[32px] expert-card border-accent/40 flex items-center justify-center cursor-grab active:cursor-grabbing shadow-2xl relative overflow-hidden"
                                    >
                                        <Image src="/raw-rice.jpg" alt="Sacred Rice Grains" fill className="object-cover" />
                                    </motion.div>
                                    <span className="text-[8px] font-black text-foreground/30 uppercase tracking-[0.4em]">Drag to Pot</span>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="heat-control"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="expert-card p-8 rounded-[40px] border-accent/20 flex flex-col items-center gap-8 w-full sm:w-64"
                                >
                                    <div className="text-[10px] font-black text-accent uppercase tracking-[0.5em]">Flame Control</div>
                                    <div className="relative h-48 md:h-64 w-6 bg-foreground/5 rounded-full p-[2px]">
                                        <motion.div animate={{ height: `${heat}%` }} className="absolute bottom-0 left-0 right-0 bg-accent rounded-full shadow-[0_0_30px_var(--accent)]" />
                                        <input
                                            type="range" min="10" max="100" value={heat}
                                            onChange={(e) => setHeat(parseInt(e.target.value))}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer -rotate-180 [appearance:slider-vertical]"
                                        />
                                    </div>
                                    <div className="text-[9px] font-black text-foreground/20 uppercase tracking-[0.4em]">
                                        {heat > 80 ? "VIGOROUS_SYNTHESIS" : "PATIENT_STEAM"}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Footer Tip */}
                <div className="text-center px-6">
                    <p className="text-foreground/30 text-xs font-inter leading-relaxed italic max-w-[280px] mx-auto">
                        &quot;The water is the bridge. The heat is the path. Patient hands make the softest rice.&quot;
                    </p>
                </div>
            </div>

            <GhostHint type="drag" />
        </div>
    );
}
