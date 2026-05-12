import React, { useState, useEffect, useRef } from "react";

interface BackgroundImagesProps {
    bgUrl: string;
    isCountdown: boolean;
}

export const BackgroundImages: React.FC<BackgroundImagesProps> = ({
    bgUrl,
    isCountdown,
}) => {
    const [layerA, setLayerA] = useState(bgUrl);
    const [layerB, setLayerB] = useState(bgUrl);
    const [showB, setShowB] = useState(false);

    const prevUrlRef = useRef(bgUrl);
    const prevCountdownRef = useRef(isCountdown);

    useEffect(() => {
        const urlChanged = bgUrl !== prevUrlRef.current;
        const countdownStarted = isCountdown && !prevCountdownRef.current;

        // カウントダウンがはじまりURLが変わったら、次の画像をプリロード
        if (countdownStarted && urlChanged) {
            const img = new Image();
            img.src = bgUrl;

            const startFade = () => {
                if (showB) {
                    // LayerAを表示
                    setLayerA(bgUrl);

                    setTimeout(() => {
                        requestAnimationFrame(() => {
                            setShowB(false);
                        });
                    }, 100);
                } else {
                    // LayerBを表示
                    setLayerB(bgUrl);
                    setTimeout(() => {
                        requestAnimationFrame(() => {
                            setShowB(true);
                        });
                    }, 100);
                }
                prevUrlRef.current = bgUrl;
            };

            if (img.complete) {
                // すでにキャッシュ済み
                startFade();
            } else {
                // 読み込み完了を待ってからフェード
                img.onload = startFade;
            }
        }

        prevCountdownRef.current = isCountdown;
    }, [bgUrl, isCountdown, showB]);

    useEffect(() => {
        if (bgUrl !== prevUrlRef.current && !isCountdown) {
            setLayerA(bgUrl);
            setLayerB(bgUrl);
            prevUrlRef.current = bgUrl;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bgUrl]);

    const FADE_DURATION = "1200ms";

    const baseStyle: React.CSSProperties = {
        position: "fixed",
        inset: 0,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: `opacity ${FADE_DURATION} ease-in-out`,
    };

    return (
        <>
            {/* ブラーレイヤー A */}
            <div
                id="bg-blur-a"
                style={{
                    ...baseStyle,
                    backgroundImage: `url("${layerA}")`,
                    opacity: showB ? 0 : 1,
                    filter: "blur(20px) brightness(0.5)",
                    transform: "scale(1.1)",
                }}
            />
            {/* ブラーレイヤー B */}
            <div
                id="bg-blur-b"
                style={{
                    ...baseStyle,
                    backgroundImage: `url("${layerB}")`,
                    opacity: showB ? 1 : 0,
                    filter: "blur(20px) brightness(0.5)",
                    transform: "scale(1.1)",
                }}
            />
            {/* クリアレイヤー A */}
            <div
                id="bg-clear-a"
                style={{
                    ...baseStyle,
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundImage: `url("${layerA}")`,
                    opacity: showB ? 0 : 1,
                }}
            />
            {/* クリアレイヤー B */}
            <div
                id="bg-clear-b"
                style={{
                    ...baseStyle,
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundImage: `url("${layerB}")`,
                    opacity: showB ? 1 : 0,
                }}
            />
        </>
    );
};
