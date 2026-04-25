import React from 'react';
import Navbar from './Navbar';

const DashboardLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-[#fcfbfc]">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
