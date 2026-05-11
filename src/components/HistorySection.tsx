import React, { useState } from "react";
import type { Poem } from "../types/types";

const HISTORY_DISPLAY = 5;
const HYAKUNI_NISSHU_LENGTH = 101;

interface HistorySectionProps {
    history: Poem[];
    onSelect: (p: Poem) => void;
    onClear: () => void;
}

export const HistorySection: React.FC<HistorySectionProps> = ({
    history,
    onSelect,
    onClear,
}) => {
    const [confirming, setConfirming] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleClearClick = () => {
        setConfirming(true);
    };

    const handleConfirm = () => {
        onClear();
        setConfirming(false);
    };

    const handleCancel = () => {
        setConfirming(false);
    };

    return (
        <section id="history">
            <button
                type="button"
                className="history-toggle"
                onClick={() => setIsOpen((v) => !v)}
            >
                <span className="history-toggle-count">
                    {history.length} / {HYAKUNI_NISSHU_LENGTH}
                </span>
                <span className="history-toggle-label">最近読んだ五首</span>
                <span className="history-toggle-arrow">
                    {isOpen ? "▲" : "▼"}
                </span>
            </button>

            {isOpen && (
                <>
                    {history.length > 0 &&
                        (confirming ? (
                            <div className="clear-confirm">
                                <span className="clear-confirm-msg">
                                    本当に削除しますか？
                                </span>
                                <button
                                    type="button"
                                    className="clear-confirm-yes"
                                    onClick={handleConfirm}
                                >
                                    削除する
                                </button>
                                <button
                                    type="button"
                                    className="clear-confirm-no"
                                    onClick={handleCancel}
                                >
                                    キャンセル
                                </button>
                            </div>
                        ) : (
                            <span onClick={handleClearClick} className="reset-char">
                                履歴を消去する
                            </span>
                        ))}

                    <ul id="historyList">
                        {history.length > 0 ? (
                            [...history]
                                .slice(-HISTORY_DISPLAY)
                                .reverse()
                                .map((p) => (
                                    <li
                                        key={p.id}
                                        className="history-item"
                                        onClick={() => onSelect(p)}
                                    >
                                        #{p.id} / {p.author} /<br />
                                        {p.text}
                                    </li>
                                ))
                        ) : (
                            <p className="empty-history">まだ履歴がありません</p>
                        )}
                    </ul>
                </>
            )}
        </section>
    );
};