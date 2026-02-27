import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { FaTrash, FaPen, FaAlignLeft } from "react-icons/fa"; // Added FaAlignLeft
import Modal from "./modals/Modal";
import ModalConfirm from "./modals/ModalConfirm";
import { deleteCard, updateCard } from "../lib/services/card.service";
import { getTags } from "../lib/services/tag.service";
import Tag from "./Tag";

export default function Card({ card, auth, onUpdateCard, onDeleteCard, isOverlay }) {
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
      className={`glass-card p-2 flex justify-between items-start relative group rounded-2xl border-white/5 hover:border-white/20 ${card.is_done ? "opacity-60 grayscale-[0.3]" : ""} ${isOverlay ? "shadow-2xl ring-1 ring-white/20" : ""
        }`}
    >
      <div className="flex gap-2 items-start w-full">
        <label className="relative flex items-center cursor-pointer group mt-1">
          <input
            type="checkbox"
            checked={card.is_done || false}
            onChange={async (e) => {
              e.stopPropagation();
              try {
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
            className="peer h-3.5 w-3.5 cursor-pointer appearance-none rounded-sm border border-white/20 transition-all checked:bg-indigo-500 checked:border-indigo-500 hover:border-indigo-400 focus:outline-none"
          />
          <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </span>
        </label>

        <div className="flex flex-col gap-1 w-full">
          {card.tags && card.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-1">
              {card.tags.map(tag => (
                <Tag key={tag.id} tag={tag} />
              ))}
            </div>
          )}

          <div className="markdown-body text-xs font-medium leading-relaxed text-slate-200">
            <ReactMarkdown>{card.content}</ReactMarkdown>
          </div>

          {(card.description || (card.tags && card.tags.length > 0)) && (
            <div className="flex items-center gap-2 mt-1 opacity-30">
              {card.description && <FaAlignLeft size={10} title="Description présente" />}
            </div>
          )}
        </div>
      </div>

      <div
        className={`flex gap-1 absolute -top-0.5 -right-0 transition-all duration-300 ${hovered ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-1 scale-90 pointer-events-none"
          }`}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleOpenModal();
          }}
          className="flex h-6 w-6 items-center justify-center rounded-xl bg-slate-800/80 backdrop-blur-md border border-white/10 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all shadow-xl"
        >
          <FaPen size={11} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setConfirmOpen(true);
          }}
          className="flex h-6 w-6 items-center justify-center rounded-xl bg-slate-800/80 backdrop-blur-md border border-white/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all shadow-xl"
        >
          <FaTrash size={11} />
        </button>
      </div>

      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onRequestClose={() => setModalOpen(false)}
          title="✍️ Éditer la carte"
        >
          {error && <p className="text-rose-400 mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-sm">{error}</p>}
          <form onSubmit={editCard} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Titre de la tâche</label>
              <textarea
                className="glass-input h-24 text-base focus:ring-indigo-500"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Qu'y a-t-il à faire ?"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Description détaillée</label>
              <textarea
                className="glass-input h-40 text-sm focus:ring-indigo-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ajoutez des détails, des liens, du markdown..."
              />
            </div>

            <div className="flex flex-col gap-3 px-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Étiquettes</span>
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => {
                  const isSelected = selectedTagIds.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 ${isSelected
                        ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-900 scale-105"
                        : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                        }`}
                      style={{
                        backgroundColor: isSelected ? tag.color : undefined,
                        borderColor: tag.color,
                        color: isSelected ? '#fff' : undefined,
                        textShadow: isSelected ? '0 1px 2px rgba(0,0,0,0.3)' : 'none'
                      }}
                    >
                      {tag.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3 mt-4 pt-4 border-t border-white/10">
              <button
                type="submit"
                className="flex-1 glass-button py-3 px-4 rounded-xl text-sm"
              >
                Sauvegarder les modifications
              </button>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-semibold transition-all"
              >
                Annuler
              </button>
            </div>
          </form>
        </Modal>
      )}

      {confirmOpen && (
        <ModalConfirm
          isOpen={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleDeleteCard}
          title="❌ Supprimer la carte"
          message="Cette action est irréversible. Voulez-vous vraiment supprimer cette carte ?"
        />
      )}
    </div>
  );
}
