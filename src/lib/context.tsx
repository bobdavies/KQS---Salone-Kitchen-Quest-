"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";

export type GameStage =
    | "LANDING"
    | "INTRO"
    | "MARKET"
    | "BLENDER"
    | "SIMMER"
    | "BEEF_DROP"
    | "RICE_COOK"
    | "REVEAL";

export type Theme = "dark" | "light";

interface GameContextType {
    currentStage: GameStage;
    setStage: (stage: GameStage) => void;
    nextStage: () => void;
    prevStage: () => void;
    ingredientsCollected: string[];
    addIngredient: (id: string) => void;
    servingSize: number;
    setServingSize: (size: number) => void;
    resetGame: () => void;
    theme: Theme;
    toggleTheme: () => void;
    loreDiscovered: string[];
    discoverLore: (id: string) => void;
}

const STAGES: GameStage[] = ["LANDING", "INTRO", "MARKET", "BLENDER", "SIMMER", "BEEF_DROP", "RICE_COOK", "REVEAL"];

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
    const [currentStage, setCurrentStage] = useState<GameStage>("LANDING");
    const [ingredientsCollected, setIngredientsCollected] = useState<string[]>([]);
    const [servingSize, setServingSize] = useState(8);
    const [theme, setTheme] = useState<Theme>("dark");
    const [loreDiscovered, setLoreDiscovered] = useState<string[]>([]);

    // Phase 13: LocalStorage Persistence
    useEffect(() => {
        const saved = localStorage.getItem("salone_kitchen_state");
        if (saved) {
            try {
                const { stage, ingredients, size, theme: savedTheme, lore } = JSON.parse(saved);
                if (ingredients) setIngredientsCollected(ingredients);
                if (size) setServingSize(size);
                if (savedTheme) setTheme(savedTheme);
                if (lore) setLoreDiscovered(lore);
            } catch (e) {
                console.error("Failed to load saved state", e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("salone_kitchen_state", JSON.stringify({
            stage: currentStage,
            ingredients: ingredientsCollected,
            size: servingSize,
            theme,
            lore: loreDiscovered
        }));
        document.documentElement.setAttribute("data-theme", theme);
    }, [currentStage, ingredientsCollected, servingSize, theme, loreDiscovered]);

    // Phase 13: Screen Wake Lock API
    useEffect(() => {
        let wakeLock: any = null;
        const requestWakeLock = async () => {
            try {
                if ('wakeLock' in navigator) {
                    wakeLock = await (navigator as any).wakeLock.request('screen');
                    console.log('Wake Lock established');
                }
            } catch (err) {
                console.error(`${(err as Error).name}, ${(err as Error).message}`);
            }
        };

        if (currentStage !== "INTRO" && currentStage !== "REVEAL") {
            requestWakeLock();
        }

        return () => {
            if (wakeLock !== null) {
                wakeLock.release();
                wakeLock = null;
            }
        };
    }, [currentStage]);

    const setStage = useCallback((stage: GameStage) => setCurrentStage(stage), []);

    const nextStage = useCallback(() => {
        const currentIndex = STAGES.indexOf(currentStage);
        if (currentIndex < STAGES.length - 1) {
            setCurrentStage(STAGES[currentIndex + 1]);
        }
    }, [currentStage]);

    const prevStage = useCallback(() => {
        const currentIndex = STAGES.indexOf(currentStage);
        if (currentIndex > 0) {
            setCurrentStage(STAGES[currentIndex - 1]);
        }
    }, [currentStage]);

    const addIngredient = useCallback((id: string) => {
        setIngredientsCollected((prev) => [...new Set([...prev, id])]);
    }, []);

    const resetGame = useCallback(() => {
        setCurrentStage("INTRO");
        setIngredientsCollected([]);
        setServingSize(8);
        localStorage.removeItem("salone_kitchen_state");
    }, []);

    const toggleTheme = useCallback(() => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    }, []);

    const discoverLore = useCallback((id: string) => {
        setLoreDiscovered((prev) => [...new Set([...prev, id])]);
    }, []);

    return (
        <GameContext.Provider
            value={{
                currentStage,
                setStage,
                nextStage,
                prevStage,
                ingredientsCollected,
                addIngredient,
                servingSize,
                setServingSize,
                resetGame,
                theme,
                toggleTheme,
                loreDiscovered,
                discoverLore,
            }}
        >
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error("useGame must be used within a GameProvider");
    }
    return context;
}
