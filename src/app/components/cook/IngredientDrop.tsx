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
            className="relative h-full w-full flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden bg-background transition-colors duration-1000"
        >
            {/* Background Ambience */}
            <div className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 opacity-20 ${theme === 'dark' ? 'bg-accent/10' : 'bg-accent/20'
                }`} />

            <div className="relative z-10 w-full max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">

                {/* Left: Flame Stats */}
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-12"
                    >
                        <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
                            <Flame className="w-5 h-5 text-accent animate-pulse" />
                            <span className="text-[10px] font-black tracking-[0.5em] text-foreground/40 uppercase">Hearth Phase: 03</span>
                        </div>
                        <h2 className="text-6xl md:text-8xl lg:text-[10rem] font-ubuntu font-bold text-foreground leading-none hearth-glow-text">
                            Protein <br />
                            <span className="vibrant-gradient italic">Infusion</span>
                        </h2>
                    </motion.div>

                    <div className="expert-card p-10 rounded-[50px] border-accent/20 space-y-8 w-full max-w-sm">
                        <div className="flex items-center gap-6 text-accent">
                            <div className="p-4 rounded-3xl bg-accent/10 border border-accent/20">
                                <ShoppingBag className="w-8 h-8" />
                            </div>
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-[0.4em] mb-1 opacity-50">Infusion_Mode</div>
                                <div className="text-2xl font-ubuntu font-bold text-foreground">RITUAL_SYNC</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="w-full h-3 bg-foreground/5 rounded-full overflow-hidden p-[2px]">
                                <motion.div
                                    animate={{ width: `${(droppedCount / INITIAL_CUBES.length) * 100}%` }}
                                    className="h-full bg-accent rounded-full shadow-[0_0_30px_var(--accent)]"
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
                </div>

                {/* Center: The Sacred Clay Pot */}
                <div className="relative order-1 lg:order-2">
                    <motion.div className="relative w-64 h-64 md:w-[600px] md:h-[600px]">
                        {/* Steam Particles */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            {[...Array(10)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        y: [0, -350],
                                        x: [0, Math.sin(i) * 100],
                                        opacity: [0, 0.4, 0],
                                        scale: [1, 4]
                                    }}
                                    transition={{
                                        duration: 4 + i,
                                        repeat: Infinity,
                                        delay: i * 0.3
                                    }}
                                    className="absolute w-16 h-16 bg-white/10 blur-3xl rounded-full"
                                />
                            ))}
                        </div>

                        {/* The Pot Target */}
                        <div className={`relative w-full h-full rounded-full border-4 transition-all duration-1000 p-12 flex items-center justify-center shadow-2xl overflow-hidden pot-target
                            ${theme === 'dark' ? 'border-accent/10 bg-black/40' : 'border-accent/20 bg-white/60'}
                        `}>
                            <div className="absolute inset-0 woven-texture opacity-20 pointer-events-none" />

                            <motion.div
                                animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-10 border-2 border-accent/10 border-t-accent/40 rounded-full blur-sm"
                            />

                            <div className="z-10 text-center pointer-events-none">
                                <div className="text-accent font-black text-sm uppercase tracking-[1em] mb-4 opacity-40">The Hearth Pot</div>
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="text-8xl md:text-[14rem] drop-shadow-[0_40px_80px_rgba(0,0,0,0.6)]"
                                >
                                    🥘
                                </motion.div>
                            </div>

                            {/* Particle Explosions on drop */}
                            <AnimatePresence>
                                {splashes.map(splash => (
                                    <motion.div
                                        key={splash.id}
                                        initial={{ scale: 0, opacity: 1 }}
                                        animate={{ scale: 3, opacity: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute w-24 h-24 bg-accent/30 rounded-full blur-2xl"
                                        style={{ left: '40%', top: '40%' }} // Simplified center splash
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>

                {/* Right: Interaction Tokens */}
                <div className="flex flex-col items-center gap-12 order-3">
                    <div className="text-center lg:text-right">
                        <div className="text-accent font-black text-[10px] uppercase tracking-[0.6em] mb-4">The Ritual Infusion</div>
                        <p className="text-foreground/30 text-xs font-inter max-w-[240px] leading-relaxed italic">
                            &quot;The protein is the strength. Add it with a calm mind, letting each piece find its place in the harmony.&quot;
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 p-10 expert-card rounded-[50px] border-accent/20">
                        <AnimatePresence>
                            {cubes.map((cube) => (
                                <motion.div
                                    key={cube.id}
                                    drag
                                    dragSnapToOrigin
                                    dragElastic={0.1}
                                    onDragEnd={(_, info) => handleDragEnd(cube.id, info)}
                                    whileHover={{
                                        scale: 1.1,
                                        rotate: [0, -3, 3, 0],
                                        transition: { rotate: { repeat: Infinity, duration: 0.2 } }
                                    }}
                                    whileDrag={{ scale: 1.3, zIndex: 100, rotate: 10 }}
                                    className="relative w-28 h-28 md:w-32 md:h-32 rounded-[40px] expert-card border-2 border-accent/20 flex items-center justify-center cursor-grab active:cursor-grabbing group overflow-hidden shadow-2xl transition-all"
                                >
                                    <div className="absolute inset-0 woven-texture opacity-10" />
                                    <span className="text-6xl z-10 drop-shadow-2xl transform transition-transform group-hover:scale-110">🥩</span>
                                    <div className="absolute inset-x-0 bottom-0 bg-accent/80 backdrop-blur-md text-[8px] font-black text-white py-3 uppercase tracking-widest text-center">
                                        Heritage Protein
                                    </div>
                                    <div className="absolute top-3 right-3">
                                        <Heart className="w-4 h-4 text-accent/20 fill-current" />
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    <div className="flex items-center gap-4 text-foreground/10 uppercase font-black text-[9px] tracking-[0.5em]">
                        <Info className="w-4 h-4" />
                        Status: {isComplete ? "COVENANT_LOCKED" : "SYNERGY_PENDING"}
                    </div>
                </div>
            </div>

            <GhostHint type="drag" />
        </div>
    );
}

