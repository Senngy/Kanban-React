import { useEffect, useState } from "react";
import Card from "./Card";
import { getLists, createList, deleteList, updateList, copyList } from "../lib/services/list.service";
import { createCard } from "../lib/services/card.service";
import { FaEllipsisV, FaPlus, FaCopy, FaExchangeAlt, FaTrash } from "react-icons/fa";

export default function List({ auth }) {
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState("");
  const [error, setError] = useState("");

  // Charger les listes depuis API
  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const data = await getLists();
      if (!data) {
        setError("Vous n'avez aucune liste pour le moment.");
        return;
      }
      setLists(data);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les listes.");
    }
  };

  const handleCreateList = async () => {
    if (!newListName) return;
    try {
      const created = await createList({ title: newListName });
      setLists([...lists, created]);
      setNewListName("");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la création de la liste.");
    }
  };

  const handleUpdateListTitle = async (id, newTitle) => {
    if (!newTitle) return;
    try {
      await updateList({ id, title: newTitle });
      setLists(lists.map(l => l.id === id ? { ...l, title: newTitle } : l));
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la mise à jour du titre.");
    }
  };

  const handleCopyList = async (id) => {
    try {
      const newList = await copyList(id);
      fetchLists(); // Refetch to get correct positions and associations
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la copie de la liste.");
    }
  };

  const handleDeleteList = async (id) => {
    try {
      await deleteList(id);
      setLists(lists.filter((l) => l.id !== id));
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression de la liste.");
    }
  };

  const handleMoveList = async (list, newPos) => {
    try {
      await updateList({ id: list.id, position: parseInt(newPos) });
      fetchLists();
    } catch (err) {
      console.error(err);
      setError("Erreur lors du déplacement de la liste.");
    }
  }

  const handleCreateCard = async (listId, content, description = "") => {
    if (!content) return;
    try {
      const newCard = await createCard({ content, description, list_id: listId, position: 1 });
      setLists((prev) =>
        prev.map((l) =>
          l.id === listId
            ? { ...l, cards: l.cards ? [...l.cards, newCard] : [newCard] }
            : l
        )
      );
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la création de la carte.");
    }
  };

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}

      {/* Création de liste */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="Ajouter une liste..."
          className="glass-input input-bordered text-black placeholder-black/70"
        />
        <button onClick={handleCreateList} className="glass-button px-4 rounded-lg">
          Ajouter
        </button>
      </div>

      {/* Affichage listes */}
      <div className="flex flex-row gap-4 overflow-x-auto rounded-lg items-start h-full ">
        {lists.map((list) => (
          <div key={list.id} className={`glass-panel pt-4 pl-2 pr-1 pb-2 min-w-[280px] w-[300px] max-h-[calc(80vh-100px)] mb-6 flex-shrink-0 flex flex-col gap-3 animate-fade-in relative focus-within:z-50 ${list.id}`}>
            <div className="flex justify-between items-center mb-1 border-b border-white/20 pb-1 relative group-list">
              <input
                type="text"
                defaultValue={list.title}
                onBlur={(e) => handleUpdateListTitle(list.id, e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
                className="font-bold bg-transparent border-none outline-none focus:ring-1 focus:ring-white/20 focus:bg-white/30 rounded px-1 w-full"
              />

              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-xs text-black hover:text-white">
                  <FaEllipsisV />
                </label>
                <ul tabIndex={0} className="dropdown-content z-[10] menu p-2 shadow-xl bg-slate-800/95 backdrop-blur-md rounded-box w-52 border border-white/10 text-white" style={{ position: "absolute", top: "100%", left: "0", zIndex: 10 }}>
                  <li>
                    <button onClick={() => {
                      document.getElementById(`input-card-${list.id}`).focus();
                    }}>
                      <FaPlus className="text-blue-400" /> Ajouter une carte
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleCopyList(list.id)}>
                      <FaCopy className="text-amber-400" /> Copier la liste
                    </button>
                  </li>
                  <li>
                    <button onClick={() => {
                      const pos = prompt("Nouvelle position (nombre) :", list.position);
                      if (pos) handleMoveList(list, pos);
                    }}>
                      <FaExchangeAlt className="text-emerald-400" /> Déplacer la liste
                    </button>
                  </li>
                  <div className="divider my-0 opacity-20"></div>
                  <li>
                    <button onClick={() => handleDeleteList(list.id)} className="text-red-400">
                      <FaTrash /> Supprimer la liste
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col gap-2 max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar">
              {list.cards?.map((card) => (
                <Card
                  key={card.id}
                  card={card}
                  auth={auth}
                  onUpdateCard={(updated) => {
                    setLists((prev) =>
                      prev.map((l) =>
                        l.id === list.id
                          ? {
                            ...l,
                            cards: l.cards.map((c) =>
                              c.id === updated.id ? updated : c
                            ),
                          }
                          : l
                      )
                    );
                  }}
                  onDeleteCard={(deletedId) => {
                    setLists((prev) =>
                      prev.map((l) =>
                        l.id === list.id
                          ? { ...l, cards: l.cards.filter((c) => c.id !== deletedId) }
                          : l
                      )
                    );
                  }}
                />
              ))}
            </div>
            {/* New Card Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                const input = form.elements.content;
                handleCreateCard(list.id, input.value);
                form.reset();
              }}
              className=""
            >
              <input
                id={`input-card-${list.id}`}
                name="content"
                type="text"
                placeholder="Ajouter une carte..."
                className="w-full rounded glass-input text-sm placeholder-gray-500/70"
              />
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
