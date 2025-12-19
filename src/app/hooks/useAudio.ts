"use client";

import useSound from "use-sound";

export const useAudio = () => {
    // UI Sounds - Using publicly available royalty-free sounds for immediate "wow" factor
    const [playHover] = useSound("https://www.soundjay.com/buttons/button-20.mp3", { volume: 0.2, playbackRate: 1.5 });
    const [playDrop] = useSound("https://www.soundjay.com/buttons/button-3.mp3", { volume: 0.4 });
    const [playSweep] = useSound("https://www.soundjay.com/buttons/button-50.mp3", { volume: 0.2 });
    const [playSuccess] = useSound("https://www.soundjay.com/misc/success-bell-04.mp3", { volume: 0.3 });
    const [playGlitch] = useSound("https://www.soundjay.com/buttons/button-24.mp3", { volume: 0.1 });
    const [playBlender, { stop: stopBlender }] = useSound("https://www.soundjay.com/mechanical/engine-hum-1.mp3", { volume: 0.3, interrupt: true });

    // New sounds for cooking and prep
    const [playSimmer, { stop: stopSimmer }] = useSound("/sounds/boiling-water-sound-62556.mp3", { volume: 0.5, loop: true, interrupt: true });
    const [playSplash] = useSound("https://www.soundjay.com/nature/water-splash-1.mp3", { volume: 0.4 });

    return {
        playHover,
        playDrop,
        playSweep,
        playSuccess,
        playGlitch,
        playBlender,
        stopBlender,
        playSimmer,
        stopSimmer,
        playSplash
    };
};
