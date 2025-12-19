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
            className="relative h-full w-full flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden bg-background transition-colors duration-1000"
        >
            {/* Background Ambience */}
            <div className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 opacity-20 ${theme === 'dark' ? 'bg-accent/5' : 'bg-accent/10'
                }`} />

            <div className="relative z-10 w-full max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">

                {/* Left: Thermal Extraction Stats */}
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-12"
                    >
                        <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
                            <Wind className="w-5 h-5 text-accent animate-pulse" />
                            <span className="text-[10px] font-black tracking-[0.5em] text-foreground/40 uppercase">Hearth Phase: Grain Bliss</span>
                        </div>
                        <h2 className="text-6xl md:text-8xl lg:text-[10rem] font-ubuntu font-bold text-foreground leading-none hearth-glow-text">
                            Pure <br />
                            <span className="vibrant-gradient italic">Synthesis</span>
                        </h2>
                    </motion.div>

                    <div className="expert-card p-10 rounded-[50px] border-accent/20 space-y-8 w-full max-w-sm">
                        <div className="flex justify-between items-end border-b border-foreground/10 pb-6 transition-all duration-500">
                            <div>
                                <div className="text-[10px] font-black text-accent uppercase tracking-[0.4em] mb-2">Thermal_Extraction</div>
                                <div className="text-4xl font-ubuntu font-bold text-foreground leading-none">
                                    {Math.floor(heat)}<span className="text-xs text-foreground/30 font-black ml-2">°H</span>
                                </div>
                            </div>
                            <Flame className={`w-8 h-8 transition-colors ${riceDropped ? "text-accent animate-pulse" : "text-foreground/10"}`} />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-foreground/40">
                                <span>Hydration_Depth</span>
                                <span>{Math.floor(progress)}%</span>
                            </div>
                            <div className="w-full h-3 bg-foreground/5 rounded-full overflow-hidden p-[2px]">
                                <motion.div
                                    animate={{ width: `${progress}%` }}
                                    className="h-full bg-accent rounded-full shadow-[0_0_20px_var(--accent)]"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4 transition-all duration-700">
                            <motion.div
                                animate={riceDropped ? { scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] } : {}}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className={`w-3 h-3 rounded-full ${riceDropped ? 'bg-accent shadow-[0_0_10px_var(--accent)]' : 'bg-foreground/10'}`}
                            />
                            <span className="text-[10px] font-black text-foreground uppercase tracking-[0.4em]">
                                {riceDropped ? "MOLECULAR_STEAM_ACTIVE" : "AWAITING_GRAINS"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Center: The Sacred Boiling Pot */}
                <div className="relative order-1 lg:order-2">
                    <motion.div
                        animate={riceDropped ? {
                            scale: [1, 1.02, 1],
                        } : {}}
                        transition={{ duration: 0.1, repeat: Infinity }}
                        className={`relative w-64 h-64 md:w-[600px] md:h-[600px] rounded-full border-4 transition-all duration-1000 p-8 flex items-center justify-center shadow-2xl overflow-hidden pot-target
                            ${theme === 'dark' ? 'border-accent/10 bg-black/40' : 'border-accent/20 bg-white/60'}
                        `}
                    >
                        {/* Heat Distortion Shader Effect */}
                        {riceDropped && (
                            <motion.div
                                animate={{ opacity: [0, heat / 100, 0], scale: [1, 1.2, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="absolute inset-0 bg-accent/5 blur-[100px] pointer-events-none"
                            />
                        )}

                        {/* Liquid Visuals */}
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 1, -1, 0],
                            }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 z-0"
                        >
                            <Image
                                src="/boiling-pot.jpg"
                                alt="Boiling Water Pot"
                                fill
                                className={`object-cover transition-all duration-1000 ${theme === 'dark' ? 'brightness-[0.4] contrast-[1.3]' : 'brightness-[0.8] contrast-[1.1]'
                                    }`}
                                priority
                            />
                        </motion.div>

                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,var(--background)_100%)] pointer-events-none z-10" />

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={riceDropped ? "cooked" : "waiting"}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.2, filter: "blur(20px)" }}
                                className="relative w-56 h-56 md:w-80 md:h-80 rounded-full expert-card flex items-center justify-center overflow-hidden"
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
                                        <span className="text-8xl opacity-20 transform hover:scale-110 transition-transform">🍲</span>
                                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-foreground/20">Empty Hearth</span>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {/* Radial Progress */}
                        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none z-20">
                            <circle
                                cx="50%"
                                cy="50%"
                                r="48%"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeDasharray="10 10"
                                className="text-foreground/5"
                            />
                            <motion.circle
                                cx="50%"
                                cy="50%"
                                r="48%"
                                fill="none"
                                stroke="var(--accent)"
                                strokeWidth="4"
                                strokeDasharray="1000"
                                animate={{ strokeDashoffset: 1000 - (1000 * progress) / 100 }}
                                className="opacity-60 drop-shadow-[0_0_20px_var(--accent)]"
                            />
                        </svg>
                    </motion.div>
                </div>

                {/* Right: Interaction & Heat Control */}
                <div className="flex flex-col items-center lg:items-end gap-12 order-3">
                    <AnimatePresence mode="wait">
                        {!riceDropped ? (
                            <motion.div
                                key="drop-target"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                className="expert-card p-10 rounded-[50px] border-accent/20 flex flex-col items-center gap-8"
                            >
                                <div className="text-[10px] font-black text-accent uppercase tracking-[0.6em] leading-none mb-2">Sacred Grains</div>
                                <motion.div
                                    drag
                                    dragSnapToOrigin
                                    onDragEnd={(_, info) => handleDrop(info)}
                                    whileHover={{ scale: 1.1 }}
                                    whileDrag={{ scale: 1.3, zIndex: 100 }}
                                    className="w-32 h-32 rounded-[40px] expert-card border-accent/40 flex items-center justify-center cursor-grab active:cursor-grabbing shadow-2xl relative overflow-hidden group"
                                >
                                    <Image
                                        src="/raw-rice.jpg"
                                        alt="Sacred Rice Grains"
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </motion.div>
                                <div className="flex items-center gap-3">
                                    <Sparkles className="w-4 h-4 text-accent animate-pulse" />
                                    <span className="text-[9px] font-black text-foreground/40 uppercase tracking-widest">Bind to Hearth</span>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="heat-control"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="expert-card p-10 rounded-[50px] border-accent/20 flex flex-col items-center gap-10 w-full md:w-64"
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <div className="text-[10px] font-black text-accent uppercase tracking-[0.6em]">Heat Control</div>
                                    <div className="text-[8px] font-bold text-foreground/30 uppercase tracking-[0.4em]">Slide to Regulate</div>
                                </div>

                                <div className="relative h-64 w-6 bg-foreground/5 rounded-full p-[2px]">
                                    <motion.div
                                        animate={{ height: `${heat}%` }}
                                        className="absolute bottom-0 left-0 right-0 bg-accent rounded-full shadow-[0_0_30px_var(--accent)]"
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
                                    {heat > 80 ? "VIGOROUS_BOIL" : "GENTLE_STEAM"}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="hidden lg:block text-right">
                        <p className="text-foreground/30 text-xs font-inter max-w-[200px] leading-relaxed italic">
                            &quot;The water is the bridge. The heat is the path. Patient hands make the softest rice.&quot;
                        </p>
                    </div>
                </div>
            </div>

            <GhostHint type="drag" />
        </div>
    );
}

