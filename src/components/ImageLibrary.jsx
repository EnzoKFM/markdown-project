import { useState, useEffect } from "react";

function ImageLibrary() {
  const [images, setImages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState("");

  // Charger au démarrage
  useEffect(() => {
    const saved = localStorage.getItem("images");
    if (saved) {
      setImages(JSON.parse(saved));
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
      id: Date.now(),
      name: file.name,
      data: compressedBase64,
    };

    setImages([...images, newImage]);
  };

  // Fonction pour renommer une image
  const renameImage = (id) => {
    setImages(
      images.map((img) =>
        img.id === id ? { ...img, name: newName } : img
      )
    );
    setEditingId(null);
    setNewName("");
  };

  return (
    <div style={{ padding: "20px", border: "2px solid #ddd" }}>
      <h2>Bibliothèque d'images</h2>

      <input type="file" accept="image/*" onChange={handleImport} />

      <div style={{ display: "flex", gap: "10px", marginTop: "20px", flexWrap: "wrap" }}>
        {images.map((img) => (
        <div key={img.id} style={{ textAlign: "center" }}>
            <img
            src={img.data}
            alt={img.name}
            width="150"
            style={{ border: "1px solid #ccc", padding: "5px" }}
            />

            {editingId === img.id ? (
            <div style={{ marginTop: "5px" }}>
                <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
                style={{ width: "140px" }}
                />
                <button
                onClick={() => renameImage(img.id)}
                style={{ marginLeft: "5px", cursor: "pointer" }}
                >
                ✔
                </button>
            </div>
            ) : (
            <div style={{ marginTop: "5px" }}>
                <span>{img.name}</span>
                <button
                onClick={() => {
                    setEditingId(img.id);
                    setNewName(img.name);
                }}
                style={{
                    marginLeft: "5px",
                    cursor: "pointer",
                    border: "none",
                    background: "transparent",
                    fontSize: "16px",
                }}
                >
                ✏️
                </button>
            </div>
            )}
        </div>
        ))}
      </div>
    </div>
  );
}

export default ImageLibrary;
