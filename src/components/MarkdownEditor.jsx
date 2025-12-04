import { useState, useEffect, useRef } from "react";
import MarkdownPreview from "./MarkdownPreview";
import { useBlockShortcuts } from "../hooks/useBlockShortcuts";
import { useSelector } from "react-redux";

export default function MarkdownEditor() {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);
  const { blocks } = useSelector((state) => state.blocks);

  function insert(content) {
    const textarea = textareaRef.current;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    setText((prev) => prev.slice(0, start) + content + prev.slice(end));
  }

  useBlockShortcuts(blocks, insert);

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
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Éditeur Markdown</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Éditeur Markdown */}
          <div className="flex flex-col h-[600px]">
            <h2 className="text-xl font-semibold mb-3 text-slate-200">
              Markdown
            </h2>
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="# Titre&#10;&#10;Écrivez votre markdown ici..."
              className="flex-1 w-full bg-slate-900 border border-slate-700 rounded-lg p-4 text-slate-200 font-mono text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none shadow-lg"
            />
          </div>

          {/* Prévisualisation */}
          <div className="flex flex-col h-[600px]">
            <MarkdownPreview content={text} />
          </div>

          {/* Blocs personnalisés */}
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
                      {/* En-tête du bloc */}
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

                      {/* Aperçu du contenu */}
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
        </div>
      </div>
    </div>
  );
}
