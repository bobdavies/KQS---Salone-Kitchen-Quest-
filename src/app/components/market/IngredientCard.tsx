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
    const tapTimerRef = useRef<NodeJS.Timeout | null>(null);
    const lastTapTimeRef = useRef<number>(0);
    const { playHover, playGlitch, playSuccess } = useAudio();
    const { theme, discoverLore, loreDiscovered } = useGame();
    const isDiscovered = loreDiscovered.includes(ingredient.id);

    const handleTap = () => {
        if (window.innerWidth >= 768) {
            // Desktop behavior (Lore on hover, so maybe lore on tap too? 
            // The user only specified mobile change)
            onTap(ingredient.id);
            return;
        }

        const now = Date.now();
        const DOUBLE_TAP_TIMEOUT = 300;

        if (now - lastTapTimeRef.current < DOUBLE_TAP_TIMEOUT) {
            // Double tap detected -> Show Ancestry Lore
            if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
            onTap(ingredient.id);
            lastTapTimeRef.current = 0; // Reset
        } else {
            // Potential single tap -> Collect
            lastTapTimeRef.current = now;
            tapTimerRef.current = setTimeout(() => {
                // If it was a single tap, add to basket
                playSuccess();
                onHoldComplete?.(ingredient.id); // Reusing onHoldComplete as onSingleTap
                lastTapTimeRef.current = 0;
            }, DOUBLE_TAP_TIMEOUT);
        }
    };

    useEffect(() => {
        return () => {
            if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
        };
    }, []);

    return (
        <motion.div
            drag
            dragSnapToOrigin
            dragElastic={0.4}
            onTap={handleTap}
            onHoverStart={() => {
                if (window.innerWidth >= 768) {
                    playHover();
                    discoverLore(ingredient.id);
                }
            }}
            onDragStart={() => {
                if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
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
