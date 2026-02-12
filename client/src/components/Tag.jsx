import React from 'react';
import { useTags } from '../lib/context/TagContext';

export default function Tag({ tag, className = "" }) {
    const { getTag } = useTags();
    // Get latest version of tag from context, fallback to prop
    const liveTag = getTag(tag.id) || tag;

    return (
        <span
            className={`px-2 py-0.5 text-[11px] rounded-full shadow-sm inline-block truncate max-w-[100px] border border-white/20 ${className}`}
            style={{
                backgroundColor: liveTag.color || '#e5e7eb',
                color: 'black', // Defaulting to white text for now, or we can use a helper for contrast
                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
            }}
            title={liveTag.name}
        >
            {liveTag.name}
        </span>
    );
}
