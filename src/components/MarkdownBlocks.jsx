export default function MarkdownBlocks({ blocks }) {
    const getShortcutString = (shortcut) => {
        if (!shortcut || !shortcut.key) return null;

        const parts = [];

        if (shortcut.ctrlKey) parts.push("Ctrl");
        if (shortcut.altKey) parts.push("Alt");
        if (shortcut.shiftKey) parts.push("Shift");

        parts.push(shortcut.key.toUpperCase());

        return parts.join(" + ");
    };

    return (
        <div className="flex flex-col h-[600px]">
            <h2 className="text-xl font-semibold mb-3 text-slate-200">
                Blocs disponibles ({blocks.length})
            </h2>

            <div className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-4 overflow-y-auto shadow-lg">
                {blocks.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-slate-500 text-center">
                            Aucun bloc personnalisé.
                            <br />
                            <span className="text-sm">
                                Créez-en dans la bibliothèque !
                            </span>
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {blocks.map((block) => (
                            <div
                                key={block.id}
                                className="bg-slate-800 border border-slate-700 rounded-lg p-3 hover:border-slate-600 transition-colors"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-semibold text-slate-100 text-sm">
                                        {block.name}
                                    </h3>
                                    {block.shortcut &&
                                        getShortcutString(block.shortcut) && (
                                            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded font-mono whitespace-nowrap ml-2">
                                                ⌨️ {getShortcutString(block.shortcut)}
                                            </span>
                                        )}
                                </div>

                                <p className="text-xs text-slate-400 font-mono line-clamp-2 break-all">
                                    {block.content.length > 60
                                        ? block.content.substring(0, 60) + "..."
                                        : block.content}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
