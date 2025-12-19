"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Ingredient } from "@/lib/constants";
import { useState, useRef, useEffect } from "react";
import { Info, Sparkles } from "lucide-react";
import { useAudio } from "@/app/hooks/useAudio";
import { useGame } from "@/lib/context";

interface IngredientCardProps {
    ingredient: Ingredient;
    onDrop: (id: string, x: number, y: number) => void;
    onTap: (id: string) => void;
    onHoldComplete?: (id: string) => void;
    onDragStart?: () => void;
    onDragEnd?: () => void;
}


export default function IngredientCard({ ingredient, onDrop, onTap, onHoldComplete, onDragStart, onDragEnd }: IngredientCardProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [holdProgress, setHoldProgress] = useState(0);
    const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const lastTapTimeRef = useRef<number>(0);
    const { playHover, playGlitch, playSuccess } = useAudio();
    const { theme, discoverLore, loreDiscovered } = useGame();
    const isDiscovered = loreDiscovered.includes(ingredient.id);

    const handleTap = () => {
        const now = Date.now();
        const DOUBLE_TAP_TIMEOUT = 300;

        if (now - lastTapTimeRef.current < DOUBLE_TAP_TIMEOUT) {
            // Double tap detected
            onTap(ingredient.id);
        }
        lastTapTimeRef.current = now;
    };

    const startHold = () => {
        if (window.innerWidth >= 768) return; // Only for mobile

        setHoldProgress(0);
        const startTime = Date.now();
        const targetDuration = 1500; // User asked for 1.5s

        holdTimerRef.current = setTimeout(() => {
            playSuccess();
            onHoldComplete?.(ingredient.id);
            stopHold();
        }, targetDuration);

        progressIntervalRef.current = setInterval(() => {
            const elapsed = Date.now() - startTime;
            setHoldProgress(Math.min((elapsed / targetDuration) * 100, 100));
        }, 30);
    };

    const stopHold = () => {
        if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        setHoldProgress(0);
    };

    useEffect(() => {
        return () => stopHold();
    }, []);

    return (
        <motion.div
            drag
            dragSnapToOrigin
            dragElastic={0.4}
            onTap={handleTap}
            onPointerDown={startHold}
            onPointerUp={stopHold}
            onPointerLeave={stopHold}
            onHoverStart={() => {
                if (window.innerWidth >= 768) {
                    playHover();
                    discoverLore(ingredient.id);
                }
            }}
            onDragStart={() => {
                stopHold(); // Stop hold if drag starts
                setIsDragging(true);
                playGlitch();
                onDragStart?.();
            }}
            onDragEnd={(event, info) => {
                setIsDragging(false);
                onDrop(ingredient.id, info.point.x, info.point.y);
                onDragEnd?.();
            }}
            whileHover={{
                scale: 1.1,
                rotate: [0, -1, 1, 0],
                transition: { rotate: { repeat: Infinity, duration: 0.3 } }
            }}
            whileDrag={{ scale: 1.25, zIndex: 100, rotate: 5 }}
            className={`expert-card relative cursor-grab active:cursor-grabbing w-24 h-24 md:w-36 md:h-36 lg:w-40 lg:h-40 flex flex-col items-center justify-center rounded-[28px] md:rounded-[40px] transition-all duration-300 ${isDragging ? "drag-proxy scale-110" : ""
                }`}
        >
            {/* Hold Progress Ring (Mobile only) */}
            {holdProgress > 0 && (
                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none z-20">
                    <circle
                        cx="50%"
                        cy="50%"
                        r="45%"
                        fill="none"
                        stroke="var(--accent)"
                        strokeWidth="4"
                        strokeDasharray="283"
                        strokeDashoffset={283 - (283 * holdProgress) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-100 ease-linear opacity-60"
                    />
                </svg>
            )}

            {/* Discovery Ornament */}
            <AnimatePresence>
                {!isDiscovered && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-6 h-6 md:w-8 md:h-8 rounded-full bg-accent text-white flex items-center justify-center shadow-lg z-30"
                    >
                        <Info className="w-3 h-3 md:w-4 md:h-4 animate-pulse" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Inner Glow Background */}
            <div className={`absolute inset-3 md:inset-4 rounded-[24px] md:rounded-[32px] transition-colors duration-1000 ${theme === 'dark' ? 'bg-accent/5' : 'bg-accent/10'
                }`} />

            <div className="relative z-10 flex flex-col items-center gap-1 md:gap-2">
                <span className={`text-5xl md:text-7xl drop-shadow-2xl transition-transform ${isDragging ? "scale-110" : "group-hover:scale-110"}`}>
                    {ingredient.icon}
                </span>

                <div className="hidden md:flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                    <div className="text-[10px] font-black text-accent uppercase tracking-[0.3em]">{ingredient.label}</div>
                    <div className="flex items-center gap-1 mt-1">
                        <Sparkles className="w-2 h-2 text-heritage-gold" />
                        <span className="text-[8px] font-bold text-foreground/40 uppercase tracking-widest leading-none">Heritage Grade</span>
                    </div>
                </div>
            </div>

            {/* Subtle Reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
            <div className="absolute inset-0 woven-texture opacity-[0.03] pointer-events-none" />
        </motion.div>
    );
}
