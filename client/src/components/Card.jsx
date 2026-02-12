import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { FaTrash, FaPen, FaAlignLeft } from "react-icons/fa"; // Added FaAlignLeft
import Modal from "./modals/Modal";
import ModalConfirm from "./modals/ModalConfirm";
import { deleteCard, updateCard } from "../lib/services/card.service";
import { getTags } from "../lib/services/tag.service";
import Tag from "./Tag";

export default function Card({ card, auth, onUpdateCard, onDeleteCard }) {
  const [hovered, setHovered] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [text, setText] = useState(card.content);
  const [description, setDescription] = useState(card.description || "");
  // Store selected TAG OBJECTS for local UI, but we send IDs to backend
  // Actually, keeping IDs is simpler for submission, but we need objects for display color
  const [selectedTagIds, setSelectedTagIds] = useState(card.tags?.map(t => t.id) || []);
  const [availableTags, setAvailableTags] = useState([]);
  const [error, setError] = useState("");

  const handleOpenModal = async () => {
    setModalOpen(true);
    try {
      const tags = await getTags();
      setAvailableTags(tags);
      // Sync state with current card props in case they changed 
      // (though card prop update should re-render component, local state needs manual sync if modal was closed)
      setText(card.content);
      setDescription(card.description || "");
      setSelectedTagIds(card.tags?.map(t => t.id) || []);
    } catch (err) {
      console.error("Failed to fetch tags", err);
    }
  };

  const toggleTag = (tagId) => {
    setSelectedTagIds(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const editCard = async (e) => {
    e.preventDefault();
    try {
      const updatedCard = await updateCard({
        id: card.id,
        content: text,
        description: description, // Send description
        tags: selectedTagIds // Send IDs to backend
      });
      onUpdateCard && onUpdateCard(updatedCard); // parent handles updating state
      setModalOpen(false);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Une erreur s'est produite lors de la mise à jour de la carte.");
    }
  };

  const handleDeleteCard = async () => {
    try {
      await deleteCard(card.id);
      onDeleteCard && onDeleteCard(card.id); // parent handles removing card
      setConfirmOpen(false);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Une erreur s'est produite lors de la suppression de la carte.");
    }
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className={`glass-panel p-1 flex justify-between items-center relative group hover:bg-white/40 transition-all cursor-pointer ${card.is_done ? "opacity-60 grayscale" : ""
        }`}
    >
      <div className="flex gap-2 items-start w-full">
        {/* Checkbox for completion */}
        <input
          type="checkbox"
          checked={card.is_done || false}
          onChange={async (e) => {
            e.stopPropagation(); // prevent opening modal
            try {
              // Ensure we send only IDs for tags, not full objects
              const tagIds = card.tags ? card.tags.map(t => t.id) : [];
              const updatedCard = await updateCard({
                ...card,
                is_done: e.target.checked,
                tags: tagIds
              });
              onUpdateCard && onUpdateCard(updatedCard);
            } catch (err) {
              console.error("Failed to toggle completion", err);
            }
          }}
          className="checkbox checkbox-xs checkbox-primary mt-1"
        />

        <div className="flex flex-col gap-1 w-full">
          {/* Tags */}
          {card.tags && card.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-1">
              {card.tags.map(tag => (
                <Tag key={tag.id} tag={tag} />
              ))}
            </div>
          )}

          <div className="markdown-body">
            <ReactMarkdown>{card.content}</ReactMarkdown>
          </div>

          {/* Description Icon */}
          {card.description && (
            <div className="text-white/50 mt-1" title="Cette carte a une description">
              <FaAlignLeft size={10} />
            </div>
          )}
        </div>
      </div>

      <div
        className={`flex gap-2 absolute right-2 items-center h-full transition-opacity ${hovered ? "opacity-100" : "opacity-0"
          }`}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleOpenModal();
          }}
          className="glass-button text-amber-600 h-[30px] w-[30px] flex items-center justify-center rounded-full"
        >
          <FaPen size={12} />
        </button>

        {/* Edit Modal */}
        {modalOpen && (
          <Modal
            isOpen={modalOpen}
            onRequestClose={() => setModalOpen(false)}
            title="Modifier la carte"
          >
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={editCard} className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-black uppercase tracking-wider ml-1">Titre :</label>
              <textarea
                className="textarea text-white h-20 bg-white/5"
                style={{ backgroundColor: 'black' }}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Titre de la carte..."
              />

              <label className="text-xs font-semibold text-black uppercase tracking-wider mt-2 ml-1">Description :</label>
              <textarea
                className="textarea text-white h-32 text-sm bg-white/5"
                style={{ backgroundColor: 'black' }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ajouter une description détaillée (Markdown supporté)..."
              />

              {/* Tag Selection */}
              <div className="flex flex-col gap-1 my-2">
                <span className="text-sm font-semibold text-black">Tags:</span>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map(tag => {
                    const isSelected = selectedTagIds.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => toggleTag(tag.id)}
                        className={`px-2 py-1 rounded-full text-xs font-bold border transition-colors ${isSelected
                          ? "ring-2 ring-offset-1 text-black opacity-100"
                          : "bg-white text-gray-500 border-gray-300 opacity-70 hover:opacity-100"
                          }`}
                        style={{
                          backgroundColor: isSelected ? tag.color : undefined,
                          borderColor: tag.color
                        }}
                      >
                        {tag.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-center gap-2">
                <button className="bg-blue-500 text-white px-2 py-1 rounded">
                  Modifier
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Annuler
                </button>
              </div>
            </form>
          </Modal>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            setConfirmOpen(true);
          }}
          className="glass-button text-red-600 h-[30px] w-[30px] flex items-center justify-center rounded-full"
        >
          <FaTrash size={12} />
        </button>

        {/* Confirm Modal */}
        {confirmOpen && (
          <ModalConfirm
            isOpen={confirmOpen}
            onClose={() => setConfirmOpen(false)}
            onConfirm={handleDeleteCard}
            title="Supprimer la carte"
            message="Confirmez que vous souhaitez supprimer cette carte"
          />
        )}
      </div>
    </div>
  );
}