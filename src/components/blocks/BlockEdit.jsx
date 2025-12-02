import { useState } from "react";
import { marked } from "marked";

function BlockEdit({ block, onSave, onCancel }) {
  const [name, setName] = useState(block.name);
  const [content, setContent] = useState(block.content);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    onSave({
      ...block,
      name,
      content,
      updatedAt: new Date().toISOString(),
    });
  };

  const getPreview = () => {
    if (!content.trim())
      return "<p class='text-gray-400'>La prévisualisation apparaîtra ici...</p>";
    return marked.parse(content);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
    >
      <h2 className="text-xl font-semibold mb-4">Modifier le bloc</h2>

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
