"use client";

import { useGame } from "@/lib/context";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Flame, Heart, Leaf, Sparkles } from "lucide-react";
import Image from "next/image";
import { useAudio } from "@/app/hooks/useAudio";
import { useEffect, useState } from "react";

export default function Hero() {
    const { nextStage, resetGame, theme, toggleTheme } = useGame();
    const { playSweep, playSuccess } = useAudio();

    // Mouse Parallax Effect
    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const springX = useSpring(mouseX, { damping: 30, stiffness: 100 });
    const springY = useSpring(mouseY, { damping: 30, stiffness: 100 });

    const bgX = useTransform(springX, [0, 1], ["-2%", "2%"]);
    const bgY = useTransform(springY, [0, 1], ["-2%", "2%"]);
    const textX = useTransform(springX, [0, 1], ["-1%", "1%"]);
    const textY = useTransform(springY, [0, 1], ["-1%", "1%"]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX / window.innerWidth);
            mouseY.set(e.clientY / window.innerHeight);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div className="relative flex flex-col items-center justify-center h-full w-full text-center p-6 bg-background overflow-hidden max-h-screen transition-colors duration-1000">
            {/* Cinematic Background - Theme-aware Overlay */}
            <motion.div
                style={{ x: bgX, y: bgY, scale: 1.05 }}
                className="absolute inset-0 z-0"
            >
                <div className="relative w-full h-full">
                    <Image
                        src="/hero-bg.jpg"
                        alt="Ancestral Cassava Leaf Sauce and Rice"
                        fill
                        className={`object-cover transition-all duration-1000 ${theme === 'dark' ? 'brightness-[0.4] contrast-[1.2]' : 'brightness-[0.8] contrast-[1.1] saturate-[0.8]'
                            }`}
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/80" />
                    <div className="absolute inset-0 bg-accent/5 mix-blend-overlay" />
                </div>
            </motion.div>

            {/* Drifting Embers / Petals */}
            <div className="absolute inset-0 pointer-events-none z-10">
                {mounted && [...Array(20)].map((_, i) => (
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
                            x: (Math.random() * 100 - 10) + "%",
                            opacity: [0, 1, 0],
                            rotate: 720
                        }}
                        transition={{
                            duration: 12 + Math.random() * 12,
                            repeat: Infinity,
                            delay: i * 1.5,
                            ease: "linear"
                        }}
                        className={`absolute w-1 h-1 rounded-full blur-[1px] ${theme === 'dark' ? 'bg-heritage-gold/30' : 'bg-salone-green/30'
                            }`}
                    />
                ))}
            </div>

            {/* Expert UI: Theme Toggle */}
            <motion.button
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 }}
                onClick={toggleTheme}
                className="absolute top-8 right-8 z-50 p-4 rounded-2xl heritage-glass group overflow-hidden"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <div className="relative z-10 flex items-center gap-3">
                    <motion.div
                        animate={{ rotate: theme === 'dark' ? 0 : 180 }}
                        className="text-accent"
                    >
                        {theme === 'dark' ? '🌙' : '☀️'}
                    </motion.div>
                    <span className="text-[10px] font-black tracking-widest uppercase text-foreground/50 group-hover:text-foreground">
                        {theme === 'dark' ? 'Hearth Void' : 'Mercantile Sun'}
                    </span>
                </div>
            </motion.button>

            {/* Content */}
            <motion.div
                style={{ x: textX, y: textY }}
                className="z-20 flex flex-col items-center"
            >
                <motion.div
                    initial={{ opacity: 0, letterSpacing: "1em" }}
                    animate={{ opacity: 1, letterSpacing: "0.6em" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="mb-8 px-8 py-3 rounded-full border border-accent/20 bg-accent/5 text-accent text-[12px] font-black uppercase backdrop-blur-xl shadow-2xl"
                >
                    A Culinary Soul Journey
                </motion.div>

                <div className="relative mb-12 w-full px-4 overflow-hidden">
                    <h1 className="flex flex-col items-center gap-2">
                        <div className="flex flex-wrap justify-center gap-x-8">
                            {["CASSAVA", "LEAF"].map((word, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0, filter: "blur(20px)", y: 100 }}
                                    animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                                    transition={{
                                        duration: 1.2,
                                        delay: 0.5 + i * 0.3,
                                        ease: [0.16, 1, 0.3, 1]
                                    }}
                                    className="text-7xl md:text-[10rem] lg:text-[14rem] font-ubuntu font-bold text-foreground hearth-glow-text leading-[0.8] tracking-tighter"
                                >
                                    {word}
                                </motion.span>
                            ))}
                        </div>
                        <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.5, delay: 1.2, ease: "easeOut" }}
                            className="text-5xl md:text-8xl lg:text-[9rem] font-ubuntu font-bold mt-[-0.1em] vibrant-gradient italic"
                        >
                            & RICE
                        </motion.span>
                    </h1>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    className="flex flex-wrap items-center justify-center gap-12 mb-20"
                >
                    <div className="flex items-center gap-4 group">
                        <div className="w-12 h-12 rounded-2xl heritage-glass flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                            <Flame className="w-6 h-6 text-accent animate-pulse" />
                        </div>
                        <div className="text-left">
                            <div className="text-[10px] font-black tracking-widest uppercase text-foreground/30">Hearth_Sync</div>
                            <div className="text-xs font-bold text-foreground">STABLE</div>
                        </div>
                    </div>
                    <div className="w-px h-12 bg-foreground/10" />
                    <div className="flex items-center gap-4 group">
                        <div className="w-12 h-12 rounded-2xl heritage-glass flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                            <Heart className="w-6 h-6 text-accent" />
                        </div>
                        <div className="text-left">
                            <div className="text-[10px] font-black tracking-widest uppercase text-foreground/30">Heritage_Bond</div>
                            <div className="text-xs font-bold text-foreground">ANCESTRAL</div>
                        </div>
                    </div>
                </motion.div>

                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 2.2, type: "spring", stiffness: 100 }}
                    onHoverStart={() => playSweep()}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        resetGame();
                        playSuccess();
                        nextStage();
                    }}
                    className="group relative px-20 py-10 bg-accent text-white rounded-[40px] font-black text-2xl tracking-[0.2em] overflow-hidden shadow-[0_20px_60px_-15px_rgba(226,114,91,0.5)] border-2 border-white/20"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                    <span className="relative z-10 flex items-center gap-6">
                        <Sparkles className="w-10 h-10 animate-float" />
                        BEGIN THE FEAST
                    </span>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                </motion.button>
            </motion.div>
        </div>
    );
}

