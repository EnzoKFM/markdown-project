import { useState } from "react";
import { marked } from "marked";
import ShortCut from "./ShortCut";

function BlockEdit({ block, onSave, onCancel, blocks = [] }) {
  const [name, setName] = useState(block.name);
  const [content, setContent] = useState(block.content);
  const [shortcut, setShortcut] = useState(
    block.shortcut || {
      key: "",
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    // Validation du raccourci
    const hasModifier =
      shortcut.ctrlKey || shortcut.altKey || shortcut.shiftKey;
    const hasKey = shortcut.key !== "";

    if (hasModifier && !hasKey) {
      alert("Vous devez choisir une touche pour le raccourci");
      return;
    }

    if (hasKey && !hasModifier) {
      alert("Vous devez choisir un modificateur (Ctrl, Alt ou Shift)");
      return;
    }

    if (findDuplicateShortCut) {
      alert(
        "Ce raccourci est déjà utilisé par le bloc " +
          findDuplicateShortCut.name
      );
      return;
    }

    onSave({
      ...block,
      name,
      content,
      shortcut: shortcut.key ? shortcut : null,
      updatedAt: new Date().toISOString(),
    });
  };

  const findDuplicateShortCut = blocks.find((b) => {
    if (b.id === block.id) return false;

    if (!b.shortcut || !b.shortcut.key) return false;

    return (
      shortcut.key === b.shortcut.key &&
      shortcut.ctrlKey === b.shortcut.ctrlKey &&
      shortcut.altKey === b.shortcut.altKey &&
      shortcut.shiftKey === b.shortcut.shiftKey
    );
  });

  const getPreview = () => {
    if (!content.trim())
      return "<p class='text-gray-400'>La prévisualisation apparaîtra ici...</p>";
    return marked.parse(content);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 rounded-lg shadow-sm border border-gray-200"
    >
      <h2 className="text-xl font-semibold mb-4">Modifier le bloc</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Nom
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom du bloc"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <ShortCut
        shortcut={shortcut}
        onChange={setShortcut}
        blocks={blocks}
        currentBlockId={block.id}
      />

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Contenu
        </label>

        <div className="grid grid-cols-2 gap-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Contenu markdown et/ou HTML..."
            rows={12}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-slate-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />

          <div
            className="w-full h-full px-3 py-2 border border-gray-200 rounded-md bg-slate-900 overflow-auto prose prose-slate prose-invert prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: getPreview() }}
          ></div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Enregistrer
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}

export default BlockEdit;
