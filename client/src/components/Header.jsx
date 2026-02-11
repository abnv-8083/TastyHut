import React from 'react';
import { Wifi } from 'lucide-react';

const Header = () => {
    return (
        <header className="sticky top-0 z-50 glass px-4 py-3 flex justify-between items-center bg-gray-900/80">
            <h1 className="text-xl font-bold text-blue-500">TastyHut</h1>
            <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <Wifi className="w-3 h-3" />
                Online
            </div>
        </header>
    );
};

export default Header;
