import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import BookCard from '../components/cards/BookCard';
import CreateBookModal from '../components/modals/CreateBookModal';
import ConfirmModal from '../components/ui/ConfirmModal';
import Button from '../components/ui/Button';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import { Plus, BookOpen, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const DashboardPage = () => {
    const { user } = useAuth();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [deleteBookId, setDeleteBookId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchBooks = async () => {
        try {
            const res = await axiosInstance.get(API_PATHS.BOOKS.GET_BOOKS);
            setBooks(res.data.books || []);
        } catch (error) {
            toast.error('Failed to load books');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBooks(); }, []);

    const handleDeleteRequest = (bookId) => {
        setDeleteBookId(bookId);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteBookId) return;
        setDeleting(true);
        try {
            await axiosInstance.delete(`${API_PATHS.BOOKS.DELETE_BOOK}/${deleteBookId}`);
            setBooks(books.filter((b) => b._id !== deleteBookId));
            toast.success('Book deleted');
        } catch (error) {
            toast.error('Failed to delete book');
        } finally {
            setDeleting(false);
            setDeleteBookId(null);
        }
    };

    const handleBookCreated = (newBook) => {
        setBooks([newBook, ...books]);
    };

    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const bookToDelete = books.find((b) => b._id === deleteBookId);

    return (
        <DashboardLayout>
            <div className="animate-fade-in-up">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary">
                            {greeting()}, {user?.name?.split(' ')[0] || 'Writer'} ✍️
                        </h1>
                        <p className="text-sm text-text-secondary mt-1">
                            {books.length > 0
                                ? `You have ${books.length} book${books.length !== 1 ? 's' : ''} in your library`
                                : 'Create your first book to get started'}
                        </p>
                    </div>
                    <Button onClick={() => setShowCreateModal(true)} icon={Plus}>
                        New Book
                    </Button>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 size={28} className="animate-spin text-primary" />
                    </div>
                ) : books.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-20 h-20 rounded-2xl bg-primary/5 flex items-center justify-center mb-6">
                            <BookOpen size={36} className="text-primary/40" />
                        </div>
                        <h3 className="text-lg font-semibold text-text-primary mb-2">No books yet</h3>
                        <p className="text-sm text-text-secondary mb-6 max-w-sm">
                            Start your writing journey by creating your first AI-powered book.
                        </p>
                        <Button onClick={() => setShowCreateModal(true)} icon={Plus}>
                            Create your first book
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {books.map((book) => (
                            <BookCard key={book._id} book={book} onDelete={handleDeleteRequest} />
                        ))}
                    </div>
                )}
            </div>

            <CreateBookModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onBookCreated={handleBookCreated} />

            {/* Delete confirmation modal */}
            <ConfirmModal
                isOpen={!!deleteBookId}
                onClose={() => setDeleteBookId(null)}
                onConfirm={handleDeleteConfirm}
                title="Delete Book?"
                message={`"${bookToDelete?.title || 'this book'}" and all its chapters will be permanently deleted. This cannot be undone.`}
                confirmText="Delete Book"
                loading={deleting}
            />
        </DashboardLayout>
    );
};

export default DashboardPage;
