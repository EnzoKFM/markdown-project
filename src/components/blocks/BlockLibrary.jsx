import { useState, useEffect } from "react";
import BlockForm from "./BlockForm";
import BlockList from "./BlockList";
import BlockEdit from "./BlockEdit";

function BlockLibrary() {
  const [blocks, setBlocks] = useState([]);
  const [editingBlock, setEditingBlock] = useState(null);
  const [selectedBlocks, setSelectedBlocks] = useState([]);

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

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Mes blocs personnalisés</h1>

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
