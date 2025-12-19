"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface SeedParticle {
    id: number;
    x: string;
    y: string;
    size: number;
    duration: number;
    delay: number;
    type: 'spice' | 'steam';
}

export default function HeritageAtmosphere() {
    const [particles, setParticles] = useState<SeedParticle[]>([]);

    useEffect(() => {
        const generated = Array.from({ length: 30 }).map((_, i) => ({
            id: i,
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            size: Math.random() * 4 + 2,
            duration: Math.random() * 15 + 10,
            delay: Math.random() * -20,
            type: Math.random() > 0.6 ? 'steam' : 'spice'
        }));
        setParticles(generated as SeedParticle[]);
    }, []);

    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-hearth-void">
            {/* Deep Earth Base Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(226,114,91,0.08)_0%,transparent_70%)]" />

            {/* Ambient Sunbeams / Rays */}
            <div className="absolute inset-0 opacity-20 overflow-hidden">
                <motion.div
                    animate={{ x: [-20, 20, -20], rotate: [0, 5, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-20%] left-[-10%] w-[150%] h-[150%] bg-[conic-gradient(from_0deg_at_50%_0%,transparent_0%,rgba(255,184,0,0.1)_10%,transparent_20%)] blur-[40px]"
                />
            </div>

            {/* Woven Texture Overlay */}
            <div className="absolute inset-0 woven-texture" />

            {/* Drifting Particles (Spice and Steam) */}
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{ x: p.x, y: p.y, opacity: 0 }}
                    animate={{
                        y: ["110vh", "-10vh"],
                        x: [p.x, `calc(${p.x} + ${Math.random() * 100 - 50}px)`],
                        opacity: [0, 0.4, 0.4, 0],
                        scale: [0.8, 1.2, 0.8]
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "linear"
                    }}
                    className={`absolute rounded-full pointer-events-none ${p.type === 'spice'
                            ? 'bg-heritage-gold/30 blur-[0.5px]'
                            : 'bg-salone-white/10 blur-[4px]'
                        }`}
                    style={{
                        width: p.size,
                        height: p.size,
                    }}
                />
            ))}

            {/* Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.4)_100%)]" />
        </div>
    );
}
