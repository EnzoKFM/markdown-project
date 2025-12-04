import { marked } from "marked";
import { exportSingleBlock } from "./utils/exportBlocks";

function BlockItem({ block, onDelete, onEdit, isSelected, onToggleSelect }) {
  const getPreview = (content) => {
    if (!content.trim()) return "<p class='text-gray-400'>Aucun contenu</p>";
    return marked.parse(content);
  };

  const getShortCutPreview = (sc) => {
    if (!sc || !sc.key) return null;
    const parts = [];
    if (sc.ctrlKey) parts.push("Ctrl");
    if (sc.altKey) parts.push("Alt");
    if (sc.shiftKey) parts.push("Shift");
    parts.push(sc.key.toUpperCase());
    return parts.join(" + ");
  };

  const handleExport = () => {
    exportSingleBlock(block);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-start gap-4 mb-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(block.id)}
          className="w-5 h-5 mt-5 cursor-pointer"
        />

        <div className="flex-1">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">{block.name}</h3>
              {getShortCutPreview(block.shortcut) && (
                <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono">
                  ⌨️ {getShortCutPreview(block.shortcut)}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(block)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm cursor-pointer"
              >
                Modifier
              </button>
              <button
                onClick={handleExport}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm cursor-pointer"
                title="Exporter ce bloc"
              >
                📤
              </button>
              <button
                onClick={() => onDelete(block.id)}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm cursor-pointer"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="w-full h-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 overflow-auto prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: getPreview(block.content) }}
      ></div>

      <div className="flex gap-4 text-sm text-gray-500">
        <small>
          Créé le :{" "}
          {new Date(block.createdAt).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          })}
        </small>
        {block.updatedAt && (
          <small>
            Modifié le :{" "}
            {new Date(block.updatedAt).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
            })}
          </small>
        )}
      </div>
    </div>
  );
}

export default BlockItem;
