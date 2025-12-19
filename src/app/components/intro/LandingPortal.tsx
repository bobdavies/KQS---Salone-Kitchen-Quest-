"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import { useGame } from "@/lib/context";
import { useAudio } from "@/app/hooks/useAudio";
import { Sparkles, Sword, Map, ChefHat, Flame, Crosshair } from "lucide-react";
import { useEffect, useState, useRef } from "react";

export default function LandingPortal() {
    const { nextStage, theme } = useGame();
    const { playSweep, playSuccess } = useAudio();
    const [mounted, setMounted] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        setMousePos({
            x: (clientX / innerWidth - 0.5) * 40,
            y: (clientY / innerHeight - 0.5) * 40
        });
    };

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    const containerVariants: Variants = {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.3 }
        }
    };

    const itemVariants: Variants = {
        initial: { y: 30, opacity: 0, filter: "blur(12px)" },
        animate: {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <div
            onMouseMove={handleMouseMove}
            className="relative h-full w-full flex flex-col items-center justify-center p-6 overflow-hidden bg-background select-none perspective-1000"
        >
            {/* INNOVATION: Hearth Lens Flare (follows mouse) */}
            <motion.div
                animate={{
                    x: mousePos.x * 2,
                    y: mousePos.y * 2,
                    opacity: [0.3, 0.5, 0.3]
                }}
                className="absolute w-[600px] h-[600px] bg-[radial-gradient(circle,var(--accent)_0%,transparent_70%)] opacity-25 blur-[120px] pointer-events-none z-0"
            />

            {/* INNOVATION: Cinematic Light Leak */}
            <div className="absolute top-0 right-0 w-[800px] h-full bg-[conic-gradient(from_270deg_at_100%_0%,var(--accent)_0%,transparent_15%)] opacity-5 blur-[80px] pointer-events-none" />

            {/* INNOVATION: Golden Hearth Dust (SVG Particles) */}
            <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{
                            x: Math.random() * 100 + "%",
                            y: "110%",
                            opacity: 0,
                            scale: Math.random() * 0.5 + 0.5
                        }}
                        animate={{
                            y: "-10%",
                            opacity: [0, 0.6, 0.6, 0],
                            x: (Math.random() * 100) + "%"
                        }}
                        transition={{
                            duration: 15 + Math.random() * 15,
                            repeat: Infinity,
                            delay: Math.random() * -30,
                            ease: "linear"
                        }}
                        className="absolute w-1.5 h-1.5 bg-accent/30 rounded-full blur-[1px]"
                    />
                ))}
            </div>

            <motion.div
                variants={containerVariants}
                initial="initial"
                animate="animate"
                className="relative z-20 flex flex-col items-center text-center max-w-5xl"
            >
                {/* Parallax Emblem */}
                <motion.div
                    animate={{
                        rotateX: mousePos.y * -0.1,
                        rotateY: mousePos.x * 0.1,
                        x: mousePos.x * 0.3,
                        y: mousePos.y * 0.3
                    }}
                    variants={itemVariants}
                    className="relative mb-12 md:mb-16"
                >
                    <motion.div
                        animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                        transition={{
                            rotate: { duration: 30, repeat: Infinity, ease: "linear" },
                            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="absolute inset-[-40px] md:inset-[-60px] border border-accent/10 rounded-full"
                    />
                    <div className="w-40 h-40 md:w-56 md:h-56 rounded-[50px] expert-card border-accent/30 flex items-center justify-center relative overflow-hidden group shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)]">
                        <div className="absolute inset-0 bg-accent/5 group-hover:bg-accent/10 transition-colors" />
                        <Flame className="w-20 h-20 md:w-28 md:h-28 text-accent drop-shadow-[0_0_30px_var(--accent)]" />

                        {/* Core Pulse */}
                        <motion.div
                            animate={{ opacity: [0.1, 0.3, 0.1] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--accent)_0%,transparent_60%)]"
                        />
                    </div>
                </motion.div>

                {/* Phonetic Branding KQS - FLUID TYPOGRAPHY */}
                <motion.div variants={itemVariants} className="mb-4 md:mb-6">
                    <h1 className="text-[clamp(5rem,25vw,18rem)] font-ubuntu font-bold text-foreground tracking-[-0.08em] leading-[0.8] hearth-glow-text">
                        KQS
                    </h1>
                </motion.div>

                {/* Full App Name */}
                <motion.div variants={itemVariants} className="mb-8 md:mb-10">
                    <h2 className="text-lg md:text-3xl font-ubuntu font-bold text-foreground/80 tracking-[0.4em] uppercase">
                        Salone Kitchen Quest
                    </h2>
                </motion.div>

                {/* Captivating Tagline */}
                <motion.div variants={itemVariants} className="mb-16 md:mb-20 px-4">
                    <div className="inline-block px-8 md:px-12 py-3 md:py-4 border-y border-foreground/10 mb-6">
                        <span className="text-[10px] md:text-xs text-foreground/40 font-black tracking-[0.5em] md:tracking-[0.6em] uppercase">
                            The Ancestral Connection
                        </span>
                    </div>
                    <p className="text-sm md:text-xl text-foreground/40 font-inter tracking-wide max-w-2xl leading-relaxed italic mx-auto">
                        A cinematic journey through the soul of <br className="hidden md:block" />
                        <span className="text-accent font-black not-italic vibrant-gradient">Sierra Leonean Heritage</span>
                    </p>
                </motion.div>

                {/* PREMIUM BUTTON PHYSICS - LESS BOUNCE, MORE WEIGHT */}
                <motion.div variants={itemVariants}>
                    <motion.button
                        onHoverStart={() => playSweep()}
                        onClick={() => {
                            playSuccess();
                            nextStage();
                        }}
                        // Tuned for prestige: heavy and authoritative
                        whileHover={{
                            scale: 1.05,
                            y: -4,
                            boxShadow: "0 40px 120px -20px rgba(226,114,91,0.8)"
                        }}
                        whileTap={{ scale: 0.98 }}
                        transition={{
                            type: "spring",
                            stiffness: 120, // Lower stiffness = less poppy
                            damping: 20      // Higher damping = less bounce
                        }}
                        className="group relative px-16 py-8 md:px-32 md:py-14 bg-accent text-white rounded-full font-black text-xl md:text-4xl tracking-[0.3em] overflow-hidden border-2 border-white/20 active:scale-95 transition-all"
                    >
                        <span className="relative z-10 flex items-center gap-6 md:gap-8">
                            <Crosshair className="w-8 h-8 md:w-10 md:h-10 group-hover:rotate-90 transition-transform duration-700 ease-in-out" />
                            BEGIN QUEST
                        </span>

                        {/* Subtle inner light shimmer */}
                        <motion.div
                            animate={{ x: ["-100%", "200%"] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                        />
                    </motion.button>
                </motion.div>

                {/* Innovative Grid Stats */}
                <motion.div
                    variants={itemVariants}
                    className="mt-24 md:mt-32 grid grid-cols-3 gap-12 md:gap-32 opacity-20"
                >
                    <div className="flex flex-col items-center gap-3">
                        <Map className="w-6 h-6 md:w-8 md:h-8" />
                        <span className="text-[8px] md:text-[9px] font-black tracking-widest uppercase">Explore</span>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <ChefHat className="w-6 h-6 md:w-8 md:h-8" />
                        <span className="text-[8px] md:text-[9px] font-black tracking-widest uppercase">Master</span>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <Sparkles className="w-6 h-6 md:w-8 md:h-8" />
                        <span className="text-[8px] md:text-[9px] font-black tracking-widest uppercase">Legacy</span>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
