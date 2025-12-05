import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tree: { id: 'root', name: 'root', type: 'root', children: [] }
};

const treeSlice = createSlice({
  name: 'tree',
  initialState,
  reducers: {
    setTree: (state, action) => {
      state.tree = action.payload;
    },
    addNode: (state, action) => {
      const { parentId, nodeType } = action.payload;
      const newNode = {
        id: crypto.randomUUID(),
        name: nodeType === 'folder' ? 'New Folder' : 'New File',
        type: nodeType,
        text: '',
        children: []
      };

      const addNodeRecursive = (node) => {
        if (node.id === parentId) {
          node.children.push(newNode);
        } else if (node.children) {
          node.children.forEach(addNodeRecursive);
        }
      };

      addNodeRecursive(state.tree);
    },
    moveNode: (state, action) => {
      const { nodeId, newParentId } = action.payload;
      
      let movedNode = null;

      // Fonction pour trouver un nœud
      const findNode = (node, id) => {
        if (node.id === id) return node;
        for (const child of node.children || []) {
          const found = findNode(child, id);
          if (found) return found;
        }
        return null;
      };

      // Fonction pour vérifier si c'est un enfant
      const isChild = (node, targetId) => {
        if (!node.children) return false;
        for (const child of node.children) {
          if (child.id === targetId) return true;
          if (isChild(child, targetId)) return true;
        }
        return false;
      };

      // Validations
      if (nodeId === newParentId) return;
      
      const draggedNode = findNode(state.tree, nodeId);
      if (!draggedNode) return;
      
      if (isChild(draggedNode, newParentId)) return;
      
      const parentNode = findNode(state.tree, newParentId);
      if (parentNode.type === 'file') return;

      // Retirer le nœud
      const removeNodeRecursive = (node) => {
        if (!node.children) return;
        
        node.children = node.children.filter(child => {
          if (child.id === nodeId) {
            movedNode = child;
            return false;
          }
          return true;
        });
        
        node.children.forEach(removeNodeRecursive);
      };

      removeNodeRecursive(state.tree);

      // Ajouter le nœud au nouveau parent
      if (movedNode) {
        const addNodeRecursive = (node) => {
          if (node.id === newParentId) {
            node.children.push(movedNode);
            return true;
          }
          return node.children?.some(addNodeRecursive);
        };
        addNodeRecursive(state.tree);
      }
    },
    changeName: (state, action) => {
      const { nodeId, newName } = action.payload;
      
      const changeNodeRecursive = (node) => {
        if (node.id === nodeId) {
          node.name = newName;
        } else if (node.children) {
          node.children.forEach(changeNodeRecursive);
        }
      };
      
      changeNodeRecursive(state.tree);
    },
    deleteNode: (state, action) => {
      const nodeId = action.payload;
      
      const deleteNodeRecursive = (node) => {
        if (node.id === nodeId) return false;
        
        if (node.children) {
          node.children = node.children.filter(deleteNodeRecursive);
        }
        
        return true;
      };
      
      if (state.tree.children) {
        state.tree.children = state.tree.children.filter(deleteNodeRecursive);
      }
    },
    importNode: (state, action) => {
      const fileNode = action.payload.fileNode

      state.tree.children.push(fileNode)
    },
    saveNode: (state, action) => {
      const {nodeId, content} = action.payload

      const updateNode = (node, id) => {
        if (node.id === id) {
          node.text = content
        };
        for (const child of node.children || []) {
          const found = updateNode(child, id);
          if (found) return found;
        }
        return null;
      };

      updateNode(state.tree, nodeId)
    }
  }
});

export const { setTree, addNode, moveNode, changeName, deleteNode, importNode, saveNode } = treeSlice.actions;
export default treeSlice.reducer;