"use client";

import { useCallback } from "react";

export function useHaptic() {
    const triggerVibrate = useCallback((pattern: number | number[]) => {
        if (typeof window !== "undefined" && navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    }, []);

    const vibrateLight = useCallback(() => triggerVibrate(15), [triggerVibrate]);
    const vibrateMedium = useCallback(() => triggerVibrate(50), [triggerVibrate]);
    const stopVibrate = useCallback(() => triggerVibrate(0), [triggerVibrate]);

    const triggerBlender = useCallback(() => {
        triggerVibrate([50, 20]); // Short pulse for mechanical feeling
    }, [triggerVibrate]);

    const triggerSuccess = useCallback(() => {
        triggerVibrate([100, 50, 100]); // Multi-pulse success
    }, [triggerVibrate]);

    const triggerTick = useCallback(() => {
        triggerVibrate(15); // Micro-tick
    }, [triggerVibrate]);

    return {
        vibrateLight,
        vibrateMedium,
        stopVibrate,
        triggerBlender,
        triggerSuccess,
        triggerTick,
        vibrate: triggerVibrate,
    };
}
