import BlockItem from "./BlockItem";
import { exportMultipleBlocks } from "./utils/exportBlocks";

function BlockList({
  blocks,
  onDelete,
  onEdit,
  selectedBlocks,
  onToggleSelect,
  onToggleSelectAll,
}) {
  const handleExportSelected = () => {
    const blocksToExport = blocks.filter((b) => selectedBlocks.includes(b.id));
    exportMultipleBlocks(blocksToExport);
  };

  if (blocks.length === 0) {
    return (
      <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
        <p className="text-gray-500">Aucunn bloc pour le moment</p>
      </div>
    );
  }

  const allSelected =
    blocks.length > 0 && selectedBlocks.length === blocks.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Liste ({blocks.length})</h2>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={onToggleSelectAll}
              className="w-4 h-4"
            />
            <span className="text-sm">Tout sélectionner</span>
          </label>

          <button
            onClick={handleExportSelected}
            disabled={selectedBlocks.length === 0}
            className={`px-4 py-2 rounded-md text-sm transition-colors cursor-pointer ${
              selectedBlocks.length === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            📤 Exporter la sélection ({selectedBlocks.length})
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {blocks.map((block) => (
          <BlockItem
            key={block.id}
            block={block}
            onDelete={onDelete}
            onEdit={onEdit}
            isSelected={selectedBlocks.includes(block.id)}
            onToggleSelect={onToggleSelect}
          />
        ))}
      </div>
    </div>
  );
}

export default BlockList;
