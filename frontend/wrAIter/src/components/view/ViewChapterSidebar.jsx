import React from 'react';

const ViewChapterSidebar = ({ chapters = [], activeIndex, onSelect }) => {
    return (
        <div className="w-60 flex-shrink-0 bg-white rounded-2xl border border-border/60 shadow-soft overflow-hidden hidden md:flex flex-col">
            <div className="px-4 py-3 border-b border-border/60">
                <h3 className="text-sm font-semibold text-text-primary">Contents</h3>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-0.5">
                {chapters.map((ch, i) => (
                    <button
                        key={i}
                        onClick={() => onSelect(i)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all cursor-pointer ${
                            i === activeIndex
                                ? 'bg-primary/5 text-primary font-medium'
                                : 'text-text-secondary hover:bg-surface-alt'
                        }`}
                    >
                        <span className="truncate block">{ch.title || `Chapter ${i + 1}`}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ViewChapterSidebar;
