import { useState, useEffect, useRef } from "react";
import BlockForm from "./BlockForm";
import BlockList from "./BlockList";
import BlockEdit from "./BlockEdit";
import { importBlocks } from "./utils/importBlocks";

function BlockLibrary() {
  const [blocks, setBlocks] = useState([]);
  const [editingBlock, setEditingBlock] = useState(null);
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("blocks");
    if (saved) {
      setBlocks(JSON.parse(saved));
    }
  }, []);

  const handleAddBlock = (data) => {
    const newBlock = {
      id: crypto.randomUUID(),
      name: data.name,
      content: data.content,
      shortcut: data.shortcut || null,
      createdAt: new Date().toISOString(),
    };

    setBlocks([...blocks, newBlock]);
    localStorage.setItem("blocks", JSON.stringify([...blocks, newBlock]));
  };

  const handleDeleteBlock = (id) => {
    if (confirm("Supprimer ce bloc ?")) {
      const newBlocks = blocks.filter((block) => block.id !== id);
      localStorage.setItem("blocks", JSON.stringify(newBlocks));
      setBlocks(newBlocks);
      setSelectedBlocks(
        selectedBlocks.filter((selectedId) => selectedId !== id)
      );
    }
  };

  const handleUpdateBlock = (updatedBlock) => {
    const newBlocks = blocks.map((b) =>
      b.id === updatedBlock.id ? updatedBlock : b
    );
    setBlocks(newBlocks);
    setEditingBlock(null);
    localStorage.setItem("blocks", JSON.stringify(newBlocks));
  };

  const handleStartEditBlock = (block) => {
    setEditingBlock(block);
  };

  const handleCancelEditBlock = () => {
    setEditingBlock(null);
  };

  const toggleSelectBlock = (id) => {
    setSelectedBlocks((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedBlocks.length === blocks.length) {
      setSelectedBlocks([]);
    } else {
      setSelectedBlocks(blocks.map((b) => b.id));
    }
  };

  const handleImportBlocks = (importedBlocks) => {
    const newBlocks = [...blocks, ...importedBlocks];
    setBlocks(newBlocks);
    localStorage.setItem("blocks", JSON.stringify(newBlocks));
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      importBlocks(file, handleImportBlocks);
      e.target.value = "";
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Mes blocs personnalisés</h1>

        <button
          onClick={handleImportClick}
          className="px-6 py-2 rounded-md text-sm transition-colors bg-blue-600 text-white hover:bg-blue-700"
        >
          📥 Importer des blocs
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".part.mdlc,.parts.mdlc"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {editingBlock ? (
        <BlockEdit
          block={editingBlock}
          blocks={blocks}
          onSave={handleUpdateBlock}
          onCancel={handleCancelEditBlock}
        />
      ) : (
        <BlockForm onSubmit={handleAddBlock} blocks={blocks} />
      )}

      <div className="mt-8">
        <BlockList
          blocks={blocks}
          onDelete={handleDeleteBlock}
          onEdit={handleStartEditBlock}
          selectedBlocks={selectedBlocks}
          onToggleSelect={toggleSelectBlock}
          onToggleSelectAll={toggleSelectAll}
        />
      </div>
    </div>
  );
}

export default BlockLibrary;
