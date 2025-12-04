export const importBlocks = (file, onSuccess) => {
  // On vérifie que le fichier est un fichier .part.mdlc ou .parts.mdlc
  const accepteExtensions = [".part.mdlc", ".parts.mdlc"];
  const filename = file.name;
  const isValidExtension = accepteExtensions.some((ext) =>
    filename.endsWith(ext)
  );
  if (!isValidExtension) {
    alert("Vous devez sélectionner un fichier .part.mdlc ou .parts.mdlc");
    return;
  }

  const reader = new FileReader();

  reader.onload = (e) => {
    const content = e.target.result;
    const filename = file.name;

    let importedBlocks = [];

    // Bloc seul
    if (filename.endsWith(".part.mdlc")) {
      const blockName = filename.replace(".part.mdlc", "");

      let confirmedName = prompt("Nom du bloc :", blockName);

      if (confirmedName === null) {
        return;
      }

      // Boucle tant que le nom est vide
      while (confirmedName.trim() === "") {
        confirmedName = prompt(
          "Le nom ne peut pas être vide. Nom du bloc :",
          blockName
        );

        if (confirmedName === null) {
          return;
        }
      }

      if (confirmedName && confirmedName.trim()) {
        importedBlocks.push({
          id: crypto.randomUUID(),
          name: confirmedName.trim(),
          content: content,
          shortcut: null,
          createdAt: new Date().toISOString(),
        });
      }
    } else if (filename.endsWith(".parts.mdlc")) {
      // Plusieurs blocs
      const sections = content.split("\n\n---\n\n");

      for (const section of sections) {
        const lines = section.trim().split("\n");

        if (lines.length === 0) continue;

        // Extraire le titre (première ligne avec #)
        let blockName = "Bloc importé";
        let blockContent = section;

        if (lines[0].startsWith("#")) {
          blockName = lines[0].replace(/^#+\s*/, "").trim();
          blockContent = lines.slice(1).join("\n").trim();

          // Enlever les sauts de ligne au début
          blockContent = blockContent.replace(/^\n+/, "");
        }

        let confirmedName = prompt("Nom du bloc :", blockName);

        // Si annulé, on skip ce bloc et continue avec les autres
        if (confirmedName === null) {
          continue;
        }

        // Boucle tant que le nom est vide
        while (confirmedName.trim() === "") {
          confirmedName = prompt(
            "Le nom ne peut pas être vide. Nom du bloc :",
            blockName
          );

          // Si annulé pendant la boucle, on skipp ce bloc
          if (confirmedName === null) {
            break;
          }
        }

        if (confirmedName && confirmedName.trim()) {
          importedBlocks.push({
            id: crypto.randomUUID(),
            name: confirmedName.trim(),
            content: blockContent,
            shortcut: null,
            createdAt: new Date().toISOString(),
          });
        }
      }
    }

    if (importedBlocks.length > 0) {
      onSuccess(importedBlocks);
      alert(`${importedBlocks.length} bloc(s) importé(s) avec succès !`);
    }
  };

  reader.readAsText(file);
};
