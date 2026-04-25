import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Pencil, Trash2, FileText } from 'lucide-react';

const BookCard = ({ book, onDelete }) => {
    const navigate = useNavigate();

    const chapterCount = book.chapters?.length || 0;
    const coverUrl = book.coverImage
        ? `http://localhost:8000${book.coverImage}`
        : null;

    return (
        <div className="group relative bg-white rounded-2xl border border-border/60 overflow-hidden hover:shadow-elevated hover:border-primary/20 transition-all duration-300">
            {/* Hover action buttons - top right corner */}
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/editor/${book._id}`); }}
                    className="p-2 rounded-xl bg-white/90 backdrop-blur-sm border border-border/60 text-text-secondary hover:text-primary hover:border-primary/30 hover:bg-white shadow-soft transition-all duration-200 cursor-pointer"
                    title="Edit"
                >
                    <Pencil size={14} />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete?.(book._id); }}
                    className="p-2 rounded-xl bg-white/90 backdrop-blur-sm border border-border/60 text-text-secondary hover:text-error hover:border-error/30 hover:bg-error/5 shadow-soft transition-all duration-200 cursor-pointer"
                    title="Delete"
                >
                    <Trash2 size={14} />
                </button>
            </div>

            {/* Cover */}
            <div
                className="h-48 relative cursor-pointer overflow-hidden"
                onClick={() => navigate(`/editor/${book._id}`)}
            >
                {coverUrl ? (
                    <img src={coverUrl} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 flex items-center justify-center group-hover:from-primary/15 group-hover:via-accent/15 group-hover:to-primary/10 transition-all duration-500">
                        <BookOpen size={40} className="text-primary/25" />
                    </div>
                )}
                {/* Status badge */}
                <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium backdrop-blur-sm ${book.status === 'published' ? 'bg-success/15 text-success border border-success/20' : 'bg-warning/15 text-warning border border-warning/20'}`}>
                        {book.status || 'draft'}
                    </span>
                </div>
            </div>

            {/* Info */}
            <div className="p-4">
                <h3
                    className="text-sm font-semibold text-text-primary truncate group-hover:text-primary transition-colors cursor-pointer"
                    onClick={() => navigate(`/editor/${book._id}`)}
                >
                    {book.title}
                </h3>
                {book.subtitle && (
                    <p className="text-xs text-text-muted truncate mt-0.5">{book.subtitle}</p>
                )}
                <div className="flex items-center gap-3 mt-3 text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                        <FileText size={12} />
                        {chapterCount} chapter{chapterCount !== 1 ? 's' : ''}
                    </span>
                    <span>by {book.author}</span>
                </div>
            </div>
        </div>
    );
};

export default BookCard;
