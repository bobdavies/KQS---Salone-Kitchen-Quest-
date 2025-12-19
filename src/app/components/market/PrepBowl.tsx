"use client";

import { motion } from "framer-motion";
import { forwardRef } from "react";
import { Hexagon, Zap } from "lucide-react";

interface PrepBowlProps {
    isHovered: boolean;
    count: number;
}

const PrepBowl = forwardRef<HTMLDivElement, PrepBowlProps>(({ isHovered, count }, ref) => {
    return (
        <div className="relative flex flex-col items-center gap-8">
            {/* Outer Energy Rings */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-8 pointer-events-none"
            >
                <Hexagon className="w-full h-full text-cyber-neon/10 stroke-[1px]" />
            </motion.div>

            <motion.div
                ref={ref}
                animate={{
                    scale: isHovered ? 1.05 : 1,
                    borderColor: isHovered ? "rgba(57, 255, 20, 1)" : "rgba(57, 255, 20, 0.2)",
                    boxShadow: isHovered
                        ? "0 0 50px rgba(57, 255, 20, 0.4), inset 0 0 30px rgba(57, 255, 20, 0.2)"
                        : "0 0 20px rgba(57, 255, 20, 0.1)",
                }}
                className="relative w-56 h-56 md:w-72 md:h-72 rounded-[40px] bg-cyber-void/60 border-2 border-cyber-neon/20 backdrop-blur-3xl flex items-center justify-center transition-all overflow-hidden"
            >
                {/* Interior Energy Grid */}
                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(57,255,20,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(57,255,20,0.1)_1px,transparent_1px)] [background-size:20px_20px]" />

                {/* Pulsing Core */}
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-12 rounded-full bg-cyber-neon/5 blur-3xl"
                />

                <div className="z-10 flex flex-col items-center gap-2">
                    {/* Holographic Icon */}
                    <div className="relative">
                        <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="text-6xl md:text-7xl mb-2 drop-shadow-[0_0_15px_rgba(57,255,20,0.5)]"
                        >
                            🥣
                        </motion.div>
                        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-cyber-void to-transparent" />
                    </div>

                    <div className="flex flex-col items-center">
                        <span className="text-[10px] font-black tracking-[0.5em] text-cyber-neon opacity-70 uppercase">
                            Containment Unit
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="w-1 h-1 bg-cyber-neon rounded-full animate-ping" />
                            <span className="text-[8px] font-mono text-cyber-neon/40">MATURING_DATA...</span>
                        </div>
                    </div>
                </div>

                {/* Corner Sensors */}
                <div className="absolute top-4 left-4 w-4 h-[1px] bg-cyber-neon/30" />
                <div className="absolute top-4 left-4 w-[1px] h-4 bg-cyber-neon/30" />
                <div className="absolute bottom-4 right-4 w-4 h-[1px] bg-cyber-neon/30" />
                <div className="absolute bottom-4 right-4 w-[1px] h-4 bg-cyber-neon/30" />
            </motion.div>

            {/* Futuristic Progress Bar */}
            <div className="w-full max-w-xs flex flex-col gap-2">
                <div className="flex justify-between items-end px-1">
                    <span className="text-[10px] font-mono text-cyber-neon font-bold tracking-tighter">
                        ANALYZING_INGREDIENTS
                    </span>
                    <span className="text-xl font-black text-salone-white font-mono">
                        {Math.round((count / 8) * 100)}%
                    </span>
                </div>
                <div className="h-3 w-full bg-white/5 rounded-full border border-white/10 p-[2px] overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(count / 8) * 100}%` }}
                        className="h-full bg-gradient-to-r from-cyber-neon to-cyber-blue rounded-full relative"
                    >
                        {/* Progress Highlight */}
                        <div className="absolute inset-0 bg-white/30 skew-x-12 animate-pulse" />
                    </motion.div>
                </div>
                <div className="flex justify-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${count >= 8 ? "bg-cyber-neon" : "bg-white/10"}`} />
                        <span className="text-[8px] text-white/30 font-bold">READY</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Zap className={`w-2 h-2 ${count > 0 ? "text-cyber-orange" : "text-white/10"}`} />
                        <span className="text-[8px] text-white/30 font-bold">ENERGY_STABLE</span>
                    </div>
                </div>
            </div>
        </div>
    );
});

PrepBowl.displayName = "PrepBowl";

export default PrepBowl;
