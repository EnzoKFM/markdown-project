import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addImage, deleteImage, renameImage, setImages } from "../store/imageSlice";


function ImageLibrary() {
  const images = useSelector((state) => state.images.list);
  const dispatch = useDispatch();

  const [markdown, setMarkdown] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState("");

  // Charger au démarrage
  useEffect(() => {
    const saved = localStorage.getItem("images");
    if (saved) {
      dispatch(setImages(JSON.parse(saved)));
    }
  }, []);

  // Sauvegarder dès que ça change
  useEffect(() => {
    localStorage.setItem("images", JSON.stringify(images));
  }, [images]);

  // Fonction pour convertir un fichier en base64
  const fileToBase64 = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  };

  // Fonction pour compresser l'image en réduisant sa largeur max
  const compressBase64 = (base64) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const MAX_WIDTH = 600;
        const scale = MAX_WIDTH / img.width;

        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scale;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressed = canvas.toDataURL("image/jpeg", 0.7);

        resolve(compressed);
      };
    });
  };

  // Fonction pour gérer l'import d'une nouvelle image
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const base64 = await fileToBase64(file);

    const compressedBase64 = await compressBase64(base64);

    const newImage = {
      id: crypto.randomUUID(),
      name: file.name,
      data: compressedBase64,
    };

    dispatch(addImage(newImage));
  };

  // Fonction pour renommer une image
  const handleRename  = (id) => {
    dispatch(renameImage({ id, newName }));
      setEditingId(null);
      setNewName("");
    };

  // Fonction pour supprimer une image
  const handleDelete  = (id) => {
    dispatch(deleteImage(id));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const imageId = e.dataTransfer.getData("text/plain");
    const img = images.find((i) => i.id === imageId);
    if (img) {
      setMarkdown((prev) => prev + `![${img.name}](img:${img.id})\n`);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

   // Exporter une image en fichier .img.mdlc
  const exportSingleImage = (img) => {
    try {
      const payload = JSON.stringify({ id: img.id, name: img.name, data: img.data });
      const blob = new Blob([payload], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const safeName = img.name.replace(/\.[^/.]+$/, ""); // retire extension existante si besoin
      a.download = `${safeName}.img.mdlc`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erreur export single", err);
      alert("Erreur pendant l'export.");
    }
  };

  // Exporter toute la bibliothèque en un seul fichier .imgs.mdlc
  const exportAllImages = () => {
    try {
      const payload = JSON.stringify(images);
      const blob = new Blob([payload], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `images_library.imgs.mdlc`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erreur export all", err);
      alert("Erreur pendant l'export de la bibliothèque.");
    }
  };

  // Importer depuis fichier .img.mdlc (single) ou .imgs.mdlc (collection)
  const importFromSpecificFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      let parsed = JSON.parse(text);

      // Normaliser : si single image (objet), le mettre dans un tableau
      if (!Array.isArray(parsed)) {
        parsed = [parsed];
      }

      // Assurer que chaque élément a id/name/data
      const normalized = parsed
        .filter((it) => it && it.data) // filtre les éléments invalides
        .map((it) => ({
          id: crypto.randomUUID(),
          name: it.name || "imported-image",
          data: it.data,
        }));

      if (normalized.length === 0) {
        alert("Aucune image valide trouvée dans le fichier.");
      } else {
        normalized.forEach(img => dispatch(addImage(img)));
        alert(`${normalized.length} image(s) importée(s).`);
      }
    } catch (err) {
      console.error("Erreur import", err);
      alert("Impossible de lire le fichier. Vérifiez le format.");
    } finally {
      e.target.value = "";
    }
  };

  // style bouton édition/suppression/export
  const btnStyle = {
    marginLeft: "6px",
    cursor: "pointer",
    border: "none",
    background: "transparent",
    fontSize: "16px",
  };

  // Render
  return (
    <div style={{ padding: "20px", border: "2px solid #ddd" }}>
      <h2>Bibliothèque d'images</h2>

      {/* Export all */}
      {images.length > 0 && (
        <>
          <button onClick={exportAllImages} style={{ marginBottom: "10px", padding: "8px 12px", borderRadius: "6px" }}>
            Exporter toute la bibliothèque (.imgs.mdlc)
          </button><br />
        </>
      )}

      {/* Import depuis fichier spécifique (.img.mdl ou .imgs.mdlc) */}
      <label htmlFor="importSpecific" style={{ padding: "8px 12px", background: "#eee", marginBottom: "10px", borderRadius: "6px", cursor: "pointer", display: "inline-block" }}>
        Importer (.img.mdl / .imgs.mdlc)
      </label>
      <input id="importSpecific" type="file" accept=".img.mdl,.imgs.mdlc,application/json" onChange={importFromSpecificFile} style={{ display: "none" }} /> <br />

      {/* Import classique depuis bouton parcourir */}
      <input type="file" accept="image/*" onChange={handleImport} />

      <div style={{ display: "flex", gap: "10px", marginTop: "20px", flexWrap: "wrap" }}>
        {images.map((img) => (
          <div key={img.id} style={{ textAlign: "center" }}  draggable onDragStart={(e) => { e.dataTransfer.setData("text/plain", img.id); e.dataTransfer.effectAllowed = "move"; }}>
              <img src={img.data} alt={img.name} width="150" style={{ border: "1px solid #ccc", padding: "5px" }} />

              {editingId === img.id ? (
              <div style={{ marginTop: "5px" }}>
                  <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} autoFocus style={{ width: "140px" }}/>
                  <button onClick={() => handleRename(img.id)} style={{ marginLeft: "5px", cursor: "pointer" }} > ✔ </button>
              </div>
              ) : (
              <div style={{ marginTop: "5px" }}>
                  <span>{img.name}</span>
                  <button onClick={() => { setEditingId(img.id); setNewName(img.name); }} style={btnStyle} > ✏️ </button>
                  <button onClick={() => handleDelete(img.id)} style={btnStyle} > 🗑️ </button>
                  <button onClick={() => exportSingleImage(img)} title="Exporter cette image (.img.mdl)" style={btnStyle}>📤</button>
              </div>
              )}
          </div>
        ))}
      </div>
      <h2>Markdown</h2>
      <textarea value={markdown} onChange={(e) => setMarkdown(e.target.value)} onDrop={handleDrop} onDragOver={handleDragOver} rows={10} style={{ width: "100%", padding: "10px", fontFamily: "monospace", marginTop: "10px" }} />
    </div>
  );
}

export default ImageLibrary;
