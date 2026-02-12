import Modal from "./Modal";

export default function ModalConfirm({ isOpen, onClose, onConfirm, title, message }) {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            title={title}
            message={message}
            onConfirm={onConfirm}
        />
    );
}
