import { useState } from "react";
import { marked } from "marked";

function BlockForm({ onSubmit }) {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    onSubmit({ name, content });
    setName("");
    setContent("");
  };

  const getPreview = () => {
    if (!content.trim())
      return "<p class='text-gray-400'>La prévisualisation apparaîtra ici...</p>";
    return marked.parse(content);
  };

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

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contenu
        </label>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Contenu markdown ou HTML..."
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
