"use client";

import { useState, useEffect } from "react";
import { useGame } from "@/lib/context";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "@/app/hooks/useAudio";
import confetti from "canvas-confetti";
import { Heart, Sprout, Flame, PlayCircle } from "lucide-react";
import Image from "next/image";

export default function GrandReveal() {
    const { theme } = useGame();
    const { playSuccess, playSweep, playCelebrate } = useAudio();
    const [showContent, setShowContent] = useState(false);
    const [lidLifted, setLidLifted] = useState(false);

    useEffect(() => {
        if (lidLifted) {
            playSuccess();
            playCelebrate();
            const timer = setTimeout(() => setShowContent(true), 1000);

            // Final Celebration Confetti
            const duration = 4 * 1000;
            const end = Date.now() + duration;

            (function frame() {
                confetti({
                    particleCount: 2,
                    angle: 60,
                    spread: 60,
                    origin: { x: 0 },
                    colors: ["#E2725B", "#FFB800", "#2D5A27", "#FFFFFF"]
                });
                confetti({
                    particleCount: 2,
                    angle: 120,
                    spread: 60,
                    origin: { x: 1 },
                    colors: ["#E2725B", "#FFB800", "#2D5A27", "#FFFFFF"]
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            }());

            return () => clearTimeout(timer);
        }
    }, [playSuccess, lidLifted]);

    const handleLidLift = () => {
        setLidLifted(true);
        playSweep();
    };

    return (
        <div className="relative min-h-[100dvh] w-full flex flex-col items-center justify-start py-12 md:py-24 p-4 md:p-12 overflow-x-hidden bg-background">
            {/* Cinematic Light Beams */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 ${theme === 'dark'
                    ? 'bg-[conic-gradient(from_0deg,transparent,rgba(255,184,0,0.05),transparent_50%,rgba(226,114,91,0.05),transparent)]'
                    : 'bg-[conic-gradient(from_0deg,transparent,rgba(255,184,0,0.1),transparent_50%,rgba(226,114,91,0.1),transparent)]'
                    }`}
            />

            <div className="relative z-10 w-full max-w-7xl flex flex-col items-center text-center gap-12 md:gap-20">

                {/* Header Section */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="space-y-6 w-full"
                >
                    <div className="flex items-center justify-center gap-4 text-accent">
                        <Sprout className="w-6 h-6 animate-float" />
                        <span className="text-[10px] md:text-[14px] font-black tracking-[0.6em] md:tracking-[0.8em] uppercase opacity-60">
                            {lidLifted ? "JOURNEY COMPLETE" : "THE FINAL BLESSING"}
                        </span>
                        <Sprout className="w-6 h-6 animate-float-delayed" />
                    </div>
                    <h2 className="text-[10vw] md:text-8xl lg:text-[10rem] font-ubuntu font-bold text-foreground leading-[0.9] hearth-glow-text">
                        {lidLifted ? (
                            <>The <span className="vibrant-gradient italic">Masterpiece</span></>
                        ) : (
                            <>Awaiting <br /><span className="vibrant-gradient italic">Reveal</span></>
                        )}
                    </h2>
                </motion.div>

                {/* The Final Dish Presentation */}
                <div className="relative group">
                    <AnimatePresence mode="wait">
                        {!lidLifted ? (
                            <motion.div
                                key="lid-view"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ y: -800, opacity: 0, rotate: -15, filter: "blur(20px)" }}
                                transition={{ type: "spring", damping: 15, stiffness: 40 }}
                                className="relative cursor-pointer"
                                onClick={handleLidLift}
                            >
                                <div className={`relative w-64 h-64 md:w-[450px] md:h-[450px] lg:w-[550px] lg:h-[550px] rounded-full border-4 md:border-8 transition-all duration-1000 flex flex-col items-center justify-center shadow-2xl overflow-hidden
                                    ${theme === 'dark' ? 'border-accent/20 bg-black/40' : 'border-accent/30 bg-white/60'}
                                `}>
                                    <div className="absolute inset-0 woven-texture opacity-20 pointer-events-none" />
                                    <div className="text-[8rem] md:text-[16rem] lg:text-[22rem] z-10 filter brightness-75 drop-shadow-2xl">🥘</div>

                                    <motion.div
                                        animate={{ y: [0, -10, 0], opacity: [0.6, 1, 0.6] }}
                                        transition={{ duration: 4, repeat: Infinity }}
                                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                    >
                                        <div className="w-full h-10 md:h-12 bg-accent/80 backdrop-blur-xl border-y border-white/20 z-20 flex items-center justify-center">
                                            <span className="text-[10px] md:text-[12px] font-black text-white uppercase tracking-[0.8em] md:tracking-[1.2em] translate-x-[0.4em]">Tap to Reveal</span>
                                        </div>
                                    </motion.div>
                                </div>

                                {[...Array(6)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ y: -60, opacity: [0, 0.3, 0], scale: [1, 2] }}
                                        transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
                                        className="absolute top-0 left-1/2 w-12 h-12 bg-white/10 blur-2xl rounded-full"
                                    />
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="reveal-view"
                                initial={{ opacity: 0, scale: 0.5, filter: "blur(20px)" }}
                                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                className="relative flex flex-col items-center gap-12"
                            >
                                <div className={`relative w-72 h-72 md:w-[500px] md:h-[500px] lg:w-[700px] lg:h-[700px] rounded-full border-8 md:border-[12px] transition-all duration-1000 shadow-[0_0_80px_rgba(var(--accent-rgb),0.3)] overflow-hidden
                                    ${theme === 'dark' ? 'border-accent/40 bg-black/60' : 'border-accent/50 bg-white/80'}
                                `}>
                                    <div className="absolute inset-0 woven-texture opacity-30 pointer-events-none" />
                                    <div className="relative z-10 w-full h-full flex items-center justify-center p-6 md:p-20">
                                        <motion.div
                                            animate={{ scale: [1, 1.02, 1] }}
                                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                                            className="relative w-full h-full rounded-full overflow-hidden border-4 md:border-8 border-white/10 shadow-2xl"
                                        >
                                            <Image src="/final-dish.jpg" alt="Final Dish" fill className="object-cover" priority />
                                            <div className="absolute inset-0 pointer-events-none">
                                                {[...Array(6)].map((_, i) => (
                                                    <motion.div
                                                        key={i}
                                                        animate={{ y: [0, -100], opacity: [0, 0.2, 0], scale: [1, 2] }}
                                                        transition={{ duration: 5 + i, repeat: Infinity, delay: i * 0.5 }}
                                                        className="absolute bottom-0 left-1/3 w-32 h-32 bg-white/5 blur-[60px] rounded-full"
                                                    />
                                                ))}
                                            </div>
                                        </motion.div>
                                    </div>
                                    <motion.div
                                        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.3, 0.1] }}
                                        transition={{ duration: 4, repeat: Infinity }}
                                        className="absolute inset-0 bg-accent/20 blur-[100px] pointer-events-none"
                                    />
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                    className="space-y-4 text-center px-4"
                                >
                                    <h3 className="text-accent font-bold text-3xl md:text-7xl font-ubuntu tracking-[0.3em] md:tracking-[0.5em] uppercase hearth-glow-text">
                                        Heritage Grains
                                    </h3>
                                    <p className="text-foreground/40 text-sm md:text-2xl font-inter tracking-wide italic leading-relaxed max-w-xl mx-auto">
                                        &quot;A symphony of tradition and soul, served with the eternal warmth of the hearth.&quot;
                                    </p>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <AnimatePresence>
                    {lidLifted && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.5 }}
                            className="flex flex-col items-center gap-12 pb-12"
                        >
                            <div className="flex items-center gap-8 md:gap-12">
                                <div className="flex flex-col items-center gap-2">
                                    <Heart className="w-8 h-8 md:w-10 md:h-10 text-accent fill-current animate-pulse" />
                                    <span className="text-[9px] md:text-[12px] font-black text-foreground/20 uppercase tracking-widest">SOUL_LEGACY</span>
                                </div>
                                <div className="w-[1px] h-12 bg-foreground/10" />
                                <div className="flex flex-col items-center gap-2">
                                    <Flame className="w-8 h-8 md:w-10 md:h-10 text-accent animate-bounce" />
                                    <span className="text-[9px] md:text-[12px] font-black text-foreground/20 uppercase tracking-widest">LIVING_HEARTH</span>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => window.location.reload()}
                                className="px-10 md:px-24 py-6 md:py-8 expert-card border-2 border-accent/40 text-foreground font-black text-lg md:text-3xl font-ubuntu tracking-[0.3em] md:tracking-[0.4em] rounded-[40px] md:rounded-[50px] shadow-xl hover:bg-accent/10 transition-all flex items-center gap-4 md:gap-6 group"
                            >
                                <PlayCircle className="w-6 h-6 md:w-8 md:h-8 group-hover:rotate-90 transition-transform duration-500" />
                                RETURN TO HEARTH
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
