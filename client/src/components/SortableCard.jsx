import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import Card from './Card';

export function SortableCard({ id, card, auth, onUpdateCard, onDeleteCard }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: id,
        data: {
            type: 'Card',
            card,
        }
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition, // Utilise la transition native de dnd-kit pour plus de simplicité/fluidité
        zIndex: isDragging ? 100 : undefined,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`transition-opacity duration-200 ${isDragging ? 'opacity-30' : 'opacity-100'}`}
        >
            <Card
                card={card}
                auth={auth}
                onUpdateCard={onUpdateCard}
                onDeleteCard={onDeleteCard}
            />
        </div>
    );
}
