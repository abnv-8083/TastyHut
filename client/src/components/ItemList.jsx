import { Search, Copy, Plus } from 'lucide-react';

const ItemList = ({ items, searchQuery, onSearchChange, onCopy, onAdd }) => {
    const query = searchQuery.toLowerCase();
    const filteredItems = items.filter(i =>
        i.name.toLowerCase().includes(query) ||
        i.code.toLowerCase().includes(query) ||
        i.category.toLowerCase().includes(query)
    );

    const handleCopy = (code) => {
        navigator.clipboard.writeText(code);
        onCopy('Copied to clipboard!');
    };

    return (
        <div className="space-y-6">
            <div className="flex gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, code or category..."
                        className="w-full bg-gray-900 border border-gray-800 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none text-lg"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
                <button
                    onClick={onAdd}
                    className="aspect-square bg-blue-600 rounded-2xl flex items-center justify-center px-4 hover:bg-blue-500 transition-all active:scale-95 shadow-lg shadow-blue-900/40"
                >
                    <Plus className="w-6 h-6 text-white" />
                </button>
            </div>

            <div className="glass rounded-3xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-800/50 text-xs uppercase tracking-widest text-gray-500">
                        <tr>
                            <th className="px-4 py-4 font-semibold">Item</th>
                            <th className="px-4 py-4 font-semibold">Code</th>
                            <th className="px-4 py-4 font-semibold text-right">Price</th>
                            <th className="w-16"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/50">
                        {filteredItems.map(item => (
                            <tr key={item.id} className="hover:bg-gray-800/30 transition-colors">
                                <td className="px-4 py-5">
                                    <div className="font-medium text-sm">{item.name}</div>
                                    <div className="text-[10px] text-gray-500 uppercase">{item.category}</div>
                                </td>
                                <td className="px-4 py-5 font-mono text-xs text-blue-400">{item.code}</td>
                                <td className="px-4 py-5 text-right font-semibold text-sm">${item.price.toFixed(2)}</td>
                                <td className="px-4 py-5">
                                    <button
                                        onClick={() => handleCopy(item.code)}
                                        className="p-2 bg-gray-800 rounded-xl hover:bg-gray-700 text-gray-400 hover:text-white transition-all active:scale-90"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ItemList;
