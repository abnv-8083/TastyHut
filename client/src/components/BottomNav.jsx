import React from 'react';
import { LayoutGrid, Search } from 'lucide-react';

const BottomNav = ({ activeTab, onTabChange }) => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 glass safe-area-bottom border-t border-gray-800 bg-gray-900/90 z-50">
            <div className="flex justify-around items-center h-16">
                <button
                    onClick={() => onTabChange('tables')}
                    className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'tables' ? 'text-blue-500' : 'text-gray-500'}`}
                >
                    <LayoutGrid className="w-6 h-6" />
                    <span className="text-[10px] font-medium uppercase tracking-wider">Tables</span>
                </button>
                <button
                    onClick={() => onTabChange('items')}
                    className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'items' ? 'text-blue-500' : 'text-gray-500'}`}
                >
                    <Search className="w-6 h-6" />
                    <span className="text-[10px] font-medium uppercase tracking-wider">Items</span>
                </button>
            </div>
        </nav>
    );
};

export default BottomNav;
