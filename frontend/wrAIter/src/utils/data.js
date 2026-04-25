import { Lightbulb, BookOpen, Download, Library } from "lucide-react";

export const FEATURES = [
    {
        title: "AI-Powered Writing",
        description:
            "Overcome writer's block with our smart assistant that helps you generate ideas, outlines, and content.",
        icon: Lightbulb,
        gradient: "from-violet-500 to-purple-600",
    },
    {
        title: "Immersive Reader",
        description:
            "Preview your ebook in a clean, read-only format. Adjust font sizes for a comfortable reading experience.",
        icon: BookOpen,
        gradient: "from-blue-500 to-cyan-600",
    },
    {
        title: "One-Click Export",
        description:
            "Export your ebook to PDF, and DOCX formats instantly, ready for publishing.",
        icon: Download,
        gradient: "from-emerald-500 to-teal-600",
    },
    {
        title: "eBook Management",
        description:
            "Organize all your ebook projects in a personal dashboard. Easily track progress, edit drafts, and manage your library.",
        icon: Library,
        gradient: "from-pink-500 to-rose-600",
    },
];

export const TESTIMONIALS = [
    {
        quote: 'This platform made it so easy to write and publish my first ebook. The AI assistant is a game-changer.',
        author: 'Jane Doe',
        title: 'Bestselling Author',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        rating: 5,
    },
    {
        quote: 'I love the customizable templates. I was able to create a beautiful ebook that matches my brand perfectly.',
        author: 'John Smith',
        title: 'Marketing Expert',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
        rating: 5,
    },
    {
        quote: 'The one-click export feature saved me so much time. I was able to publish my ebook on multiple platforms.',
        author: 'Peter Jones',
        title: 'Indie Publisher',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
        rating: 5,
    },
];

export const WRITING_STYLES = [
    { value: 'Professional', label: 'Professional' },
    { value: 'Creative', label: 'Creative' },
    { value: 'Academic', label: 'Academic' },
    { value: 'Conversational', label: 'Conversational' },
    { value: 'Narrative', label: 'Narrative' },
    { value: 'Technical', label: 'Technical' },
];

export const CHAPTER_COUNTS = [
    { value: '3', label: '3 Chapters' },
    { value: '4', label: '4 Chapters' },
    { value: '5', label: '5 Chapters' },
    { value: '6', label: '6 Chapters' },
    { value: '7', label: '7 Chapters' },
    { value: '8', label: '8 Chapters' },
    { value: '9', label: '9 Chapters' },
    { value: '10', label: '10 Chapters' },
];