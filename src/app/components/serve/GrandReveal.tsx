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
    const { playSuccess, playSweep } = useAudio();
    const [showContent, setShowContent] = useState(false);
    const [lidLifted, setLidLifted] = useState(false);

    useEffect(() => {
        if (lidLifted) {
            playSuccess();
            const timer = setTimeout(() => setShowContent(true), 1000);

            // Final Celebration Confetti
            const duration = 4 * 1000;
            const end = Date.now() + duration;

            (function frame() {
                confetti({
                    particleCount: 4,
                    angle: 60,
                    spread: 60,
                    origin: { x: 0 },
                    colors: ["#E2725B", "#FFB800", "#2D5A27", "#FFFFFF"]
                });
                confetti({
                    particleCount: 4,
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
        <div className="relative h-full w-full flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden bg-background transition-colors duration-1000">
            {/* Cinematic Light Beams */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${theme === 'dark'
                    ? 'bg-[conic-gradient(from_0deg,transparent,rgba(255,184,0,0.05),transparent_50%,rgba(226,114,91,0.05),transparent)]'
                    : 'bg-[conic-gradient(from_0deg,transparent,rgba(255,184,0,0.1),transparent_50%,rgba(226,114,91,0.1),transparent)]'
                    }`}
            />

            <div className="relative z-10 w-full max-w-7xl flex flex-col items-center text-center gap-10 md:gap-16">
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="space-y-6"
                >
                    <div className="flex items-center justify-center gap-6 text-accent">
                        <Sprout className="w-8 h-8 animate-float" />
                        <span className="text-[14px] font-black tracking-[0.8em] uppercase opacity-60">
                            {lidLifted ? "THE JOURNEY IS COMPLETE" : "THE FINAL BLESSING"}
                        </span>
                        <Sprout className="w-8 h-8 animate-float-delayed" />
                    </div>
                    <h2 className="text-6xl md:text-8xl lg:text-[10rem] font-ubuntu font-bold text-foreground leading-none hearth-glow-text">
                        {lidLifted ? (
                            <>The <span className="vibrant-gradient italic">Masterpiece</span></>
                        ) : (
                            <>Wait for <br /><span className="vibrant-gradient italic">The Reveal</span></>
                        )}
                    </h2>
                </motion.div>

                {/* The Final Dish Presentation */}
                <div className="relative group flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        {!lidLifted ? (
                            <motion.div
                                key="lid-view"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ y: -800, opacity: 0, rotate: -30, filter: "blur(20px)" }}
                                transition={{ type: "spring", damping: 15, stiffness: 50 }}
                                className="relative cursor-pointer"
                                onClick={handleLidLift}
                            >
                                {/* Immersive Pot with Lid */}
                                <div className={`relative w-64 h-64 md:w-96 md:h-96 lg:w-[550px] lg:h-[550px] rounded-full border-8 transition-all duration-1000 flex flex-col items-center justify-center shadow-2xl overflow-hidden
                                    ${theme === 'dark' ? 'border-accent/20 bg-black/40' : 'border-accent/30 bg-white/60'}
                                `}>
                                    <div className="absolute inset-0 woven-texture opacity-20 pointer-events-none" />
                                    <div className="text-[10rem] md:text-[16rem] lg:text-[22rem] z-10 filter brightness-75 drop-shadow-2xl">🥘</div>

                                    <motion.div
                                        animate={{ y: [0, -20, 0], opacity: [0.4, 1, 0.4] }}
                                        transition={{ duration: 4, repeat: Infinity }}
                                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                    >
                                        <div className="w-full h-12 bg-accent/60 backdrop-blur-xl border-y border-white/20 z-20 flex items-center justify-center">
                                            <span className="text-[12px] font-black text-white uppercase tracking-[1.2em] transform translate-x-[0.6em]">Lift to Reveal</span>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Steam Leaks */}
                                {[...Array(8)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{
                                            y: -80,
                                            opacity: [0, 0.4, 0],
                                            scale: [1, 3]
                                        }}
                                        transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
                                        className="absolute top-0 left-1/2 w-16 h-16 bg-white/10 blur-3xl rounded-full"
                                    />
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="reveal-view"
                                initial={{ opacity: 0, scale: 0.3, filter: "blur(30px)", rotate: -15 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    filter: "blur(0px)",
                                    rotate: 0,
                                }}
                                transition={{
                                    duration: 1.5,
                                    ease: [0.16, 1, 0.3, 1]
                                }}
                                className="relative flex flex-col items-center gap-12 md:gap-20"
                            >
                                {/* Circular Presentation Container */}
                                <div className={`relative w-80 h-80 md:w-[500px] md:h-[500px] lg:w-[700px] lg:h-[700px] rounded-full border-[12px] transition-all duration-1000 shadow-[0_0_150px_rgba(var(--accent-rgb),0.4)] overflow-hidden
                                    ${theme === 'dark' ? 'border-accent/40 bg-black/60' : 'border-accent/50 bg-white/80'}
                                `}>
                                    <div className="absolute inset-0 woven-texture opacity-30 pointer-events-none" />

                                    <div className="relative z-10 w-full h-full flex items-center justify-center p-12 md:p-20">
                                        <motion.div
                                            animate={{ scale: [1, 1.03, 1] }}
                                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                                            className="relative w-full h-full rounded-full overflow-hidden border-8 border-white/5 shadow-2xl"
                                        >
                                            <Image
                                                src="/final-dish.jpg"
                                                alt="The Final Masterpiece"
                                                fill
                                                className="object-cover"
                                                priority
                                            />

                                            {/* Final Steam Overlays */}
                                            <div className="absolute inset-0 pointer-events-none">
                                                {[...Array(10)].map((_, i) => (
                                                    <motion.div
                                                        key={i}
                                                        animate={{
                                                            y: [0, -150],
                                                            opacity: [0, 0.3, 0],
                                                            scale: [1, 3]
                                                        }}
                                                        transition={{
                                                            duration: 4 + i,
                                                            repeat: Infinity,
                                                            delay: i * 0.4
                                                        }}
                                                        className="absolute bottom-0 left-1/4 w-40 h-40 bg-white/10 blur-[80px] rounded-full"
                                                    />
                                                ))}
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Radiant Pulse */}
                                    <motion.div
                                        animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.4, 0.1] }}
                                        transition={{ duration: 4, repeat: Infinity }}
                                        className="absolute inset-0 bg-accent/20 blur-[150px] pointer-events-none"
                                    />
                                </div>

                                {/* Text Mastery Separated */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.2 }}
                                    className="space-y-6 text-center max-w-2xl px-6"
                                >
                                    <h3 className="text-accent font-bold text-4xl md:text-7xl font-ubuntu tracking-[0.5em] uppercase hearth-glow-text leading-tight">
                                        Cassava Leaf & Rice
                                    </h3>
                                    <p className="text-foreground/40 text-lg md:text-2xl font-inter tracking-[0.2em] italic leading-relaxed">
                                        &quot;A symphony of tradition and soul, served with the eternal warmth of the hearth.&quot;
                                    </p>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Corner Ritual Marks */}
                    <div className="absolute -top-12 -left-12 w-32 h-32 border-t-2 border-l-2 border-accent/20 rounded-tl-[80px] pointer-events-none" />
                    <div className="absolute -bottom-12 -right-12 w-32 h-32 border-b-2 border-r-2 border-accent/20 rounded-br-[80px] pointer-events-none" />
                </div>

                <AnimatePresence>
                    {lidLifted && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 2 }}
                            className="flex flex-col items-center gap-12"
                        >
                            <div className="flex items-center gap-12">
                                <div className="flex flex-col items-center gap-3">
                                    <Heart className="w-10 h-10 text-accent fill-current animate-pulse" />
                                    <span className="text-[12px] font-black text-foreground/20 uppercase tracking-[0.5em]">SOUL_LEGACY</span>
                                </div>
                                <div className="w-[1px] h-16 bg-foreground/10" />
                                <div className="flex flex-col items-center gap-3">
                                    <Flame className="w-10 h-10 text-accent animate-bounce" />
                                    <span className="text-[12px] font-black text-foreground/20 uppercase tracking-[0.5em]">LIVING_TRADITION</span>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05, letterSpacing: "0.6em" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => window.location.reload()}
                                className="px-12 md:px-24 py-6 md:py-8 expert-card border-2 border-accent/40 text-foreground font-black text-xl md:text-3xl font-ubuntu tracking-[0.4em] rounded-[50px] shadow-2xl hover:bg-accent/10 transition-all flex items-center gap-6 group"
                            >
                                <PlayCircle className="w-8 h-8 group-hover:rotate-90 transition-transform duration-500" />
                                RETURN TO HEARTH
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}


