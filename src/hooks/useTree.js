import {useState, useEffect} from "react";

export function useTree(storageKey) {
  const [tree, setTree] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.error('Erreur dans la récupération de l\'arbre : ', e);
      return null;
    }
  });

  useEffect(() => {
    if (tree !== null) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(tree));
      } catch (e) {
        console.error('Erreur dans la sauvegarde de l\'arbre', e);
      }
    }
  }, [tree, storageKey]);

  return [tree, setTree];
}