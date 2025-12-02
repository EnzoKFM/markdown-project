import { marked } from "marked";

function BlockItem({ block, onDelete, onEdit }) {
  const getPreview = (content) => {
    if (!content.trim()) return "<p class='text-gray-400'>Aucun contenu</p>";
    return marked.parse(content);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{block.name}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(block)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            Modifier
          </button>
          <button
            onClick={() => onDelete(block.id)}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm"
          >
            Supprimer
          </button>
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
