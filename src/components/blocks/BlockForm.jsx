import { useState } from "react";
import { marked } from "marked";
import ShortCut from "./ShortCut";

function BlockForm({ onSubmit, blocks = [] }) {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [shortcut, setShortcut] = useState({
    key: "",
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    console.log(shortcut);

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

    onSubmit({ name, content, shortcut: shortcut.key ? shortcut : null });
    setName("");
    setContent("");
    setShortcut({
      key: "",
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
    });
  };

  const getPreview = () => {
    if (!content.trim())
      return "<p class='text-gray-400'>La prévisualisation apparaîtra ici...</p>";
    return marked.parse(content);
  };

  const findDuplicateShortCut = blocks.find((block) => {
    if (!block.shortcut || !block.shortcut.key) return false;

    return (
      shortcut.key === block.shortcut.key &&
      shortcut.ctrlKey === block.shortcut.ctrlKey &&
      shortcut.altKey === block.shortcut.altKey &&
      shortcut.shiftKey === block.shortcut.shiftKey
    );
  });

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-gray-200"
    >
      <h2 className="text-xl font-semibold mb-4">Nouveau bloc personnalisé</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
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
        currentBlockId={null}
      />

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contenu
        </label>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Contenu markdown et/ou HTML..."
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
          </div>

          <div
            className="w-full h-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 overflow-auto prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: getPreview() }}
          ></div>
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors mx-auto block"
      >
        Créer
      </button>
    </form>
  );
}

export default BlockForm;
