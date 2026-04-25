import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import ViewChapterSidebar from '../components/view/ViewChapterSidebar';
import ViewBook from '../components/view/ViewBook';
import Button from '../components/ui/Button';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import toast from 'react-hot-toast';
import { Loader2, ChevronLeft, Pencil, Minus, Plus } from 'lucide-react';

const ViewBookPage = () => {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeChapter, setActiveChapter] = useState(0);
    const [fontSize, setFontSize] = useState(16);

    const fetchBook = useCallback(async () => {
        try {
            const res = await axiosInstance.get(`${API_PATHS.BOOKS.GET_BOOK_BY_ID}/${bookId}`);
            setBook(res.data.book);
        } catch (error) {
            toast.error('Failed to load book');
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    }, [bookId, navigate]);

    useEffect(() => { fetchBook(); }, [fetchBook]);

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

    return (
        <DashboardLayout>
            <div className="animate-fade-in">
                {/* Top bar */}
                <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/dashboard')} className="p-2 rounded-lg hover:bg-surface-alt transition-colors text-text-muted cursor-pointer">
                            <ChevronLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-lg font-bold text-text-primary">{book.title}</h1>
                            {book.subtitle && <p className="text-xs text-text-muted">{book.subtitle}</p>}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Font size controls */}
                        <div className="flex items-center gap-1 bg-surface-alt rounded-lg px-2 py-1 border border-border/60">
                            <button onClick={() => setFontSize(Math.max(12, fontSize - 2))} className="p-1 text-text-muted hover:text-text-primary cursor-pointer">
                                <Minus size={14} />
                            </button>
                            <span className="text-xs text-text-secondary min-w-[32px] text-center">{fontSize}px</span>
                            <button onClick={() => setFontSize(Math.min(24, fontSize + 2))} className="p-1 text-text-muted hover:text-text-primary cursor-pointer">
                                <Plus size={14} />
                            </button>
                        </div>
                        <Button variant="secondary" size="sm" onClick={() => navigate(`/editor/${bookId}`)} icon={Pencil}>Edit</Button>
                    </div>
                </div>

                {/* Layout */}
                <div className="flex gap-5 min-h-[calc(100vh-200px)]">
                    <ViewChapterSidebar chapters={book.chapters} activeIndex={activeChapter} onSelect={setActiveChapter} />
                    <div className="flex-1 min-w-0">
                        <ViewBook chapter={book.chapters[activeChapter]} fontSize={fontSize} />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ViewBookPage;
