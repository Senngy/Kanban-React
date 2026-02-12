import { useState, useEffect } from "react";
import Modal from "./Modal";
import { createTag, updateTag } from "../../lib/services/tag.service";
import { useTags } from "../../lib/context/TagContext";

export default function ModalForm({ isOpen, onRequestClose, tag, onSave }) {
  const { fetchTags } = useTags();
  const [name, setName] = useState("");
  const [color, setColor] = useState("#6366f1"); // Default color
  const [error, setError] = useState("");

  useEffect(() => {
    if (tag) {
      setName(tag.name);
      setColor(tag.color || "#6366f1");
    } else {
      setName("");
      setColor("#6366f1");
    }
  }, [tag]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (tag) {
        const updated = await updateTag({ id: tag.id, name, color });
        onSave(updated);
      } else {
        const created = await createTag({ name, color });
        onSave(created);
      }
      fetchTags(); // Update global context
      onRequestClose();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la sauvegarde du tag.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      title={tag ? "Modifier Tag" : "Nouveau Tag"}
    >
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSave} className="flex flex-col gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom du tag"
          className="glass-input input-bordered w-full"
          required
        />

        <div className="flex items-center gap-4 p-2 glass-panel">
          <label className="text-sm font-semibold">Couleur :</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-10 h-10 p-0 border-0 rounded-full overflow-hidden cursor-pointer"
          />
          <span className="text-xs text-gray-400">{color}</span>
        </div>
        <div className="flex justify-center gap-2 mt-2">
          <button type="submit" className="btn btn-primary">
            {tag ? "Modifier" : "Créer"}
          </button>
          <button
            type="button"
            onClick={onRequestClose}
            className="btn btn-secondary"
          >
            Annuler
          </button>
        </div>
      </form>
    </Modal>
  );
}
