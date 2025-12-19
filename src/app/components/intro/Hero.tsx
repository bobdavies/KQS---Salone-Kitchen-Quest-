"use client";

import { useGame } from "@/lib/context";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Flame, Heart, Leaf, Sparkles, Map } from "lucide-react";
import Image from "next/image";
import { useAudio } from "@/app/hooks/useAudio";
import { useEffect, useState } from "react";

export default function Hero() {
    const { nextStage, resetGame, theme, toggleTheme } = useGame();
    const { playSweep, playSuccess } = useAudio();

    // Mouse Parallax Effect (Reduced for mobile)
    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const springX = useSpring(mouseX, { damping: 30, stiffness: 100 });
    const springY = useSpring(mouseY, { damping: 30, stiffness: 100 });

    const bgX = useTransform(springX, [0, 1], ["-2%", "2%"]);
    const bgY = useTransform(springY, [0, 1], ["-2%", "2%"]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX / window.innerWidth);
            mouseY.set(e.clientY / window.innerHeight);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div className="relative flex flex-col items-center justify-start md:justify-center min-h-[100dvh] w-full text-center p-4 md:p-12 bg-background overflow-x-hidden pt-24 md:pt-12">
            {/* Cinematic Background */}
            <motion.div
                style={{ x: bgX, y: bgY, scale: 1.05 }}
                className="fixed inset-0 z-0"
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
                </div>
            </motion.div>

            {/* Content */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative z-20 flex flex-col items-center w-full max-w-5xl"
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 md:mb-8 px-6 md:px-8 py-2 md:py-3 rounded-full border border-accent/20 bg-accent/5 text-accent text-[10px] md:text-[12px] font-black uppercase backdrop-blur-md"
                >
                    A Culinary Soul Journey
                </motion.div>

                <div className="relative mb-8 md:mb-12 w-full px-4">
                    <h1 className="flex flex-col items-center gap-1 md:gap-2">
                        <div className="flex flex-wrap justify-center gap-x-4 md:gap-x-8">
                            {["CASSAVA", "LEAF"].map((word, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + i * 0.2 }}
                                    className="text-[14vw] md:text-[10rem] lg:text-[14rem] font-ubuntu font-bold text-foreground hearth-glow-text leading-[0.8] tracking-tighter"
                                >
                                    {word}
                                </motion.span>
                            ))}
                        </div>
                        <motion.span
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1 }}
                            className="text-[10vw] md:text-8xl lg:text-[9rem] font-ubuntu font-bold mt-[-0.1em] vibrant-gradient italic"
                        >
                            & RICE
                        </motion.span>
                    </h1>
                </div>

                {/* Stats Stacking */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 mb-12 md:mb-20"
                >
                    <div className="flex items-center gap-4 group">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl heritage-glass flex items-center justify-center">
                            <Flame className="w-5 h-5 md:w-6 md:h-6 text-accent" />
                        </div>
                        <div className="text-left">
                            <div className="text-[9px] font-black tracking-widest uppercase opacity-30">Hearth_Sync</div>
                            <div className="text-xs font-bold text-foreground">STABLE</div>
                        </div>
                    </div>
                    <div className="hidden md:block w-px h-12 bg-foreground/10" />
                    <div className="flex items-center gap-4 group">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl heritage-glass flex items-center justify-center">
                            <Heart className="w-5 h-5 md:w-6 md:h-6 text-accent" />
                        </div>
                        <div className="text-left">
                            <div className="text-[9px] font-black tracking-widest uppercase opacity-30">Heritage_Bond</div>
                            <div className="text-xs font-bold text-foreground">ANCESTRAL</div>
                        </div>
                    </div>
                </motion.div>

                <motion.button
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    onHoverStart={() => playSweep()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        resetGame();
                        playSuccess();
                        nextStage();
                    }}
                    className="group relative w-full max-w-[320px] md:max-w-none md:w-auto px-12 md:px-20 py-6 md:py-10 bg-accent text-white rounded-[32px] md:rounded-[40px] font-black text-xl md:text-2xl tracking-[0.2em] overflow-hidden shadow-2xl border-2 border-white/20"
                >
                    <span className="relative z-10 flex items-center justify-center gap-6">
                        <Sparkles className="w-8 h-8 md:w-10 md:h-10" />
                        BEGIN FEAST
                    </span>
                </motion.button>
            </motion.div>

            {/* Theme Toggle (Mobile-friendly) */}
            <motion.button
                onClick={toggleTheme}
                className="absolute top-6 right-6 z-50 p-3 rounded-xl heritage-glass"
                whileTap={{ scale: 0.9 }}
            >
                <span className="text-lg">{theme === 'dark' ? '🌙' : '☀️'}</span>
            </motion.button>
        </div>
    );
}
