import { useCallback, useRef } from "react";

const AUDIO_SAFETY_TIMEOUT_MS = 5000;

export function useAudio() {
    const audioRef = useRef<HTMLAudioElement>(new Audio());

    const stop = useCallback(() => {
        const audio = audioRef.current;
        audio.pause();
        audio.currentTime = 0;
    }, []);

    const playSync = useCallback(
        (src: string): Promise<void> => {
            return new Promise((resolve) => {
                const audio = audioRef.current;
                
                audio.pause();
                audio.src = src;
                audio.load();
                audio.playbackRate = 0.9;

                const safetyTimer = window.setTimeout(() => {
                    console.warn("Audio timeout:", src);
                    resolve();
                }, AUDIO_SAFETY_TIMEOUT_MS);

                audio.onended = () => {
                    window.clearTimeout(safetyTimer);
                    resolve();
                };

                audio.onerror = (e) => {
                    console.error("Audio error:", e);
                    window.clearTimeout(safetyTimer);
                    resolve();
                };

                // 再生
                audio.play().catch((err) => {
                    console.error("Play blocked:", err);
                    window.clearTimeout(safetyTimer);
                    resolve();
                });
            });
        },
        [],
    );

    return { playSync, stop };
}