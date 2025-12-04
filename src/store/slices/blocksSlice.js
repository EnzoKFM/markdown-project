import { createSlice } from "@reduxjs/toolkit";

const loadBlocksFromStorage = () => {
  const saved = localStorage.getItem("blocks");
  return saved ? JSON.parse(saved) : [];
};

const saveBlocksToStorage = (blocks) => {
  localStorage.setItem("blocks", JSON.stringify(blocks));
};

const blocksSlice = createSlice({
  name: "blocks",
  initialState: {
    blocks: loadBlocksFromStorage(),
    selectedBlocks: [],
    editingBlock: null,
  },
  reducers: {
    // Ajouter un nouveau bloc
    addBlock: (state, action) => {
      state.blocks.push(action.payload);
      saveBlocksToStorage(state.blocks);
    },

    // Mettre à jour un bloc existant
    updateBlock: (state, action) => {
      console.log("Action : ", action);
      const index = state.blocks.findIndex((b) => b.id === action.payload.id);

      console.log("index : ", index);

      if (index !== -1) {
        state.blocks[index] = action.payload;
        saveBlocksToStorage(state.blocks);
      }
    },

    // Supprimer un bloc
    deleteBlock: (state, action) => {
      state.blocks = state.blocks.filter((b) => b.id !== action.payload);
      state.selectedBlocks = state.selectedBlocks.filter(
        (id) => id !== action.payload
      );
      saveBlocksToStorage(state.blocks);
    },

    // Définir le bloc en cours d'édition
    setEditingBlock: (state, action) => {
      state.editingBlock = action.payload;
    },

    // Annuler l'édition
    cancelEditing: (state) => {
      state.editingBlock = null;
    },

    // Sélectionner un bloc
    toggleSelectBlock: (state, action) => {
      const id = action.payload;
      if (state.selectedBlocks.includes(id)) {
        state.selectedBlocks = state.selectedBlocks.filter(
          (selectedId) => selectedId !== id
        );
      } else {
        state.selectedBlocks.push(id);
      }
    },

    // Sélectionner tous les blocs
    toggleSelectAll: (state) => {
      if (state.selectedBlocks.length === state.blocks.length) {
        state.selectedBlocks = [];
      } else {
        state.selectedBlocks = state.blocks.map((b) => b.id);
      }
    },

    // Effacer la sélection
    clearSelection: (state) => {
      state.selectedBlocks = [];
    },

    // Importer des blocs
    importBlocks: (state, action) => {
      state.blocks = [...state.blocks, ...action.payload];
      saveBlocksToStorage(state.blocks);
    },
  },
});

export const {
  addBlock,
  updateBlock,
  deleteBlock,
  setEditingBlock,
  cancelEditing,
  toggleSelectBlock,
  toggleSelectAll,
  clearSelection,
  importBlocks,
} = blocksSlice.actions;

export default blocksSlice.reducer;
