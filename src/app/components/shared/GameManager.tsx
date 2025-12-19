"use client";

import { useGame, GameStage } from "@/lib/context";
import { AnimatePresence, motion } from "framer-motion";
import Hero from "../intro/Hero";
import dynamic from "next/dynamic";

const LandingPortal = dynamic(() => import("../intro/LandingPortal"));
const MiseEnPlace = dynamic(() => import("../market/MiseEnPlace"));
const VirtualBlender = dynamic(() => import("../prep/VirtualBlender"));
const CookingStage = dynamic(() => import("../cook/CookingStage"));
const IngredientDrop = dynamic(() => import("../cook/IngredientDrop"));
const RiceCooking = dynamic(() => import("../cook/RiceCooking"));
const GrandReveal = dynamic(() => import("../serve/GrandReveal"));

const slideVariants = {
    initial: { x: "100%", opacity: 0, filter: "blur(20px)" },
    animate: { x: 0, opacity: 1, filter: "blur(0px)" },
    exit: { x: "-100%", opacity: 0, filter: "blur(20px)" },
};

const transition: any = {
    type: "spring",
    stiffness: 100,
    damping: 20,
};

export default function GameManager() {
    const { currentStage } = useGame();

    const renderStage = () => {
        switch (currentStage) {
            case "LANDING":
                return <LandingPortal />;
            case "INTRO":
                return <Hero />;
            case "MARKET":
                return <MiseEnPlace />;
            case "BLENDER":
                return <VirtualBlender />;
            case "SIMMER":
                return <CookingStage />;
            case "BEEF_DROP":
                return <IngredientDrop />;
            case "RICE_COOK":
                return <RiceCooking />;
            case "REVEAL":
                return <GrandReveal />;
            default:
                return <LandingPortal />;
        }
    };

    return (
        <main className="relative h-full w-full bg-hearth-void overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStage}
                    variants={slideVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={transition}
                    className="h-full w-full"
                >
                    {renderStage()}
                </motion.div>
            </AnimatePresence>
        </main>
    );
}
