import Modal from "react-modal";

export default function CustomModal({ isOpen, onRequestClose, title, message, children, onConfirm }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="bg-white p-4 rounded-xl shadow-2xl max-w-4xl w-full mx-auto mt-20 relative outline-none"
      overlayClassName="fixed inset-0 bg-black/50 flex items-start justify-center z-50 backdrop-blur-sm"
    >
      {title && <h3 className="text-lg font-bold">{title}</h3>}
      {message && <p className="py-4">{message}</p>}

      <div className="modal-action flex flex-col gap-2 justify-center">
        {children}

        {onConfirm && (
          <div className="flex justify-center gap-2 mt-2">
            <button
              onClick={onConfirm}
              className="bg-blue-500 text-white px-2 py-1 rounded"
            >
              Oui
            </button>
            <button
              onClick={onRequestClose}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Annuler
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}