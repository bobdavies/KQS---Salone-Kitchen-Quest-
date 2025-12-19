"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Ingredient } from "@/lib/constants";
import { useState } from "react";
import { Info, Sparkles } from "lucide-react";
import { useAudio } from "@/app/hooks/useAudio";
import { useGame } from "@/lib/context";

interface IngredientCardProps {
    ingredient: Ingredient;
    onDrop: (id: string, x: number, y: number) => void;
}


export default function IngredientCard({ ingredient, onDrop }: IngredientCardProps) {
    const [isDragging, setIsDragging] = useState(false);
    const { playHover, playGlitch } = useAudio();
    const { theme, discoverLore, loreDiscovered } = useGame();
    const isDiscovered = loreDiscovered.includes(ingredient.id);

    return (
        <motion.div
            drag
            dragSnapToOrigin
            dragElastic={0.4}
            onHoverStart={() => {
                playHover();
                discoverLore(ingredient.id);
            }}
            onDragStart={() => {
                setIsDragging(true);
                playGlitch();
            }}
            onDragEnd={(event, info) => {
                setIsDragging(false);
                onDrop(ingredient.id, info.point.x, info.point.y);
            }}
            whileHover={{
                scale: 1.15,
                rotate: [0, -2, 2, 0],
                transition: { rotate: { repeat: Infinity, duration: 0.2 } }
            }}
            whileDrag={{ scale: 1.3, zIndex: 100, rotate: 5 }}
            className={`expert-card relative cursor-grab active:cursor-grabbing w-28 h-28 md:w-40 md:h-40 flex flex-col items-center justify-center rounded-[32px] md:rounded-[40px] transition-all duration-300 ${isDragging ? "drag-proxy scale-110" : ""
                }`}
        >
            {/* Discovery Ornament */}
            <AnimatePresence>
                {!isDiscovered && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center shadow-lg z-30"
                    >
                        <Info className="w-4 h-4 animate-pulse" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Inner Glow Background */}
            <div className={`absolute inset-4 rounded-[32px] transition-colors duration-1000 ${theme === 'dark' ? 'bg-accent/5' : 'bg-accent/10'
                }`} />

            <div className="relative z-10 flex flex-col items-center gap-2">
                <span className={`text-6xl md:text-7xl drop-shadow-2xl transition-transform ${isDragging ? "scale-110" : "group-hover:scale-110"}`}>
                    {ingredient.icon}
                </span>

                <div className="flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
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

