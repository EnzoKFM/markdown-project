function ConfirmModal({ isOpen, onClose, onSubmit, title = "Voulez-vous confirmer ?" }) {

  const handleConfirm = (e) => {
    e.preventDefault();
    onSubmit(true);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-700/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 justify-center">{title}</h2>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >Annuler</button>

              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >Valider</button>
            </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal