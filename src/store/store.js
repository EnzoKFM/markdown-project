import { configureStore } from "@reduxjs/toolkit";
import blocksReducer from "./slices/blocksSlice";
import imagesReducer from "./imageSlice";
import treeReducer from './slices/treeSlice';



// Middleware pour synchroniser avec localStorage
const localStorageMiddleware = store => next => action => {
  const result = next(action);
  
  // Sauvegarder l'état dans localStorage après chaque action
  const state = store.getState();
  localStorage.setItem('fileTree', JSON.stringify(state.tree.tree));
  
  return result;
};

// Charger l'état initial depuis localStorage
const loadInitialState = () => {
  try {
    const savedTree = localStorage.getItem('fileTree');
    if (savedTree) {
      return {
        tree: {
          tree: JSON.parse(savedTree)
        }
      };
    }
  } catch (error) {
    console.error('Erreur lors du chargement depuis localStorage:', error);
  }
  return undefined;
};

export const store = configureStore({
  reducer: {
    blocks: blocksReducer,
    images: imagesReducer,
    tree: treeReducer
  },
  preloadedState: loadInitialState(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware)
});

export default store;
