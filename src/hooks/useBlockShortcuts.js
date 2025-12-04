import { useEffect } from "react";

export function useBlockShortcuts(blocks, onInsert) {
    useEffect(() => {
        function handleKeyDown(e) {
            const pressedKey = e.key.toUpperCase();

            const matched = blocks.find((block) => {
                if (!block.shortcut) return false;
                const shortcut = block.shortcut;

                return (
                    shortcut.key.toUpperCase() === pressedKey &&
                    shortcut.ctrlKey === !!e.ctrlKey &&
                    shortcut.altKey === !!e.altKey &&
                    shortcut.shiftKey === !!e.shiftKey
                );
            });

            if (!matched) return;

            e.preventDefault();
            onInsert(matched.content);
        }

        document.addEventListener("keydown", handleKeyDown);

        return (() =>
            document.removeEventListener("keydown", handleKeyDown)
        );
    }, [blocks, onInsert]);
}
