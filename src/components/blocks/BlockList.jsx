import BlockItem from "./BlockItem";

function BlockList({ blocks, onDelete, onEdit }) {
  if (blocks.length === 0) {
    return (
      <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
        <p className="text-gray-500">Aucunn bloc pour le moment</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Nombre total de blocs : ({blocks.length})
      </h2>
      <div className="space-y-4">
        {blocks.map((block) => (
          <BlockItem
            key={block.id}
            block={block}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  );
}

export default BlockList;
