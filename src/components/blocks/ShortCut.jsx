function ShortCut({ shortcut, onChange, blocks, currentBlockId }) {
  const handleKeyChange = (name, value) => {
    console.log("dans handleKeyChange");
    console.log("name", name);
    console.log("value", value);
    onChange({
      ...shortcut,
      [name]: value,
    });
  };

  const handleMainKeyChange = (e) => {
    onChange({
      ...shortcut,
      key: e.target.value,
    });
  };

  const verifyShortCutExist = (sc) => {
    if (!sc) return null;
    const parts = [];
    if (sc.ctrlKey) parts.push("Ctrl");
    if (sc.altKey) parts.push("Alt");
    if (sc.shiftKey) parts.push("Shift");
    parts.push(sc.key.toUpperCase());
    return parts.join(" + ");
  };

  const currentShortCut = verifyShortCutExist(shortcut);

  const findDuplicateShortCut = blocks.find((block) => {
    if (block.id === currentBlockId) return false;
    if (!block.shortcut || !block.shortcut.key) return false;
    return verifyShortCutExist(block.shortcut) === currentShortCut;
  });

  return (
    <div className="mb-4 p-4 border border-gray-200 rounded-md bg-gray-50">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Raccourci clavier (optionnel)
      </label>

      <div className="flex gap-4 mb-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={shortcut?.ctrlKey || false}
            onChange={(e) => handleKeyChange("ctrlKey", e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm">Ctrl</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={shortcut?.altKey || false}
            onChange={(e) => handleKeyChange("altKey", e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm">Alt</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={shortcut?.shiftKey || false}
            onChange={(e) => handleKeyChange("shiftKey", e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm">Shift</span>
        </label>

        <div className="mb-3">
          <label className="block text-sm text-gray-600 mb-1">Touche :</label>
          <select
            value={shortcut?.key || ""}
            onChange={handleMainKeyChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Aucune</option>
            {/* Lettres A-Z */}
            {Array.from({ length: 26 }, (_, i) =>
              String.fromCharCode(65 + i)
            ).map((letter) => (
              <option key={letter} value={letter}>
                {letter}
              </option>
            ))}
            {/* Chiffres 0-9 */}
            {Array.from({ length: 10 }, (_, i) => i).map((num) => (
              <option key={num} value={num.toString()}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </div>

      {currentShortCut && (
        <div className="mb-2">
          <span className="text-sm text-gray-600">Aperçu : </span>
          <span className="text-sm font-mono font-semibold bg-white px-2 py-1 rounded border border-gray-300">
            {currentShortCut}
          </span>
        </div>
      )}

      {findDuplicateShortCut && (
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-300 rounded text-sm text-yellow-800">
          ⚠️ Ce raccourci est déjà utilisé par le bloc "
          {findDuplicateShortCut.name}"
        </div>
      )}
    </div>
  );
}

export default ShortCut;
