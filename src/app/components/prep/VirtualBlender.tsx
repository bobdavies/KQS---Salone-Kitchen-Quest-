"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useGame } from "@/lib/context";
import { INGREDIENTS } from "@/lib/constants";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useHaptic } from "@/app/hooks/useHaptic";
import { Flame, Heart, Leaf } from "lucide-react";
import GhostHint from "../shared/GhostHint";
import { useAudio } from "@/app/hooks/useAudio";

export default function VirtualBlender() {
    const { nextStage, ingredientsCollected, theme } = useGame();
    const [isBlending, setIsBlending] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const controls = useAnimation();
    const { vibrateLight, vibrateMedium, stopVibrate } = useHaptic();
    const { playBlender, stopBlender, playSuccess } = useAudio();

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [hasStartedAudio, setHasStartedAudio] = useState(false);

    const triggerBlender = useCallback(() => {
        vibrateLight();
    }, [vibrateLight]);

    const ensureAudio = useCallback(() => {
        if (!hasStartedAudio && !isComplete) {
            playBlender();
            setHasStartedAudio(true);
        }
    }, [hasStartedAudio, isComplete, playBlender]);

    const triggerSuccess = useCallback(() => {
        vibrateMedium();
        playSuccess();
    }, [vibrateMedium, playSuccess]);

    useEffect(() => {
        if (isBlending && !isComplete) {
            ensureAudio();
            controls.start({
                x: [0, -6, 6, -6, 6, 0],
                y: [0, 6, -6, 6, -6, 0],
                transition: { duration: 0.1, repeat: Infinity }
            });

            const hapticInterval = setInterval(() => triggerBlender(), 100);
            timerRef.current = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(timerRef.current!);
                        setIsComplete(true);
                        setIsBlending(false);
                        triggerSuccess();
                        stopBlender();
                        return 100;
                    }
                    return prev + 2; // Expert speed: 2% per tick
                });
            }, 50);

            return () => {
                controls.stop();
                stopBlender();
                clearInterval(hapticInterval);
                if (timerRef.current) clearInterval(timerRef.current);
                stopVibrate();
            };
        } else {
            controls.stop();
            controls.set({ x: 0, y: 0 });
            stopBlender();
            stopVibrate();
        }
    }, [isBlending, isComplete, controls, triggerBlender, triggerSuccess, playBlender, stopBlender, stopVibrate]);

    useEffect(() => {
        if (isComplete) {
            const timer = setTimeout(nextStage, 2500);
            return () => clearTimeout(timer);
        }
    }, [isComplete, nextStage]);

    const startBlending = () => {
        if (!isComplete) {
            setIsBlending(true);
        }
    };

    const stopBlending = () => {
        setIsBlending(false);
    };

    return (
        <div
            onPointerDown={ensureAudio}
            className="relative h-full w-full flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden bg-background"
        >
            {/* Background Ambience */}
            <div className={`absolute inset-0 pointer-events-none transition-colors duration-1000 ${theme === 'dark' ? 'bg-accent/5' : 'bg-accent/10'
                }`} />

            <div className="relative z-10 w-full max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">

                {/* Left: Cinematic Stats */}
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-12"
                    >
                        <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
                            <Leaf className="w-5 h-5 text-accent animate-pulse" />
                            <span className="text-[10px] font-black tracking-[0.5em] text-foreground/40 uppercase">Hearth Phase: 02</span>
                        </div>
                        <h2 className="text-6xl md:text-8xl lg:text-[10rem] font-ubuntu font-bold text-foreground leading-none hearth-glow-text">
                            Artisanal <br />
                            <span className="vibrant-gradient italic">Extraction</span>
                        </h2>
                    </motion.div>

                    <div className="expert-card p-10 rounded-[50px] border-accent/20 space-y-8 w-full max-w-sm">
                        <div className="flex justify-between items-end border-b border-foreground/10 pb-6 transition-all duration-500">
                            <div>
                                <div className="text-[10px] font-black text-accent uppercase tracking-[0.4em] mb-2">Extraction_Pressure</div>
                                <div className="text-4xl font-ubuntu font-bold text-foreground leading-none">
                                    {Math.floor(progress * 1.5)}<span className="text-xs text-foreground/30 font-black ml-2">BAR</span>
                                </div>
                            </div>
                            <Flame className={`w-8 h-8 transition-colors ${isBlending ? "text-accent animate-pulse" : "text-foreground/10"}`} />
                        </div>

                        <div className="flex justify-between items-end border-b border-foreground/10 pb-6">
                            <div>
                                <div className="text-[10px] font-black text-accent uppercase tracking-[0.4em] mb-2">Molecular_Synthesis</div>
                                <div className="text-4xl font-ubuntu font-bold text-foreground leading-none">
                                    {Math.floor(progress)}<span className="text-xs text-foreground/30 font-black ml-2">%</span>
                                </div>
                            </div>
                            <Heart className={`w-8 h-8 transition-all ${isBlending ? "text-accent scale-125" : "text-foreground/10"}`} />
                        </div>

                        <div className="flex items-center gap-4 transition-all duration-700">
                            <motion.div
                                animate={isBlending ? { scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] } : {}}
                                transition={{ repeat: Infinity, duration: 1 }}
                                className={`w-3 h-3 rounded-full ${isBlending ? 'bg-accent shadow-[0_0_10px_var(--accent)]' : 'bg-foreground/10'}`}
                            />
                            <span className="text-[10px] font-black text-foreground uppercase tracking-[0.4em]">
                                {isBlending ? "RHYTHMIC_BOND_ACTIVE" : "AWAITING_ESSENCE"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Center: The Sacred Mortar & Pestle Visual */}
                <div className="relative order-1 lg:order-2">
                    <motion.div
                        animate={controls}
                        className={`relative w-64 h-64 md:w-[500px] md:h-[500px] rounded-full border-4 transition-all duration-1000 p-8 md:p-12 flex items-center justify-center shadow-2xl overflow-hidden
                            ${theme === 'dark' ? 'border-accent/10 bg-black/20' : 'border-accent/20 bg-white/40'}
                        `}
                    >
                        <div className="absolute inset-0 woven-texture opacity-10 pointer-events-none" />

                        <AnimatePresence mode="wait">
                            {progress < 100 ? (
                                <motion.div
                                    key="mixing"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.2, filter: "blur(20px)" }}
                                    className="grid grid-cols-2 gap-6"
                                >
                                    {ingredientsCollected.slice(0, 4).map((ingId, idx) => {
                                        const ing = INGREDIENTS.find(i => i.id === ingId);
                                        return (
                                            <motion.div
                                                key={idx}
                                                animate={isBlending ? {
                                                    rotate: [0, 360],
                                                    scale: [1, 1.1, 1],
                                                } : {}}
                                                transition={{ duration: 0.5, repeat: Infinity, delay: idx * 0.1 }}
                                                className="relative w-24 h-24 md:w-32 md:h-32 rounded-full expert-card flex items-center justify-center text-5xl md:text-6xl"
                                            >
                                                <div className="absolute inset-0 bg-accent/5 rounded-full" />
                                                <span className="drop-shadow-2xl">{ing?.icon || "🌿"}</span>
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="extracted"
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1.2 }}
                                    className="flex flex-col items-center gap-8"
                                >
                                    <div className="relative">
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1], rotate: 360 }}
                                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                            className="absolute -inset-8 border-4 border-accent/30 rounded-full blur-sm"
                                        />
                                        <div className="w-40 h-40 rounded-full bg-accent text-white flex items-center justify-center text-8xl shadow-[0_0_80px_var(--accent)]">
                                            🍃
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-accent font-black tracking-[0.5em] uppercase text-xs mb-2">Essence Refined</div>
                                        <div className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest leading-none">Aromatics Locked</div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Liquid Synthesis Swirl */}
                        {isBlending && (
                            <motion.div
                                animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                                transition={{ rotate: { duration: 1.5, repeat: Infinity, ease: "linear" }, scale: { duration: 2, repeat: Infinity } }}
                                className="absolute inset-0 border-[60px] border-salone-green/10 border-t-accent/40 rounded-full blur-3xl pointer-events-none"
                            />
                        )}
                    </motion.div>
                </div>

                {/* Right: The High-Prestige Interaction */}
                <div className="flex flex-col items-center gap-12 order-3">
                    <div className="text-center lg:text-right">
                        <div className="text-accent font-black text-[10px] uppercase tracking-[0.6em] mb-4">Ancestral Alchemy</div>
                        <p className="text-foreground/30 text-xs font-inter max-w-[240px] leading-relaxed italic">
                            &quot;Pressure creates the bond, but love creates the flavor. Hold until the leaves speak.&quot;
                        </p>
                    </div>

                    <motion.button
                        onPointerDown={startBlending}
                        onPointerUp={stopBlending}
                        onPointerLeave={stopBlending}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`relative w-56 h-56 rounded-full flex flex-col items-center justify-center gap-4 transition-all duration-700 shadow-2xl overflow-hidden touch-none select-none
                            ${isBlending
                                ? "bg-accent border-white text-white shadow-[0_0_100px_var(--accent)]"
                                : "expert-card border-accent/20 text-accent hover:border-accent"
                            }
                        `}
                    >
                        <div className="absolute inset-0 woven-texture opacity-[0.1]" />
                        <motion.div
                            animate={isBlending ? { y: [0, -10, 0] } : {}}
                            transition={{ repeat: Infinity, duration: 0.5 }}
                        >
                            <Flame className={`w-12 h-12 ${isBlending ? "fill-current" : ""}`} />
                        </motion.div>
                        <span className="text-xs font-black tracking-[0.4em] uppercase">Artisanal Extraction</span>
                    </motion.button>
                </div>
            </div>

            <GhostHint type="hold" />
        </div>
    );
}

