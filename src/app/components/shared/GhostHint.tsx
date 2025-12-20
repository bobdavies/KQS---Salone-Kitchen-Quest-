"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Hand, MousePointer2, Fingerprint } from "lucide-react";

interface GhostHintProps {
    type: "drag" | "hold" | "swipe" | "tap";
    idleTime?: number;
}

export default function GhostHint({ type, idleTime = 4000 }: GhostHintProps) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        const resetTimer = () => {
            setShow(false);
            clearTimeout(timer);
            timer = setTimeout(() => setShow(true), idleTime);
        };

        window.addEventListener("mousemove", resetTimer);
        window.addEventListener("mousedown", resetTimer);
        window.addEventListener("touchstart", resetTimer);
        window.addEventListener("keydown", resetTimer);

        resetTimer();

        return () => {
            window.removeEventListener("mousemove", resetTimer);
            window.removeEventListener("mousedown", resetTimer);
            window.removeEventListener("touchstart", resetTimer);
            window.removeEventListener("keydown", resetTimer);
            clearTimeout(timer);
        };
    }, [idleTime]);

    const variants = {
        drag: {
            initial: { x: -50, opacity: 0 },
            animate: { x: 50, opacity: [0, 1, 1, 0] },
            icon: Hand
        },
        hold: {
            initial: { scale: 1, opacity: 0 },
            animate: { scale: [1, 0.8, 1], opacity: [0, 1, 1, 0] },
            icon: Fingerprint
        },
        swipe: {
            initial: { y: 50, opacity: 0 },
            animate: { y: -50, opacity: [0, 1, 1, 0] },
            icon: MousePointer2
        },
        tap: {
            initial: { scale: 1, opacity: 0 },
            animate: { scale: [1, 1.2, 0.9, 1], opacity: [0, 1, 1, 0] },
            icon: MousePointer2
        }
    };

    const Icon = variants[type].icon;

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed bottom-24 left-1/2 -translate-x-1/2 pointer-events-none z-[100] flex flex-col items-center"
                >
                    <div className="relative">
                        <motion.div
                            animate={variants[type].animate}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="p-4 rounded-full border border-heritage-gold/40 bg-heritage-gold/10 backdrop-blur-md shadow-[0_0_20px_rgba(255,184,0,0.2)]"
                        >
                            <Icon className="w-8 h-8 text-heritage-gold" />
                        </motion.div>

                        {/* Heritage Pulse Signal */}
                        <div className="absolute inset-0 border border-heritage-gold/20 rounded-full animate-ping" />
                    </div>

                    <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="mt-4 text-[10px] font-ubuntu font-bold tracking-[0.5em] text-heritage-gold uppercase"
                    >
                        Awaiting_{type}_input
                    </motion.span>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
