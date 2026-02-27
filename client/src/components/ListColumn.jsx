import { FaEllipsisV, FaPlus, FaCopy, FaExchangeAlt, FaTrash } from "react-icons/fa";
import { SortableCard } from "./SortableCard";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo } from "react";

export function ListColumn({
    list,
    auth,
    onUpdateListTitle,
    onCopyList,
    onDeleteList,
    onMoveList,
    onAddCard,
    onUpdateCard,
    onDeleteCard
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: list.id,
        data: {
            type: 'List',
            list,
        }
    });

    const style = {
        transition,
        transform: CSS.Translate.toString(transform),
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`glass-panel min-w-[225px] w-[225px] max-w-[225px] max-h-[calc(90vh-120px)] mb-6 flex-shrink-0 flex flex-col relative overflow-x-hidden focus-within:z-50 ${isDragging ? 'opacity-40 grayscale-[0.5]' : 'opacity-100'}`}
        >
            <div
                {...attributes}
                {...listeners}
                className="flex justify-between items-center mb-1 border-b border-white/10 pb-2 px-3 pt-3 cursor-grab active:cursor-grabbing group"
            >
                <input
                    type="text"
                    defaultValue={list.title}
                    onBlur={(e) => onUpdateListTitle(list.id, e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
                    onClick={(e) => e.stopPropagation()}
                    className="font-bold text-base bg-transparent border-none outline-none focus:ring-0 focus:text-indigo-300 transition-colors rounded px-1 w-full pointer-events-auto"
                />

                <div className="dropdown dropdown-end pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                    <label tabIndex={0} className="btn btn-ghost btn-xs text-white/50 hover:text-white transition-colors">
                        <FaEllipsisV />
                    </label>
                    <ul tabIndex={0} className="dropdown-content z-[100] menu p-2 shadow-2xl bg-slate-900/90 backdrop-blur-xl rounded-xl w-52 border border-white/10 text-white shadow-black/60 mt-2">
                        <li>
                            <button onClick={() => document.getElementById(`input-card-${list.id}`).focus()}>
                                <FaPlus className="text-indigo-400" /> Ajouter une carte
                            </button>
                        </li>
                        <li>
                            <button onClick={() => onCopyList(list.id)}>
                                <FaCopy className="text-amber-400" /> Copier la liste
                            </button>
                        </li>
                        <li>
                            <button onClick={() => {
                                const pos = prompt("Nouvelle position (nombre) :", list.position);
                                if (pos) onMoveList(list, pos);
                            }}>
                                <FaExchangeAlt className="text-emerald-400" /> Déplacer la liste
                            </button>
                        </li>
                        <div className="divider my-1 opacity-10"></div>
                        <li>
                            <button onClick={() => onDeleteList(list.id)} className="text-rose-400 hover:bg-rose-500/20">
                                <FaTrash /> Supprimer la liste
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="flex flex-col gap-1 max-h-full overflow-y-auto overflow-x-hidden px-2 custom-scrollbar">
                <SortableContext items={useMemo(() => list.cards?.map(c => c.id) || [], [list.cards])} strategy={verticalListSortingStrategy}>
                    <div className="flex flex-col gap-1 min-h-[10px]">
                        {list.cards?.map((card) => (
                            <SortableCard
                                key={card.id}
                                id={card.id}
                                card={card}
                                auth={auth}
                                onUpdateCard={(updated) => onUpdateCard(list.id, updated)}
                                onDeleteCard={(deletedId) => onDeleteCard(list.id, deletedId)}
                            />
                        ))}
                    </div>
                </SortableContext>
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target;
                    const input = form.elements.content;
                    if (!input.value.trim()) return;
                    onAddCard(list.id, input.value);
                    form.reset();
                }}
                className="mx-2 mb-2 pt-1 border-t border-white/5"
            >
                <input
                    id={`input-card-${list.id}`}
                    name="content"
                    type="text"
                    placeholder="+ Ajouter une carte..."
                    className="w-full glass-input text-xs placeholder-white/30 focus:placeholder-white/50"
                />
            </form>
        </div>
    );
}
