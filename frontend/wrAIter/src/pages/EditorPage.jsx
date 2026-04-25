import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/ui/Button';
import InputField from '../components/ui/InputField';
import TextareaField from '../components/ui/TextareaField';
import SelectField from '../components/ui/SelectField';
import ConfirmModal from '../components/ui/ConfirmModal';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import toast from 'react-hot-toast';
import {
    Loader2, Save, ChevronLeft, Plus, Trash2, Sparkles, FileDown,
    FileText, GripVertical, PanelLeftClose, PanelLeft, Eye,
    BookOpen, Settings, Upload, Image as ImageIcon, X
} from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';

/* ============ Sortable Chapter Item ============ */
const SortableChapterItem = ({ chapter, index, isActive, onClick, onDelete, chaptersLength }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: `chapter-${index}` });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 50 : 'auto',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={onClick}
            className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all text-sm ${
                isActive
                    ? 'bg-primary/5 text-primary font-medium'
                    : 'text-text-secondary hover:bg-surface-alt'
            }`}
        >
            <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-0.5 rounded hover:bg-surface-alt/50"
                onClick={(e) => e.stopPropagation()}
            >
                <GripVertical size={14} className="text-text-muted/40 flex-shrink-0" />
            </div>
            <span className="truncate flex-1">{chapter.title || `Chapter ${index + 1}`}</span>
            {chaptersLength > 1 && (
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(index); }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-text-muted hover:text-error transition-all cursor-pointer"
                >
                    <Trash2 size={12} />
                </button>
            )}
        </div>
    );
};

/* ============ Editor Page ============ */
const EditorPage = () => {
    const { bookId } = useParams();
    const navigate = useNavigate();

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [activeChapter, setActiveChapter] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [exportLoading, setExportLoading] = useState('');
    const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'details'
    const [deleteChapterIndex, setDeleteChapterIndex] = useState(null);
    const [coverUploading, setCoverUploading] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const coverInputRef = useRef(null);

    // Track original book for comparison
    const originalBookRef = useRef(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    const fetchBook = useCallback(async () => {
        try {
            const res = await axiosInstance.get(`${API_PATHS.BOOKS.GET_BOOK_BY_ID}/${bookId}`);
            setBook(res.data.book);
            originalBookRef.current = JSON.stringify(res.data.book);
        } catch (error) {
            toast.error('Failed to load book');
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    }, [bookId, navigate]);

    useEffect(() => { fetchBook(); }, [fetchBook]);

    // Track unsaved changes
    useEffect(() => {
        if (book && originalBookRef.current) {
            const changed = JSON.stringify(book) !== originalBookRef.current;
            setHasUnsavedChanges(changed);
        }
    }, [book]);

    // Warn on page leave with unsaved changes
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges]);

    const saveBook = async () => {
        if (!book) return;
        setSaving(true);
        try {
            await axiosInstance.put(`${API_PATHS.BOOKS.UPDATE_BOOK}/${bookId}`, {
                title: book.title,
                subtitle: book.subtitle,
                author: book.author,
                chapters: book.chapters,
                status: book.status,
            });
            originalBookRef.current = JSON.stringify(book);
            setHasUnsavedChanges(false);
            toast.success('All changes saved!');
        } catch (error) {
            toast.error('Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const updateChapterContent = (content) => {
        if (!book) return;
        const updated = { ...book };
        updated.chapters = [...updated.chapters];
        updated.chapters[activeChapter] = { ...updated.chapters[activeChapter], content: content || '' };
        setBook(updated);
    };

    const updateChapterTitle = (title) => {
        if (!book) return;
        const updated = { ...book };
        updated.chapters = [...updated.chapters];
        updated.chapters[activeChapter] = { ...updated.chapters[activeChapter], title };
        setBook(updated);
    };

    const updateChapterDescription = (description) => {
        if (!book) return;
        const updated = { ...book };
        updated.chapters = [...updated.chapters];
        updated.chapters[activeChapter] = { ...updated.chapters[activeChapter], description };
        setBook(updated);
    };

    const addChapter = () => {
        if (!book) return;
        const newChapter = { title: `Chapter ${book.chapters.length + 1}`, description: '', content: '' };
        const updated = { ...book, chapters: [...book.chapters, newChapter] };
        setBook(updated);
        setActiveChapter(updated.chapters.length - 1);
    };

    const deleteChapter = (index) => {
        if (!book || book.chapters.length <= 1) {
            toast.error('Book must have at least one chapter');
            return;
        }
        setDeleteChapterIndex(index);
    };

    const confirmDeleteChapter = () => {
        if (deleteChapterIndex === null || !book) return;
        const filtered = book.chapters.filter((_, i) => i !== deleteChapterIndex);
        // Renumber chapter titles that match "Chapter N" pattern
        const renumbered = filtered.map((ch, i) => {
            if (/^Chapter \d+/.test(ch.title)) {
                return { ...ch, title: ch.title.replace(/^Chapter \d+/, `Chapter ${i + 1}`) };
            }
            return ch;
        });
        const updated = { ...book, chapters: renumbered };
        setBook(updated);
        if (activeChapter >= renumbered.length) setActiveChapter(renumbered.length - 1);
        setDeleteChapterIndex(null);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id || !book) return;

        const oldIndex = parseInt(active.id.replace('chapter-', ''));
        const newIndex = parseInt(over.id.replace('chapter-', ''));

        const reordered = arrayMove(book.chapters, oldIndex, newIndex);

        // Renumber chapter titles that match "Chapter N" pattern
        const renumbered = reordered.map((ch, i) => {
            if (/^Chapter \d+/.test(ch.title)) {
                return { ...ch, title: ch.title.replace(/^Chapter \d+/, `Chapter ${i + 1}`) };
            }
            return ch;
        });

        setBook({ ...book, chapters: renumbered });

        // Adjust active chapter index
        if (activeChapter === oldIndex) {
            setActiveChapter(newIndex);
        } else if (activeChapter > oldIndex && activeChapter <= newIndex) {
            setActiveChapter(activeChapter - 1);
        } else if (activeChapter < oldIndex && activeChapter >= newIndex) {
            setActiveChapter(activeChapter + 1);
        }
    };

    const generateChapterContent = async () => {
        if (!book) return;
        const chapter = book.chapters[activeChapter];
        setGenerating(true);
        try {
            const previousChapters = book.chapters
                .slice(0, activeChapter)
                .map((ch, i) => `Chapter ${i + 1}: ${ch.title}\nDescription: ${ch.description || 'None'}`);

            const res = await axiosInstance.post(API_PATHS.AI.GENERATE_CHAPTER_CONTENT, {
                chapterTitle: chapter.title,
                chapterDescription: chapter.description,
                style: 'Professional',
                bookTitle: book.title,
                bookSubtitle: book.subtitle,
                previousChaptersContext: previousChapters.join('\n\n')
            });
            
            if(res.data.description) {
                updateChapterDescription(res.data.description);
            }
            if(res.data.content) {
                updateChapterContent(res.data.content);
            }
            toast.success('Chapter generated successfully!');
        } catch (error) {
            toast.error('Failed to generate chapter');
        } finally {
            setGenerating(false);
        }
    };

    const handleExport = async (format) => {
        setExportLoading(format);
        try {
            const url = `${API_PATHS.EXPORT[format === 'pdf' ? 'PDF' : 'DOC']}/${bookId}/${format}`;
            const res = await axiosInstance.get(url, { responseType: 'blob' });
            const blob = new Blob([res.data]);
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${book.title.replace(/[^a-zA-Z0-9]/g, '_')}.${format === 'pdf' ? 'pdf' : 'docx'}`;
            link.click();
            URL.revokeObjectURL(link.href);
            toast.success(`Exported as ${format.toUpperCase()}`);
        } catch (error) {
            toast.error(`Failed to export as ${format.toUpperCase()}`);
        } finally {
            setExportLoading('');
        }
    };

    const handleCoverUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setCoverUploading(true);

        const formData = new FormData();
        formData.append('coverImage', file);

        try {
            const res = await axiosInstance.put(
                `${API_PATHS.BOOKS.UPDATE_COVER}/${bookId}`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            setBook({ ...book, coverImage: res.data.updatedBook.coverImage });
            toast.success('Cover image updated!');
        } catch (error) {
            toast.error('Failed to upload cover image');
        } finally {
            setCoverUploading(false);
            if (coverInputRef.current) coverInputRef.current.value = '';
        }
    };

    const removeCoverImage = async () => {
        try {
            await axiosInstance.put(`${API_PATHS.BOOKS.UPDATE_BOOK}/${bookId}`, {
                ...book,
                coverImage: '',
            });
            setBook({ ...book, coverImage: '' });
            toast.success('Cover image removed');
        } catch (error) {
            toast.error('Failed to remove cover image');
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center py-32">
                    <Loader2 size={28} className="animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    if (!book) return null;

    const currentChapter = book.chapters[activeChapter];
    const coverUrl = book.coverImage ? `http://localhost:8000${book.coverImage}` : null;

    return (
        <DashboardLayout>
            <div className="animate-fade-in">
                {/* Top bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/dashboard')} className="p-2 rounded-lg hover:bg-surface-alt transition-colors text-text-muted cursor-pointer">
                            <ChevronLeft size={20} />
                        </button>
                        <div>
                            <input
                                value={book.title}
                                onChange={(e) => setBook({ ...book, title: e.target.value })}
                                className="text-lg font-bold text-text-primary bg-transparent outline-none border-b border-transparent hover:border-border focus:border-primary transition-colors w-full max-w-xs"
                            />
                        </div>
                        {hasUnsavedChanges && (
                            <span className="text-xs text-warning bg-warning/10 px-2 py-0.5 rounded-full font-medium animate-fade-in">
                                Unsaved changes
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Tab switcher */}
                        <div className="flex items-center bg-surface-alt rounded-xl p-0.5 border border-border/60">
                            <button
                                onClick={() => setActiveTab('editor')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                                    activeTab === 'editor'
                                        ? 'bg-white text-primary shadow-soft'
                                        : 'text-text-muted hover:text-text-primary'
                                }`}
                            >
                                Editor
                            </button>
                            <button
                                onClick={() => setActiveTab('details')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                                    activeTab === 'details'
                                        ? 'bg-white text-primary shadow-soft'
                                        : 'text-text-muted hover:text-text-primary'
                                }`}
                            >
                                Book Details
                            </button>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/view-book/${bookId}`)} icon={Eye}>Preview</Button>
                        <Button variant="secondary" size="sm" loading={exportLoading === 'pdf'} onClick={() => handleExport('pdf')} icon={FileDown}>PDF</Button>
                        <Button variant="secondary" size="sm" loading={exportLoading === 'doc'} onClick={() => handleExport('doc')} icon={FileText}>DOCX</Button>
                        <Button size="sm" loading={saving} onClick={saveBook} icon={Save}>
                            Save All Changes
                        </Button>
                    </div>
                </div>

                {activeTab === 'editor' ? (
                    /* ===== EDITOR TAB ===== */
                    <div className="flex gap-5 min-h-[calc(100vh-200px)]">
                        {/* Sidebar */}
                        {sidebarOpen && (
                            <div className="w-64 flex-shrink-0 bg-white rounded-2xl border border-border/60 shadow-soft overflow-hidden animate-fade-in hidden md:flex flex-col">
                                <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
                                    <h3 className="text-sm font-semibold text-text-primary">Chapters</h3>
                                    <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-md hover:bg-surface-alt text-text-muted cursor-pointer">
                                        <PanelLeftClose size={16} />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-1">
                                    <DndContext
                                        sensors={sensors}
                                        collisionDetection={closestCenter}
                                        onDragEnd={handleDragEnd}
                                    >
                                        <SortableContext
                                            items={book.chapters.map((_, i) => `chapter-${i}`)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            {book.chapters.map((ch, i) => (
                                                <SortableChapterItem
                                                    key={`chapter-${i}`}
                                                    chapter={ch}
                                                    index={i}
                                                    isActive={i === activeChapter}
                                                    onClick={() => setActiveChapter(i)}
                                                    onDelete={deleteChapter}
                                                    chaptersLength={book.chapters.length}
                                                />
                                            ))}
                                        </SortableContext>
                                    </DndContext>
                                </div>

                                <div className="p-2 border-t border-border/60">
                                    <Button variant="ghost" size="sm" fullWidth onClick={addChapter} icon={Plus}>Add Chapter</Button>
                                </div>
                            </div>
                        )}

                        {/* Main editor */}
                        <div className="flex-1 min-w-0">
                            {/* Chapter title + controls */}
                            <div className="flex items-center gap-3 mb-4">
                                {!sidebarOpen && (
                                    <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-surface-alt text-text-muted cursor-pointer hidden md:block">
                                        <PanelLeft size={18} />
                                    </button>
                                )}
                                <input
                                    value={currentChapter?.title || ''}
                                    onChange={(e) => updateChapterTitle(e.target.value)}
                                    placeholder="Chapter title"
                                    className="text-base font-semibold text-text-primary bg-transparent outline-none flex-1 border-b border-transparent hover:border-border focus:border-primary transition-colors"
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    loading={generating}
                                    onClick={generateChapterContent}
                                    icon={Sparkles}
                                >
                                    Generate
                                </Button>
                            </div>

                            {/* Chapter Description */}
                            <div className="mb-4">
                                <TextareaField
                                    id="chapter-description"
                                    placeholder="Brief description of what happens in this chapter..."
                                    value={currentChapter?.description || ''}
                                    onChange={(e) => updateChapterDescription(e.target.value)}
                                    rows={2}
                                />
                            </div>

                            {/* Markdown editor - no chapter heading injected */}
                            <div className="rounded-2xl overflow-hidden border border-border/60 shadow-soft" data-color-mode="light">
                                <MDEditor
                                    value={currentChapter?.content || ''}
                                    onChange={(val) => updateChapterContent(val)}
                                    height={500}
                                    preview="edit"
                                    hideToolbar={false}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    /* ===== BOOK DETAILS TAB ===== */
                    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
                        {/* Cover Image Section */}
                        <div className="bg-white rounded-2xl border border-border/60 shadow-soft p-6">
                            <h3 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
                                <ImageIcon size={18} className="text-primary" />
                                Cover Image
                            </h3>
                            <div className="flex items-start gap-6">
                                <div className="w-40 h-56 rounded-xl border-2 border-dashed border-border/60 overflow-hidden flex-shrink-0 bg-surface-alt flex items-center justify-center relative group">
                                    {coverUrl ? (
                                        <>
                                            <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button
                                                    onClick={removeCoverImage}
                                                    className="p-2 rounded-xl bg-white/90 text-error hover:bg-white transition-colors cursor-pointer"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center p-4">
                                            <Upload size={24} className="text-text-muted/40 mx-auto mb-2" />
                                            <p className="text-xs text-text-muted">No cover image</p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-text-secondary mb-3">
                                        Upload a cover image for your book. Recommended size: 800×1200px. Max 2MB (JPG, PNG, GIF).
                                    </p>
                                    <input
                                        ref={coverInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/gif"
                                        onChange={handleCoverUpload}
                                        className="hidden"
                                        id="cover-upload"
                                    />
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        loading={coverUploading}
                                        onClick={() => coverInputRef.current?.click()}
                                        icon={Upload}
                                    >
                                        {coverUrl ? 'Change Cover' : 'Upload Cover'}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Metadata Section */}
                        <div className="bg-white rounded-2xl border border-border/60 shadow-soft p-6">
                            <h3 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
                                <Settings size={18} className="text-primary" />
                                Book Metadata
                            </h3>
                            <div className="space-y-4">
                                <InputField
                                    id="details-title"
                                    label="Title"
                                    value={book.title}
                                    onChange={(e) => setBook({ ...book, title: e.target.value })}
                                    placeholder="Book title"
                                />
                                <InputField
                                    id="details-subtitle"
                                    label="Subtitle"
                                    value={book.subtitle || ''}
                                    onChange={(e) => setBook({ ...book, subtitle: e.target.value })}
                                    placeholder="Optional subtitle"
                                />
                                <InputField
                                    id="details-author"
                                    label="Author"
                                    value={book.author || ''}
                                    onChange={(e) => setBook({ ...book, author: e.target.value })}
                                    placeholder="Author name"
                                />
                                <SelectField
                                    id="details-status"
                                    label="Status"
                                    value={book.status || 'draft'}
                                    onChange={(e) => setBook({ ...book, status: e.target.value })}
                                    options={[
                                        { value: 'draft', label: 'Draft' },
                                        { value: 'published', label: 'Published' },
                                    ]}
                                />
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="bg-white rounded-2xl border border-border/60 shadow-soft p-6">
                            <h3 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
                                <BookOpen size={18} className="text-primary" />
                                Book Summary
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="p-3 rounded-xl bg-surface-alt text-center">
                                    <p className="text-2xl font-bold text-primary">{book.chapters?.length || 0}</p>
                                    <p className="text-xs text-text-muted mt-1">Chapters</p>
                                </div>
                                <div className="p-3 rounded-xl bg-surface-alt text-center">
                                    <p className="text-2xl font-bold text-primary">
                                        {book.chapters?.reduce((acc, ch) => acc + (ch.content?.split(/\s+/).filter(Boolean).length || 0), 0) || 0}
                                    </p>
                                    <p className="text-xs text-text-muted mt-1">Words</p>
                                </div>
                                <div className="p-3 rounded-xl bg-surface-alt text-center">
                                    <p className="text-2xl font-bold text-primary capitalize">{book.status || 'draft'}</p>
                                    <p className="text-xs text-text-muted mt-1">Status</p>
                                </div>
                                <div className="p-3 rounded-xl bg-surface-alt text-center">
                                    <p className="text-2xl font-bold text-primary">{coverUrl ? '✓' : '✗'}</p>
                                    <p className="text-xs text-text-muted mt-1">Cover</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete chapter confirmation */}
            <ConfirmModal
                isOpen={deleteChapterIndex !== null}
                onClose={() => setDeleteChapterIndex(null)}
                onConfirm={confirmDeleteChapter}
                title="Delete Chapter?"
                message={`"${book.chapters[deleteChapterIndex]?.title}" will be permanently removed. Remaining chapters will be renumbered.`}
                confirmText="Delete Chapter"
            />
        </DashboardLayout>
    );
};

export default EditorPage;
