import { useState, useEffect } from "react";
import Modal from "./Modal";
import ModalForm from "./ModalForm";
import ModalConfirm from "./ModalConfirm";
import { getTags, deleteTag } from "../../lib/services/tag.service";
import { FaTrash, FaPen, FaPlus, FaTags } from "react-icons/fa";
import Tag from "../Tag";
import { useTags } from "../../lib/context/TagContext";

export default function ModalTagManager({ isOpen, onRequestClose, onTagUpdate }) {
    const { tags, fetchTags } = useTags(); // Use global state instead of local
    // const [tags, setTags] = useState([]); // Removed local state
    const [editingTag, setEditingTag] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [tagToDelete, setTagToDelete] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchTags();
        }
    }, [isOpen]);

    // Removed fetchTags local function

    const handleDelete = async () => {
        if (!tagToDelete) return;
        try {
            await deleteTag(tagToDelete.id);
            fetchTags(); // Refresh context
            setIsConfirmOpen(false);
            setTagToDelete(null);
            if (onTagUpdate) onTagUpdate();
        } catch (err) {
            console.error("Failed to delete tag", err);
        }
    };

    const openEdit = (tag) => {
        setEditingTag(tag);
        setIsFormOpen(true);
    };

    const openCreate = () => {
        setEditingTag(null);
        setIsFormOpen(true);
    };

    const handleSave = (savedTag) => {
        // No need to manually update local state anymore as ModalForm calls fetchTags
        // But for immediate feedback if context is slow:
        // if (editingTag) {
        //     setTags(tags.map(t => t.id === savedTag.id ? savedTag : t));
        // } else {
        //     setTags([...tags, savedTag]);
        // }

        // Actually ModalForm handles the API call and context refresh.
        // We just need to close the form.
        setIsFormOpen(false);
        if (onTagUpdate) onTagUpdate();
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onRequestClose={onRequestClose}
                title="Gestion des Tags"
                style={{ marginTop: "0px" }}
            >
                <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-gray-500">Gérez vos étiquettes ici.</p>
                    <button
                        onClick={openCreate}
                        className="btn btn-sm btn-primary flex items-center gap-2"
                    >
                        <FaPlus /> Nouveau Tag
                    </button>
                </div>

                <div className="flex flex-row gap-2 max-h-[60vh] overflow-y-auto">
                    {tags.length === 0 && <p className="text-center text-gray-400 italic">Aucun tag créé.</p>}
                    {tags.map(tag => (
                        <div key={tag.id} className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50 bg-white w-min">
                            <div className="flex items-center gap-2">
                                <Tag tag={tag} />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openEdit(tag)}
                                    className="btn btn-xs btn-ghost text-amber-600"
                                    style={{ border: "1px solid #ccc" }}
                                >
                                    <FaPen />
                                </button>
                                <button
                                    onClick={() => {
                                        setTagToDelete(tag);
                                        setIsConfirmOpen(true);
                                    }}
                                    className="btn btn-xs btn-ghost text-red-600"
                                    style={{ border: "1px solid #ccc" }}
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="modal-action">
                    <button onClick={onRequestClose} className="btn">Fermer</button>
                </div>
            </Modal>

            {/* Nested Modals */}
            {isFormOpen && (
                <ModalForm
                    isOpen={isFormOpen}
                    onRequestClose={() => setIsFormOpen(false)}
                    tag={editingTag}
                    onSave={handleSave}
                />
            )}

            {isConfirmOpen && (
                <ModalConfirm
                    isOpen={isConfirmOpen}
                    onClose={() => setIsConfirmOpen(false)}
                    onConfirm={handleDelete}
                    title="Supprimer le tag ?"
                    message={`Voulez-vous vraiment supprimer le tag "${tagToDelete?.name}" ?`}
                />
            )}
        </>
    );
}
