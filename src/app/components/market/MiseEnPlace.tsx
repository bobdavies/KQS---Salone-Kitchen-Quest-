"use client";

import { useState, useRef, useEffect } from "react";
import { useGame } from "@/lib/context";
import { INGREDIENTS } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import IngredientCard from "./IngredientCard";
import { useAudio } from "@/app/hooks/useAudio";
import GhostHint from "../shared/GhostHint";
import { ShoppingBag, Heart, Sprout, Sparkles, X } from "lucide-react";

export default function MiseEnPlace() {
    const { addIngredient, ingredientsCollected, nextStage, theme, loreDiscovered, discoverLore } = useGame();
    const [isComplete, setIsComplete] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [hoveredIngredient, setHoveredIngredient] = useState<string | null>(null);
    const [selectedIngredientId, setSelectedIngredientId] = useState<string | null>(null);
    const [isDraggingAny, setIsDraggingAny] = useState(false);
    const { playSuccess, playSweep, playHover } = useAudio();
    const bowlRef = useRef<HTMLDivElement>(null);

    const availableIngredients = INGREDIENTS.filter(
        (ing) => !ingredientsCollected.includes(ing.id)
    );

    const handleDrop = (ingredientId: string, x: number, y: number) => {
        setIsDraggingAny(false);

        // Use document.elementsFromPoint for robust hit detection (handles overlapping elements)
        const elementsAtPoint = document.elementsFromPoint(x, y);
        const isOverBasket = elementsAtPoint.some(el =>
            el === bowlRef.current || bowlRef.current?.contains(el)
        );

        if (isOverBasket) {
            addIngredient(ingredientId);
        }
    };

    const handleTapOrClick = (id: string) => {
        // Trigger pop-up for mobile lore
        setSelectedIngredientId(id);
        discoverLore(id);
        playHover();
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

    const selectedIngredient = INGREDIENTS.find(i => i.id === selectedIngredientId);

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
                className="relative min-h-[100dvh] w-full flex flex-col items-center justify-start p-4 md:p-12 bg-background overflow-x-hidden pt-12 md:pt-24 pb-8 md:pb-12"
            >
                {/* Background Atmosphere */}
                <div className="absolute inset-0 pointer-events-none opacity-30">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,var(--accent),transparent_60%)]" />
                </div>

                {/* Header Section */}
                <div className="relative z-10 w-full max-w-7xl flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12 mb-8 md:mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-center md:text-left"
                    >
                        <div className="flex items-center gap-3 mb-2 md:mb-4 justify-center md:justify-start">
                            <ShoppingBag className="w-5 h-5 text-accent animate-pulse" />
                            <span className="text-[10px] font-black tracking-[0.5em] text-foreground/40 uppercase">Hearth Phase: 01</span>
                        </div>
                        <h2 className="text-[10vw] md:text-8xl lg:text-9xl font-ubuntu font-bold text-foreground hearth-glow-text leading-[0.9]">
                            Village <br />
                            <span className="vibrant-gradient italic">Market</span>
                        </h2>
                        {/* Mobile Hint */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="mt-4 md:hidden text-[10px] font-black text-accent/60 uppercase tracking-[0.2em] flex flex-col gap-1 items-center"
                        >
                            <span>Tap to Collect</span>
                            <span className="opacity-40">•</span>
                            <span>Double Tap for Story</span>
                        </motion.div>
                    </motion.div>

                    {/* Discovery Status / Lore Progress */}
                    <div className="flex flex-col items-center md:items-end gap-4">
                        <div className="expert-card p-4 md:p-6 rounded-[32px] md:rounded-[40px] flex items-center gap-4 md:gap-8">
                            <div className="relative scale-75 md:scale-100">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="absolute -inset-4 border border-dashed border-accent/30 rounded-full"
                                />
                                <div className="text-3xl md:text-4xl text-accent drop-shadow-[0_0_10px_var(--accent)]">🧺</div>
                            </div>
                            <div>
                                <div className="text-[9px] font-black text-accent uppercase tracking-[0.3em] mb-1">Basket Status</div>
                                <div className="text-2xl md:text-3xl font-ubuntu font-bold text-foreground flex items-baseline gap-2 leading-none">
                                    {ingredientsCollected.length}
                                    <span className="text-xs text-foreground/20 font-black">/ {INGREDIENTS.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Central Market Shelf & Lore */}
                <div className="relative z-10 w-full max-w-7xl flex flex-col lg:flex-row gap-8 md:gap-12 items-center justify-center py-4 md:py-8">
                    <div className="flex-1 w-full">
                        <motion.div
                            layout
                            className="flex flex-wrap items-center justify-center gap-3 md:gap-8"
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
                                        <IngredientCard
                                            ingredient={ing}
                                            onDrop={handleDrop}
                                            onTap={handleTapOrClick}
                                            onHoldComplete={(id) => addIngredient(id)}
                                            onDragStart={() => setIsDraggingAny(true)}
                                            onDragEnd={() => setIsDraggingAny(false)}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    </div>

                    {/* Lore Side Panel (Desktop only) */}
                    <AnimatePresence>
                        {(hoveredIngredient || loreDiscovered.length > 0) && (
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 50 }}
                                className="hidden lg:block w-80 expert-card p-8 rounded-[48px] border-accent/20 h-max self-center"
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
                                        <div className="text-4xl mb-4 opacity-50 text-accent">🏺</div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20">Hover an item to see its story</p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Interaction Footer (Basket) */}
                <div className="relative z-20 w-full max-w-7xl flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 pb-8 md:pb-12 mt-4 md:mt-auto">
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
                        animate={isComplete
                            ? { scale: 1.1, boxShadow: "0 0 100px var(--accent)" }
                            : isDraggingAny
                                ? { scale: 1.05, borderColor: "var(--accent)", borderStyle: "solid" }
                                : {}
                        }
                        className={`relative w-full max-w-[300px] md:max-w-none md:w-96 h-24 md:h-32 rounded-full border-2 border-dashed transition-all duration-700 flex items-center justify-center gap-6 overflow-hidden shadow-2xl basket-hit-target
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
                            <div className={`flex items-center gap-6 transition-opacity ${isDraggingAny ? "opacity-100" : "opacity-40"}`}>
                                <div className="text-3xl md:text-4xl animate-float">🥘</div>
                                <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.5em]">Toss To Pot</span>
                            </div>
                        )}

                        {/* Drop Zone Highlight */}
                        {isDraggingAny && !isComplete && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 bg-accent/10 border-2 border-accent rounded-full animate-pulse-slow pointer-events-none"
                            />
                        )}
                    </motion.div>

                    <GhostHint type="drag" />
                </div>
            </motion.div>

            {/* Mobile Lore Pop-up Overlay (Only for Mobile) */}
            <AnimatePresence>
                {selectedIngredient && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] flex items-center justify-center p-6 lg:hidden"
                        onClick={() => setSelectedIngredientId(null)}
                    >
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="relative w-full max-w-sm expert-card p-8 rounded-[40px] border-accent/40 shadow-2xl flex flex-col items-center text-center gap-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedIngredientId(null)}
                                className="absolute top-6 right-6 p-2 rounded-full hover:bg-foreground/5 transition-colors"
                            >
                                <X className="w-5 h-5 text-foreground/40" />
                            </button>

                            <div className="p-4 rounded-3xl bg-accent/10 border border-accent/20">
                                <span className="text-6xl">{selectedIngredient.icon}</span>
                            </div>

                            <div className="space-y-4">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="flex items-center gap-2 text-accent">
                                        <Heart className="w-4 h-4 fill-current" />
                                        <span className="text-[10px] font-black tracking-widest uppercase">Market Ancestry</span>
                                    </div>
                                    <h3 className="text-3xl font-ubuntu font-bold text-foreground uppercase tracking-widest">
                                        {selectedIngredient.label}
                                    </h3>
                                </div>
                                <p className="text-sm font-inter text-foreground/60 leading-relaxed italic">
                                    "Every leaf chosen with care brings the spirit of the ancestors to the hearth. Handle with love."
                                </p>
                            </div>

                            <div className="w-full h-[1px] bg-foreground/10" />
                            <span className="text-[9px] font-black text-accent/60 uppercase tracking-[0.3em]">Tap anywhere to close</span>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Cinematic Transition Flash */}
            <AnimatePresence>
                {isTransitioning && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-background flex items-center justify-center"
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
