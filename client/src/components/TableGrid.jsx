import { Search, Plus, Trash2 } from 'lucide-react';

const TableGrid = ({ tables, searchQuery, onSearchChange, onTableClick, activeOrders, onAdd, onDelete }) => {
    const filteredTables = tables.filter(t =>
        t.number.toString().includes(searchQuery)
    );

    return (
        <div className="space-y-6">
            <div className="flex gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search table number..."
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

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {filteredTables.map(table => {
                    const order = activeOrders[table.id];
                    return (
                        <div
                            key={table.id}
                            onClick={() => onTableClick(table.id)}
                            className={`group relative p-6 rounded-3xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all active:scale-95 glass border
                            ${order
                                    ? 'bg-gradient-to-br from-blue-600/30 via-indigo-600/20 to-purple-600/30 border-blue-400/50 shadow-xl shadow-blue-500/20 scale-[1.02]'
                                    : 'bg-gray-900/40 hover:bg-gray-800/40 border-transparent hover:border-gray-700'}`}
                        >
                            {!order && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(table.id);
                                    }}
                                    className="absolute top-3 right-3 p-2 bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white rounded-full transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                            <span className={`text-4xl font-extrabold transition-colors ${order ? 'text-white' : 'text-gray-300'}`}>
                                {table.number}
                            </span>
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${order ? 'text-blue-300 animate-pulse' : 'text-gray-500'}`}>
                                {order ? 'Active Order' : 'Idle'}
                            </span>
                            {order && (
                                <div className="px-4 py-1.5 bg-blue-500/30 rounded-full text-blue-200 text-sm font-bold mt-2 backdrop-blur-sm border border-blue-400/30 shadow-inner">
                                    ₹{order.total.toFixed(2)}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TableGrid;
