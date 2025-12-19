"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/lib/context";
import { useAudio } from "@/app/hooks/useAudio";
import { Flame, Heart, Sprout, ShoppingBag, Info } from "lucide-react";
import GhostHint from "../shared/GhostHint";

const INITIAL_CUBES = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
];

export default function IngredientDrop() {
    const { nextStage, theme } = useGame();
    const [cubes, setCubes] = useState(INITIAL_CUBES);
    const [droppedCount, setDroppedCount] = useState(0);
    const [hasStartedAudio, setHasStartedAudio] = useState(false);
    const [splashes, setSplashes] = useState<{ id: number, x: number, y: number }[]>([]);
    const { playSplash, playSimmer, stopSimmer, playSuccess } = useAudio();
    const isComplete = droppedCount === INITIAL_CUBES.length;

    const ensureAudio = useCallback(() => {
        if (!hasStartedAudio && !isComplete) {
            playSimmer();
            setHasStartedAudio(true);
        }
    }, [hasStartedAudio, isComplete, playSimmer]);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (!isComplete) {
            timer = setTimeout(ensureAudio, 500);
        } else {
            stopSimmer();
        }
        return () => {
            clearTimeout(timer);
            stopSimmer();
        };
    }, [isComplete, ensureAudio, stopSimmer]);

    const handleDragEnd = useCallback((id: number, info: any) => {
        const pot = document.querySelector(".pot-target");
        if (!pot) return;

        const potRect = pot.getBoundingClientRect();
        const { x, y } = info.point;

        if (
            x >= potRect.left &&
            x <= potRect.right &&
            y >= potRect.top &&
            y <= potRect.bottom
        ) {
            playSplash();
            const sid = Date.now();
            setSplashes(prev => [...prev, { id: sid, x: info.point.x, y: info.point.y }]);
            setTimeout(() => setSplashes(prev => prev.filter(s => s.id !== sid)), 1000);

            setCubes(prev => prev.filter(c => c.id !== id));
            setDroppedCount(prev => prev + 1);

            if (droppedCount + 1 === INITIAL_CUBES.length) {
                playSuccess();
            }
        }
    }, [droppedCount, playSplash, playSuccess]);

    useEffect(() => {
        if (isComplete) {
            const timer = setTimeout(nextStage, 2500);
            return () => clearTimeout(timer);
        }
    }, [isComplete, nextStage]);

    return (
        <div
            onPointerDown={ensureAudio}
            className="relative min-h-[100dvh] w-full flex flex-col items-center justify-start py-12 md:py-24 p-4 md:p-12 overflow-x-hidden bg-background"
        >
            {/* Background Ambience */}
            <div className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 opacity-20 ${theme === 'dark' ? 'bg-accent/10' : 'bg-accent/20'
                }`} />

            <div className="relative z-10 w-full max-w-7xl flex flex-col items-center gap-12 md:gap-24">

                {/* Header: Title */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center w-full"
                >
                    <div className="flex items-center gap-3 mb-4 justify-center">
                        <Flame className="w-5 h-5 text-accent animate-pulse" />
                        <span className="text-[10px] font-black tracking-[0.5em] text-foreground/40 uppercase">Hearth Phase: 03</span>
                    </div>
                    <h2 className="text-[10vw] md:text-8xl lg:text-[10rem] font-ubuntu font-bold text-foreground leading-[0.9] hearth-glow-text mb-8">
                        Protein <br />
                        <span className="vibrant-gradient italic">Infusion</span>
                    </h2>
                </motion.div>

                <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-32 w-full">

                    {/* Visual: The Sacred Clay Pot */}
                    <div className="relative">
                        <div className={`relative w-64 h-64 md:w-[450px] md:h-[450px] lg:w-[600px] lg:h-[600px] rounded-full border-4 transition-all duration-1000 p-8 flex items-center justify-center shadow-2xl overflow-hidden pot-target
                            ${theme === 'dark' ? 'border-accent/10 bg-black/40' : 'border-accent/20 bg-white/60'}
                        `}>
                            <div className="absolute inset-0 woven-texture opacity-20 pointer-events-none" />

                            <div className="z-10 text-center pointer-events-none">
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="text-7xl md:text-[14rem] drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                                >
                                    🥘
                                </motion.div>
                                <div className="mt-8 md:mt-12 text-accent font-black text-[10px] md:text-sm uppercase tracking-[0.6em] opacity-40">The Hearth Pot</div>
                            </div>

                            <AnimatePresence>
                                {splashes.map(splash => (
                                    <motion.div
                                        key={splash.id}
                                        initial={{ scale: 0, opacity: 1 }}
                                        animate={{ scale: 3, opacity: 0 }}
                                        className="absolute w-24 h-24 bg-accent/30 rounded-full blur-2xl left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Stats & Interaction Cards */}
                    <div className="flex flex-col items-center gap-12 w-full max-w-md">
                        <div className="expert-card p-8 md:p-10 rounded-[40px] border-accent/20 space-y-6 w-full">
                            <div className="space-y-4">
                                <div className="w-full h-3 bg-foreground/5 rounded-full overflow-hidden p-[2px]">
                                    <motion.div
                                        animate={{ width: `${(droppedCount / INITIAL_CUBES.length) * 100}%` }}
                                        className="h-full bg-accent rounded-full shadow-[0_0_20px_var(--accent)]"
                                    />
                                </div>
                                <div className="flex items-center justify-between text-[10px] font-black text-foreground/40 uppercase tracking-[0.3em]">
                                    <div className="flex items-center gap-2">
                                        <Sprout className="w-3 h-3 text-accent" />
                                        <span>Essence_Ratio</span>
                                    </div>
                                    <span>{Math.floor((droppedCount / INITIAL_CUBES.length) * 100)}%</span>
                                </div>
                            </div>
                        </div>

                        {/* Handful of Grains/Meat */}
                        <div className="grid grid-cols-2 gap-4 md:gap-8 w-full">
                            <AnimatePresence>
                                {cubes.map((cube) => (
                                    <motion.div
                                        key={cube.id}
                                        drag dragSnapToOrigin onDragEnd={(_, info) => handleDragEnd(cube.id, info)}
                                        whileHover={{ scale: 1.1 }}
                                        whileDrag={{ scale: 1.3, zIndex: 100 }}
                                        className="relative w-full aspect-square md:w-32 md:h-32 rounded-[32px] md:rounded-[40px] expert-card border-2 border-accent/20 flex items-center justify-center cursor-grab active:cursor-grabbing group overflow-hidden shadow-xl"
                                    >
                                        <span className="text-5xl md:text-6xl z-10 drop-shadow-2xl">🥩</span>
                                        <div className="absolute inset-x-0 bottom-0 bg-accent/90 backdrop-blur-md text-[8px] font-black text-white py-2 uppercase tracking-widest text-center">
                                            Infusion
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                <div className="text-center px-6">
                    <p className="text-foreground/30 text-xs font-inter leading-relaxed italic max-w-[280px] mx-auto">
                        &quot;Strength is added with a calm mind, letting each piece find its place in the harmony.&quot;
                    </p>
                </div>
            </div>

            <GhostHint type="drag" />
        </div>
    );
}
