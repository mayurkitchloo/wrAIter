import React from 'react';
import MDEditor from '@uiw/react-md-editor';

const ViewBook = ({ chapter, fontSize = 16 }) => {
    if (!chapter) {
        return (
            <div className="flex items-center justify-center py-24 text-text-muted">
                Select a chapter to read
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-border/60 shadow-soft p-8 sm:p-12 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-text-primary mb-6 pb-4 border-b border-border/60">
                {chapter.title}
            </h2>
            <div style={{ fontSize: `${fontSize}px` }} data-color-mode="light">
                <MDEditor.Markdown
                    source={chapter.content || '*No content yet.*'}
                    style={{ background: 'transparent', fontSize: 'inherit', lineHeight: 1.8, color: '#333' }}
                />
            </div>
        </div>
    );
};

export default ViewBook;
