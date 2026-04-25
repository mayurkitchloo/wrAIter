import React, { useState } from 'react';
import Modal from '../ui/Modal';
import InputField from '../ui/InputField';
import TextareaField from '../ui/TextareaField';
import SelectField from '../ui/SelectField';
import Button from '../ui/Button';
import ConfirmModal from '../ui/ConfirmModal';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { Plus, Sparkles, ChevronLeft, ChevronRight, Trash2, BookOpen, FileText, ArrowRight } from 'lucide-react';

const STYLES = ['Professional', 'Creative', 'Academic', 'Conversational', 'Narrative', 'Technical'];

const CreateBookModal = ({ isOpen, onClose, onBookCreated }) => {
    const { user } = useAuth();

    // Step 1: Details, Step 2: Review Chapters
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        author: user?.name || '',
        style: 'Professional',
        numChapters: '5',
        description: '',
    });
    const [chapters, setChapters] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [generatingOutline, setGeneratingOutline] = useState(false);
    const [useAI, setUseAI] = useState(true);
    const [deleteChapterIndex, setDeleteChapterIndex] = useState(null);

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.author.trim()) newErrors.author = 'Author is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = async () => {
        if (!validate()) return;

        if (useAI && formData.title) {
            setGeneratingOutline(true);
            try {
                const outlineRes = await axiosInstance.post(API_PATHS.AI.GENERATE_OUTLINE, {
                    topic: formData.title,
                    description: formData.description,
                    style: formData.style,
                    numChapters: parseInt(formData.numChapters) || 5,
                });
                const generatedChapters = outlineRes.data.outline.map((ch) => ({
                    title: ch.title,
                    description: ch.description,
                    content: '',
                }));
                setChapters(generatedChapters);
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to generate outline');
                setGeneratingOutline(false);
                return;
            } finally {
                setGeneratingOutline(false);
            }
        } else {
            // Create default chapters if not using AI
            if (chapters.length === 0) {
                const defaultChapters = Array.from({ length: parseInt(formData.numChapters) || 3 }, (_, i) => ({
                    title: `Chapter ${i + 1}`,
                    description: '',
                    content: '',
                }));
                setChapters(defaultChapters);
            }
        }
        setStep(2);
    };

    const handleCreateBook = async () => {
        setLoading(true);
        try {
            const bookRes = await axiosInstance.post(API_PATHS.BOOKS.CREATE_BOOK, {
                title: formData.title,
                subtitle: formData.subtitle,
                author: formData.author,
                chapters,
            });
            toast.success('Book created!');
            onBookCreated?.(bookRes.data.book);
            handleClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create book');
        } finally {
            setLoading(false);
        }
    };

    const addChapter = () => {
        setChapters([...chapters, {
            title: `Chapter ${chapters.length + 1}`,
            description: '',
            content: '',
        }]);
    };

    const removeChapter = (index) => {
        if (chapters.length <= 1) {
            toast.error('Book must have at least one chapter');
            return;
        }
        const updated = chapters.filter((_, i) => i !== index);
        // Renumber chapter titles
        const renumbered = updated.map((ch, i) => {
            const match = ch.title.match(/^Chapter \d+/);
            if (match) {
                return { ...ch, title: ch.title.replace(/^Chapter \d+/, `Chapter ${i + 1}`) };
            }
            return ch;
        });
        setChapters(renumbered);
        setDeleteChapterIndex(null);
    };

    const updateChapterField = (index, field, value) => {
        const updated = [...chapters];
        updated[index] = { ...updated[index], [field]: value };
        setChapters(updated);
    };

    const handleClose = () => {
        setFormData({ title: '', subtitle: '', author: user?.name || '', style: 'Professional', numChapters: '5', description: '' });
        setChapters([]);
        setErrors({});
        setStep(1);
        onClose();
    };

    const updateField = (field, value) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field]) setErrors({ ...errors, [field]: '' });
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={handleClose} title={step === 1 ? 'Create New Book' : 'Review Chapters'} size={step === 1 ? 'md' : 'lg'}>
                {step === 1 ? (
                    /* ===== STEP 1: Book Details ===== */
                    <div className="space-y-4">
                        <InputField id="book-title" label="Book Title" placeholder="Enter your book title" value={formData.title} onChange={(e) => updateField('title', e.target.value)} error={errors.title} required />
                        <InputField id="book-subtitle" label="Subtitle" placeholder="Optional subtitle" value={formData.subtitle} onChange={(e) => updateField('subtitle', e.target.value)} />
                        <InputField id="book-author" label="Author" placeholder="Author name" value={formData.author} onChange={(e) => updateField('author', e.target.value)} error={errors.author} required />

                        {/* AI toggle */}
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-alt border border-border/60">
                            <button type="button" onClick={() => setUseAI(!useAI)} className={`relative w-10 h-5.5 rounded-full transition-colors cursor-pointer ${useAI ? 'bg-primary' : 'bg-border'}`}>
                                <div className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-transform ${useAI ? 'translate-x-5' : 'translate-x-0.5'}`} />
                            </button>
                            <div className="flex items-center gap-1.5">
                                <Sparkles size={14} className="text-primary" />
                                <span className="text-sm font-medium text-text-primary">Generate outline with AI</span>
                            </div>
                        </div>

                        {useAI && (
                            <>
                                <TextareaField id="book-desc" label="Description (for AI)" placeholder="Describe what your book is about..." value={formData.description} onChange={(e) => updateField('description', e.target.value)} rows={3} />
                                <div className="grid grid-cols-2 gap-3">
                                    <SelectField id="book-style" label="Writing Style" value={formData.style} onChange={(e) => updateField('style', e.target.value)} options={STYLES} />
                                    <SelectField id="book-chapters" label="Chapters" value={formData.numChapters} onChange={(e) => updateField('numChapters', e.target.value)} options={['3','4','5','6','7','8','9','10']} />
                                </div>
                            </>
                        )}

                        <div className="flex justify-end gap-3 pt-2">
                            <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                            <Button loading={generatingOutline} onClick={handleNext} icon={ChevronRight} iconPosition="right">
                                {useAI ? 'Generate & Review' : 'Next'}
                            </Button>
                        </div>
                    </div>
                ) : (
                    /* ===== STEP 2: Review Chapters ===== */
                    <div className="space-y-4">
                        {/* Book summary */}
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10">
                            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center flex-shrink-0">
                                <BookOpen size={20} className="text-white" />
                            </div>
                            <div className="min-w-0">
                                <h4 className="text-sm font-semibold text-text-primary truncate">{formData.title}</h4>
                                <p className="text-xs text-text-muted">by {formData.author} · {chapters.length} chapter{chapters.length !== 1 ? 's' : ''}</p>
                            </div>
                        </div>

                        {/* Chapter list */}
                        <div className="space-y-2 max-h-[340px] overflow-y-auto scrollbar-thin pr-1">
                            {chapters.map((ch, index) => (
                                <div
                                    key={index}
                                    className="group flex items-start gap-3 p-3.5 rounded-xl border border-border/60 bg-white hover:border-primary/20 hover:shadow-soft transition-all"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs font-bold text-primary">{index + 1}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <input
                                            value={ch.title}
                                            onChange={(e) => updateChapterField(index, 'title', e.target.value)}
                                            className="text-sm font-medium text-text-primary bg-transparent outline-none w-full border-b border-transparent hover:border-border focus:border-primary transition-colors"
                                        />
                                        <input
                                            value={ch.description}
                                            onChange={(e) => updateChapterField(index, 'description', e.target.value)}
                                            placeholder="Add a short description..."
                                            className="text-xs text-text-muted bg-transparent outline-none w-full mt-1 border-b border-transparent hover:border-border/50 focus:border-primary/50 transition-colors"
                                        />
                                    </div>
                                    {chapters.length > 1 && (
                                        <button
                                            onClick={() => setDeleteChapterIndex(index)}
                                            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-text-muted hover:text-error hover:bg-error/5 transition-all cursor-pointer flex-shrink-0"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Add chapter button */}
                        <button
                            onClick={addChapter}
                            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-border/60 text-text-muted hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all cursor-pointer"
                        >
                            <Plus size={16} />
                            <span className="text-sm font-medium">Add Chapter</span>
                        </button>

                        {/* Actions */}
                        <div className="flex justify-between gap-3 pt-2">
                            <Button variant="ghost" onClick={() => setStep(1)} icon={ChevronLeft}>
                                Back
                            </Button>
                            <Button loading={loading} onClick={handleCreateBook} icon={ArrowRight} iconPosition="right">
                                Create eBook
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Delete chapter confirmation */}
            <ConfirmModal
                isOpen={deleteChapterIndex !== null}
                onClose={() => setDeleteChapterIndex(null)}
                onConfirm={() => removeChapter(deleteChapterIndex)}
                title="Delete Chapter?"
                message={`"${chapters[deleteChapterIndex]?.title}" will be permanently removed. Remaining chapters will be renumbered.`}
                confirmText="Delete Chapter"
            />
        </>
    );
};

export default CreateBookModal;
