"use client";

import { useState, useRef, useEffect } from "react";
import { useGame } from "@/lib/context";
import { INGREDIENTS } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import IngredientCard from "./IngredientCard";
import { useAudio } from "@/app/hooks/useAudio";
import GhostHint from "../shared/GhostHint";
import { ShoppingBag, Heart, Sprout, Sparkles } from "lucide-react";

export default function MiseEnPlace() {
    const { addIngredient, ingredientsCollected, nextStage, resetGame, theme, loreDiscovered } = useGame();
    const [isComplete, setIsComplete] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [hoveredIngredient, setHoveredIngredient] = useState<string | null>(null);
    const { playSuccess, playSweep } = useAudio();
    const bowlRef = useRef<HTMLDivElement>(null);

    const availableIngredients = INGREDIENTS.filter(
        (ing) => !ingredientsCollected.includes(ing.id)
    );

    const handleDrop = (ingredientId: string, x: number, y: number) => {
        if (bowlRef.current) {
            const rect = bowlRef.current.getBoundingClientRect();
            if (
                x >= rect.left &&
                x <= rect.right &&
                y >= rect.top &&
                y <= rect.bottom
            ) {
                addIngredient(ingredientId);
            }
        }
    };

    useEffect(() => {
        if (ingredientsCollected.length === INGREDIENTS.length && !isComplete) {
            setIsComplete(true);
        }
    }, [ingredientsCollected.length, isComplete]);

    useEffect(() => {
        if (isComplete) {
            playSuccess();
            const vortexTimer = setTimeout(() => {
                setIsTransitioning(true);
                playSweep();
            }, 1000);

            const transitionTimer = setTimeout(() => {
                nextStage();
            }, 3000);

            return () => {
                clearTimeout(vortexTimer);
                clearTimeout(transitionTimer);
            };
        }
    }, [isComplete, nextStage, playSuccess, playSweep]);

    return (
        <>
            <motion.div
                animate={isTransitioning ? {
                    scale: [1, 1.1, 0],
                    rotate: [0, -10, 1080],
                    filter: ["blur(0px)", "blur(10px)", "blur(100px)"],
                    opacity: [1, 1, 0],
                } : {}}
                transition={{ duration: 2, ease: "easeIn" }}
                className="relative min-h-[100dvh] w-full flex flex-col items-center justify-start p-4 md:p-12 bg-background overflow-x-hidden pt-12 md:pt-24 pb-32 md:pb-12"
            >
                {/* Background Atmosphere */}
                <div className="absolute inset-0 pointer-events-none opacity-30">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,var(--accent),transparent_60%)]" />
                </div>

                {/* Header Section */}
                <div className="relative z-10 w-full max-w-7xl flex flex-col md:flex-row justify-between items-center gap-12 mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-center md:text-left"
                    >
                        <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                            <ShoppingBag className="w-5 h-5 text-accent animate-pulse" />
                            <span className="text-[10px] font-black tracking-[0.5em] text-foreground/40 uppercase">Hearth Phase: 01</span>
                        </div>
                        <h2 className="text-[12vw] md:text-8xl lg:text-9xl font-ubuntu font-bold text-foreground hearth-glow-text leading-[0.9]">
                            Village <br />
                            <span className="vibrant-gradient italic">Market</span>
                        </h2>
                    </motion.div>

                    {/* Discovery Status / Lore Progress */}
                    <div className="flex flex-col items-center md:items-end gap-4">
                        <div className="expert-card p-6 rounded-[40px] flex items-center gap-8">
                            <div className="relative">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="absolute -inset-4 border border-dashed border-accent/30 rounded-full"
                                />
                                <div className="text-4xl">🧺</div>
                            </div>
                            <div>
                                <div className="text-[9px] font-black text-accent uppercase tracking-[0.3em] mb-1">Basket Status</div>
                                <div className="text-3xl font-ubuntu font-bold text-foreground flex items-baseline gap-2 leading-none">
                                    {ingredientsCollected.length}
                                    <span className="text-xs text-foreground/20 font-black">/ {INGREDIENTS.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Central Market Shelf */}
                <div className="relative z-10 w-full max-w-7xl flex flex-col lg:flex-row gap-12 items-center justify-center py-8">
                    <div className="flex-1 overflow-hidden">
                        <motion.div
                            layout
                            className="flex flex-wrap items-center justify-center gap-4 md:gap-10"
                        >
                            <AnimatePresence mode="popLayout">
                                {availableIngredients.map((ing, i) => (
                                    <motion.div
                                        key={ing.id}
                                        initial={{ opacity: 0, scale: 0.5, y: 50 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0, filter: "blur(20px)" }}
                                        transition={{ duration: 0.5, delay: i * 0.05 }}
                                        onHoverStart={() => setHoveredIngredient(ing.id)}
                                        onHoverEnd={() => setHoveredIngredient(null)}
                                    >
                                        <IngredientCard ingredient={ing} onDrop={handleDrop} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    </div>

                    {/* Lore Side Panel (Expert Feature) */}
                    <AnimatePresence>
                        {(hoveredIngredient || loreDiscovered.length > 0) && (
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 50 }}
                                className="w-full lg:w-80 expert-card p-8 rounded-[48px] border-accent/20 h-max self-center"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 rounded-2xl bg-accent text-white">
                                        <Heart className="w-5 h-5 fill-current" />
                                    </div>
                                    <div className="text-[10px] font-black tracking-widest uppercase text-foreground/40 leading-none">Market Ancestry</div>
                                </div>

                                {hoveredIngredient ? (
                                    <div className="space-y-4">
                                        <h3 className="text-2xl font-ubuntu font-bold text-foreground uppercase tracking-widest">
                                            {INGREDIENTS.find(i => i.id === hoveredIngredient)?.label}
                                        </h3>
                                        <p className="text-sm font-inter text-foreground/60 leading-relaxed italic">
                                            "Every leaf chosen with care brings the spirit of the ancestors to the hearth. Handle with love."
                                        </p>
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <div className="text-4xl mb-4 opacity-50">🏺</div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20">Hover an item to see its story</p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Interaction Footer */}
                <div className="relative z-20 w-full max-w-7xl flex flex-col md:flex-row items-center justify-between gap-12 pb-12 mt-auto">
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <div className="flex items-center gap-4 mb-2">
                            <Sprout className="w-5 h-5 text-accent animate-bounce" />
                            <span className="text-[10px] font-black text-accent tracking-[0.5em] uppercase">The First Rule</span>
                        </div>
                        <p className="max-w-xs text-xs text-foreground/40 font-inter leading-relaxed italic">
                            "Selection is the first act of cooking. Gather only what your soul requires."
                        </p>
                    </div>

                    <motion.div
                        ref={bowlRef}
                        animate={isComplete ? { scale: 1.1, boxShadow: "0 0 100px var(--accent)" } : {}}
                        className={`relative w-80 md:w-96 h-32 rounded-full border-2 border-dashed transition-all duration-700 flex items-center justify-center gap-6 overflow-hidden shadow-2xl
                        ${isComplete
                                ? "bg-accent border-white text-white"
                                : "heritage-glass border-accent/20 text-foreground"
                            }
                        `}
                    >
                        <div className="absolute inset-0 woven-texture opacity-[0.05]" />

                        {isComplete ? (
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={nextStage}
                                className="w-full h-full flex items-center justify-center gap-4 font-black tracking-[0.4em] uppercase"
                            >
                                <Sparkles className="w-8 h-8" />
                                MOVE TO PREP
                            </motion.button>
                        ) : (
                            <div className="flex items-center gap-6 opacity-40">
                                <div className="text-4xl animate-float">🥘</div>
                                <span className="text-xs font-black uppercase tracking-[0.5em]">Toss To Pot</span>
                            </div>
                        )}
                    </motion.div>

                    <GhostHint type="drag" />
                </div>
            </motion.div>

            {/* Cinematic Transition Flash */}
            <AnimatePresence>
                {isTransitioning && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
                    >
                        <motion.div
                            animate={{ scale: [1, 20, 0], rotate: [0, 45, 90] }}
                            transition={{ duration: 1.5, ease: "circIn" }}
                            className="w-1 h-1 bg-accent rounded-full blur-xl"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}


