import { useState, useCallback } from "react";
import {
    useSensor,
    useSensors,
    PointerSensor,
    KeyboardSensor,
    closestCenter,
    defaultDropAnimationSideEffects
} from "@dnd-kit/core";
import {
    arrayMove,
    sortableKeyboardCoordinates
} from "@dnd-kit/sortable";

export function useKanbanDnd({ lists, setLists, updateList, updateCardApi, setError }) {
    const [activeId, setActiveId] = useState(null);
    const [activeType, setActiveType] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const findContainer = useCallback((id, items) => {
        if (!items || !id) return null;
        if (items.find(l => l.id === id)) return id;
        return items.find(l => l.cards?.some(c => c.id === id))?.id;
    }, []); // Plus de dépendance à lists pour éviter les re-renders circulaires

    const handleDragStart = useCallback((event) => {
        const { active } = event;
        const { id } = active;
        const type = active.data.current?.type;
        setActiveId(id);
        setActiveType(type);
    }, []);

    const handleDragOver = useCallback((event) => {
        const { active, over } = event;
        if (!over || activeType !== 'Card') return;

        const activeId = active.id;
        const overId = over.id;

        setLists((prev) => {
            const activeContainer = findContainer(activeId, prev);
            const overContainer = findContainer(overId, prev);

            if (!activeContainer || !overContainer) return prev;

            // Si on reste dans le même container
            if (activeContainer === overContainer) {
                const listIndex = prev.findIndex(l => l.id === activeContainer);
                const list = prev[listIndex];
                const activeIndex = list.cards.findIndex(i => i.id === activeId);
                const overIndex = list.cards.findIndex(i => i.id === overId);

                // Si overId est le container lui-même, on ne fait rien si la carte est déjà dedans
                if (overId === overContainer) return prev;

                if (activeIndex !== overIndex && activeIndex !== -1 && overIndex !== -1) {
                    const newLists = [...prev];
                    newLists[listIndex] = {
                        ...list,
                        cards: arrayMove(list.cards, activeIndex, overIndex)
                    };
                    return newLists;
                }
                return prev;
            }

            // Changement de container
            const activeList = prev.find(l => l.id === activeContainer);
            const overList = prev.find(l => l.id === overContainer);
            const activeItems = activeList.cards || [];
            const overItems = overList.cards || [];
            const activeIndex = activeItems.findIndex(i => i.id === activeId);
            const overIndex = overItems.findIndex(i => i.id === overId);

            if (activeIndex === -1) return prev;

            let newIndex;
            if (overId === overContainer) {
                // Survol du container vide ou de son header
                newIndex = overItems.length;
            } else {
                const isBelowLastItem = over && overIndex === overItems.length - 1;
                const modifier = isBelowLastItem ? 1 : 0;
                newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length;
            }

            // Verifier si le mouvement est réellement nécessaire pour éviter la boucle infinie
            const alreadyThere = overItems.some(c => c.id === activeId);
            if (alreadyThere && activeContainer === overContainer) return prev;

            return prev.map(l => {
                if (l.id === activeContainer) {
                    return { ...l, cards: l.cards.filter(i => i.id !== activeId) };
                }
                if (l.id === overContainer) {
                    const cardToMove = activeItems[activeIndex];
                    const newCards = [...l.cards];
                    newCards.splice(newIndex, 0, { ...cardToMove, list_id: overContainer });
                    return { ...l, cards: newCards };
                }
                return l;
            });
        });
    }, [activeType, findContainer, setLists]);

    const handleDragEnd = useCallback(async (event) => {
        const { active, over } = event;
        const activeId = active.id;
        const overId = over?.id;

        setActiveId(null);
        setActiveType(null);

        if (!over) return;

        if (activeType === 'List') {
            if (activeId !== overId) {
                setLists((items) => {
                    const oldIndex = items.findIndex(i => i.id === activeId);
                    const newIndex = items.findIndex(i => i.id === overId);
                    const newItems = arrayMove(items, oldIndex, newIndex);
                    updateList({ id: activeId, position: newIndex + 1 });
                    return newItems;
                });
            }
        } else if (activeType === 'Card') {
            const overContainer = findContainer(overId);
            if (!overContainer) return;

            // Trouver la position finale dans les listes actuelles
            const targetList = lists.find(l => l.id === overContainer);
            if (!targetList) return;

            const cardIndex = targetList.cards.findIndex(c => c.id === activeId);
            const targetPosition = cardIndex + 1;

            // Appel API unique en dehors du setter
            updateCardApi({
                id: activeId,
                list_id: overContainer,
                position: targetPosition
            }).catch(err => {
                console.error('❌ Erreur synchronisation API:', err);
                setError("Erreur de sauvegarde de la position.");
            });
        }
    }, [activeType, findContainer, setLists, updateList, updateCardApi, setError]);

    const dropAnimation = {
        duration: 250,
        easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
    };

    return {
        sensors,
        activeId,
        activeType,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
        collisionDetection: closestCenter, // Plus stable que closestCorners pour les listes
        dropAnimation
    };
}
