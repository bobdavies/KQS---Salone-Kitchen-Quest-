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
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants: Variants = {
        initial: { y: 20, opacity: 0, filter: "blur(10px)" },
        animate: {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <div
            onMouseMove={handleMouseMove}
            className="relative min-h-[100dvh] w-full flex flex-col items-center justify-start md:justify-center p-4 md:p-8 overflow-x-hidden bg-background select-none perspective-1000 py-12 md:py-24"
        >
            {/* INNOVATION: Hearth Lens Flare (follows mouse) */}
            <motion.div
                animate={{
                    x: mousePos.x * 2,
                    y: mousePos.y * 2,
                    opacity: [0.2, 0.4, 0.2]
                }}
                className="fixed w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-[radial-gradient(circle,var(--accent)_0%,transparent_70%)] opacity-20 blur-[80px] md:blur-[120px] pointer-events-none z-0"
            />

            {/* INNOVATION: Golden Hearth Dust (Reduced for mobile performance) */}
            <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{
                            x: Math.random() * 100 + "%",
                            y: "110%",
                            opacity: 0,
                        }}
                        animate={{
                            y: "-10%",
                            opacity: [0, 0.4, 0.4, 0],
                        }}
                        transition={{
                            duration: 10 + Math.random() * 10,
                            repeat: Infinity,
                            delay: Math.random() * -20,
                            ease: "linear"
                        }}
                        className="absolute w-1 h-1 bg-accent/20 rounded-full blur-[1px]"
                    />
                ))}
            </div>

            <motion.div
                variants={containerVariants}
                initial="initial"
                animate="animate"
                className="relative z-20 flex flex-col items-center text-center w-full max-w-4xl"
            >
                {/* Parallax Emblem */}
                <motion.div
                    animate={{
                        rotateX: mousePos.y * -0.1,
                        rotateY: mousePos.x * 0.1,
                        x: mousePos.x * 0.2,
                        y: mousePos.y * 0.2
                    }}
                    variants={itemVariants}
                    className="relative mb-8 md:mb-16"
                >
                    <motion.div
                        animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                        transition={{
                            rotate: { duration: 30, repeat: Infinity, ease: "linear" },
                            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="absolute inset-[-30px] md:inset-[-60px] border border-accent/10 rounded-full"
                    />
                    <div className="w-32 h-32 md:w-56 md:h-56 rounded-[32px] md:rounded-[50px] expert-card border-accent/30 flex items-center justify-center relative overflow-hidden group shadow-2xl">
                        <div className="absolute inset-0 bg-accent/5 group-hover:bg-accent/10 transition-colors" />
                        <Flame className="w-16 h-16 md:w-28 md:h-28 text-accent drop-shadow-[0_0_20px_var(--accent)]" />
                        <motion.div
                            animate={{ opacity: [0.1, 0.2, 0.1] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--accent)_0%,transparent_60%)]"
                        />
                    </div>
                </motion.div>

                {/* Fluid Typography Header */}
                <motion.div variants={itemVariants} className="mb-2 md:mb-6">
                    <h1 className="text-[18vw] md:text-[clamp(8rem,15vw,16rem)] font-ubuntu font-bold text-foreground tracking-[-0.08em] leading-none hearth-glow-text">
                        KQS
                    </h1>
                </motion.div>

                {/* Subtitle */}
                <motion.div variants={itemVariants} className="mb-6 md:mb-10 px-4">
                    <h2 className="text-sm md:text-2xl font-ubuntu font-bold text-foreground/70 tracking-[0.3em] md:tracking-[0.4em] uppercase">
                        Salone Kitchen Quest
                    </h2>
                </motion.div>

                {/* Tagline Container */}
                <motion.div variants={itemVariants} className="mb-12 md:mb-20 px-6">
                    <div className="inline-block px-6 md:px-12 py-2 md:py-4 border-y border-foreground/10 mb-6 w-fit mx-auto">
                        <span className="text-[10px] md:text-xs text-foreground/40 font-black tracking-[0.4em] md:tracking-[0.6em] uppercase whitespace-nowrap">
                            The Ancestral Connection
                        </span>
                    </div>
                    <p className="text-xs md:text-lg text-foreground/40 font-inter tracking-wide max-w-xl leading-relaxed italic mx-auto">
                        A cinematic journey through the soul of <br className="hidden md:block" />
                        <span className="text-accent font-black not-italic vibrant-gradient">Sierra Leonean Heritage</span>
                    </p>
                </motion.div>

                {/* Premium Button */}
                <motion.div variants={itemVariants} className="w-full px-6 flex justify-center">
                    <motion.button
                        onHoverStart={() => playSweep()}
                        onClick={() => {
                            playSuccess();
                            nextStage();
                        }}
                        whileHover={{ scale: 1.05, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 150, damping: 20 }}
                        className="group relative w-full max-w-[320px] md:max-w-none md:w-auto px-8 md:px-32 py-6 md:py-14 bg-accent text-white rounded-full font-black text-lg md:text-4xl tracking-[0.2em] md:tracking-[0.3em] overflow-hidden border-2 border-white/20 shadow-2xl transition-all"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-6 md:gap-8">
                            <Crosshair className="w-6 h-6 md:w-10 md:h-10 group-hover:rotate-90 transition-transform duration-700" />
                            BEGIN QUEST
                        </span>
                        <motion.div
                            animate={{ x: ["-100%", "200%"] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                        />
                    </motion.button>
                </motion.div>

                {/* Icons Grid */}
                <motion.div
                    variants={itemVariants}
                    className="mt-16 md:mt-32 grid grid-cols-3 gap-8 md:gap-32 opacity-20"
                >
                    <div className="flex flex-col items-center gap-2">
                        <Map className="w-5 h-5 md:w-8 md:h-8" />
                        <span className="text-[7px] md:text-[9px] font-black tracking-widest uppercase">Explore</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <ChefHat className="w-5 h-5 md:w-8 md:h-8" />
                        <span className="text-[7px] md:text-[9px] font-black tracking-widest uppercase">Master</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Sparkles className="w-5 h-5 md:w-8 md:h-8" />
                        <span className="text-[7px] md:text-[9px] font-black tracking-widest uppercase">Legacy</span>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
