import { useEffect, useState, useMemo } from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { ListColumn } from "./ListColumn";
import { SortableCard } from "./SortableCard";
import Card from "./Card";
import { getLists, createList, deleteList, updateList, copyList } from "../lib/services/list.service";
import { createCard, updateCard as updateCardApi } from "../lib/services/card.service";
import { useAuth } from "../lib/hooks/useAuth";
import { useKanbanDnd } from "../lib/hooks/useKanbanDnd";

export default function Board() {
  const { user } = useAuth();
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState("");
  const [error, setError] = useState("");

  const {
    sensors,
    activeId,
    activeType,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    collisionDetection,
    dropAnimation
  } = useKanbanDnd({
    lists,
    setLists,
    updateList,
    updateCardApi,
    setError
  });

  useEffect(() => {
    console.log("[Board] Mounted");
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      console.log("[Board] Fetching lists...");
      const data = await getLists();
      console.log("[Board] Lists received:", data);
      setLists(data || []);
    } catch (err) {
      console.error("[Board] Fetch error:", err);
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
      setError("Erreur lors de la création de la liste.");
    }
  };

  const onUpdateListTitle = async (id, newTitle) => {
    try {
      await updateList({ id, title: newTitle });
      setLists(prev => prev.map(l => l.id === id ? { ...l, title: newTitle } : l));
    } catch (err) {
      setError("Erreur lors de la mise à jour du titre.");
    }
  };

  const onAddCard = async (listId, content) => {
    try {
      const newCard = await createCard({ content, list_id: listId, position: 1 });
      setLists(prev => prev.map(l => l.id === listId ? { ...l, cards: [...(l.cards || []), newCard] } : l));
    } catch (err) {
      setError("Erreur création carte.");
    }
  };

  const onUpdateCard = (listId, updatedCard) => {
    setLists(prev => prev.map(l => l.id === listId ? {
      ...l,
      cards: l.cards.map(c => c.id === updatedCard.id ? updatedCard : c)
    } : l));
  };

  const onDeleteCard = (listId, cardId) => {
    setLists(prev => prev.map(l => l.id === listId ? {
      ...l,
      cards: l.cards.filter(c => c.id !== cardId)
    } : l));
  };

  return (
    <div className="flex flex-col h-full">

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="Ajouter une liste..."
          className="glass-input input-bordered text-black placeholder-gray-700"
        />
        <button onClick={handleCreateList} className="glass-button px-4 rounded-lg">
          Ajouter
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-row gap-4 overflow-x-auto rounded-lg items-start h-full pb-10">
          <SortableContext items={useMemo(() => lists.map(l => l.id), [lists])} strategy={horizontalListSortingStrategy}>
            {lists.map((list) => (
              <ListColumn
                key={list.id}
                list={list}
                auth={{ user }}
                onUpdateListTitle={onUpdateListTitle}
                onCopyList={async (id) => {
                  try {
                    await copyList(id);
                    await fetchLists();
                  } catch (err) {
                    setError("Erreur lors de la copie de la liste.");
                  }
                }}
                onDeleteList={async (id) => {
                  await deleteList(id);
                  setLists(prev => prev.filter(l => l.id !== id));
                }}
                onMoveList={async (l, p) => {
                  await updateList({ id: l.id, position: parseInt(p) });
                  fetchLists();
                }}
                onAddCard={onAddCard}
                onUpdateCard={onUpdateCard}
                onDeleteCard={onDeleteCard}
              />
            ))}
          </SortableContext>
        </div>

        <DragOverlay dropAnimation={dropAnimation}>
          {activeId ? (
            activeType === 'List' ? (
              <ListColumn
                list={lists.find(l => l.id === activeId)}
                auth={{ user }}
                onUpdateListTitle={onUpdateListTitle}
                onCopyList={() => { }}
                onDeleteList={() => { }}
                onMoveList={() => { }}
                onAddCard={() => { }}
                onUpdateCard={() => { }}
                onDeleteCard={() => { }}
              />
            ) : (
              (() => {
                const activeCard = lists.flatMap(l => l.cards || []).find(c => c.id === activeId);
                return activeCard ? (
                  <Card
                    card={activeCard}
                    auth={{ user }}
                    isOverlay
                  />
                ) : null;
              })()
            )
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
