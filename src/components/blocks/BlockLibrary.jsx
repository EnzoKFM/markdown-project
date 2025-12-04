import { useState, useEffect, useRef } from "react";
import BlockForm from "./BlockForm";
import BlockList from "./BlockList";
import BlockEdit from "./BlockEdit";
import { importBlocks } from "./utils/importBlocks";
import { useDispatch, useSelector } from "react-redux";
import {
  addBlock,
  updateBlock,
  deleteBlock,
  setEditingBlock,
  cancelEditing,
  toggleSelectBlock,
  toggleSelectAll,
  importBlocks as importBlocksAction,
} from "../../store/slices/blocksSlice";

function BlockLibrary() {
  const dispatch = useDispatch();
  const { blocks, editingBlock, selectedBlocks } = useSelector(
    (state) => state.blocks
  );
  const fileInputRef = useRef(null);

  const handleAddBlock = (data) => {
    const newBlock = {
      id: crypto.randomUUID(),
      name: data.name,
      content: data.content,
      shortcut: data.shortcut || null,
      createdAt: new Date().toISOString(),
    };

    dispatch(addBlock(newBlock));
  };

  const handleDeleteBlock = (id) => {
    if (confirm("Supprimer ce bloc ?")) {
      dispatch(deleteBlock(id));
    }
  };

  const handleUpdateBlock = (updatedBlock) => {
    dispatch(updateBlock(updatedBlock));
    dispatch(cancelEditing());
  };

  const handleStartEditBlock = (block) => {
    dispatch(setEditingBlock(block));
  };

  const handleCancelEditBlock = () => {
    dispatch(cancelEditing());
  };

  const handleToggleSelectBlock = (id) => {
    dispatch(toggleSelectBlock(id));
  };

  const handleToggleSelectAll = () => {
    dispatch(toggleSelectAll());
  };

  const handleImportBlocks = (importedBlocks) => {
    dispatch(importBlocksAction(importedBlocks));
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
          onToggleSelect={handleToggleSelectBlock}
          onToggleSelectAll={handleToggleSelectAll}
        />
      </div>
    </div>
  );
}

export default BlockLibrary;
