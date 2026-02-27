import React from 'react';
import { useTags } from '../lib/context/TagContext';

export default function Tag({ tag, className = "" }) {
    const { getTag } = useTags();
    // Get latest version of tag from context, fallback to prop
    const liveTag = getTag(tag.id) || tag;

    return (
        <span
            className="px-1.5 py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-tight text-white shadow-sm"
            style={{
                backgroundColor: `${tag.color}cc`, // Ajout d'une légère transparence
                border: `1px solid ${tag.color}`,
                boxShadow: `0 2px 8px -2px ${tag.color}66`, // Glow subtile
                textShadow: '0 1px 2px rgba(0,0,0,0.2)'
            }}
        >
            {tag.name}
        </span>
    );
}
