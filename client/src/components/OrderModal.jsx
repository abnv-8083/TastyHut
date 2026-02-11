import React, { useState } from 'react';
import { X, Search, Trash2, Minus, Plus, ShoppingBag, List } from 'lucide-react';

const OrderModal = ({ table, items, order, searchQuery, onSearchChange, onUpdateQty, onClear, onClose }) => {
    const [activeTab, setActiveTab] = useState(order.total > 0 ? 'bill' : 'menu');
    const query = searchQuery.toLowerCase();

    const orderedItemIds = Object.keys(order.items);

    const displayItems = activeTab === 'bill'
        ? items.filter(item => orderedItemIds.includes(item.id))
        : items.filter(item =>
            item.name.toLowerCase().includes(query) ||
            item.code.toLowerCase().includes(query)
        );

    return (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center sm:justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative w-full sm:max-w-lg glass bg-gray-900 rounded-t-3xl sm:rounded-3xl p-6 animate-slide-up shadow-2xl">
                <div className="w-12 h-1.5 bg-gray-800 rounded-full mx-auto mb-6 sm:hidden"></div>

                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-bold">Table {table?.number}</h2>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Order Entry</div>
                    </div>
                    <button onClick={onClose} className="p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex p-1 bg-gray-800/50 rounded-2xl mb-6">
                    <button
                        onClick={() => setActiveTab('bill')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'bill' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        <ShoppingBag className="w-4 h-4" />
                        Bill ({orderedItemIds.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('menu')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'menu' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        <List className="w-4 h-4" />
                        Menu
                    </button>
                </div>

                {activeTab === 'menu' && (
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Find item to add..."
                            className="w-full bg-gray-800/40 border border-gray-700 rounded-xl py-2 pl-10 pr-4 focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>
                )}

                <div className="max-h-[45vh] overflow-y-auto space-y-3 mb-6 pr-1 custom-scrollbar">
                    {displayItems.length === 0 ? (
                        <div className="text-center py-10">
                            <div className="text-gray-600 mb-2">{activeTab === 'bill' ? 'No items in bill yet' : 'No items found'}</div>
                            {activeTab === 'bill' && (
                                <button
                                    onClick={() => setActiveTab('menu')}
                                    className="text-blue-500 text-sm font-bold hover:underline"
                                >
                                    Open Menu to Add Items
                                </button>
                            )}
                        </div>
                    ) : (
                        displayItems.map(item => {
                            const qty = order.items[item.id] || 0;
                            return (
                                <div key={item.id} className={`flex items-center justify-between p-3 bg-gray-800/20 rounded-2xl border transition-colors ${qty > 0 ? 'border-blue-500/30 bg-blue-500/5' : 'border-gray-800/50'}`}>
                                    <div className="flex-1">
                                        <div className="font-medium text-sm">{item.name}</div>
                                        <div className="text-[10px] text-gray-500">₹{item.price.toFixed(2)} | {item.code}</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {activeTab === 'bill' && (
                                            <button
                                                onClick={() => onUpdateQty(item.id, -qty)}
                                                className="p-2 text-red-500/50 hover:text-red-500 transition-colors mr-1"
                                                title="Remove from bill"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                        <div className="flex items-center gap-3 bg-gray-950/50 rounded-lg p-1 border border-gray-800">
                                            <button
                                                onClick={() => onUpdateQty(item.id, -1)}
                                                className="w-7 h-7 flex items-center justify-center bg-gray-800 rounded-md text-gray-400 hover:bg-gray-700 active:scale-90"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className={`w-5 text-center font-bold text-sm ${qty > 0 ? 'text-blue-400' : 'text-gray-500'}`}>{qty}</span>
                                            <button
                                                onClick={() => onUpdateQty(item.id, 1)}
                                                className="w-7 h-7 flex items-center justify-center bg-blue-600 rounded-md text-white font-bold hover:bg-blue-500 active:scale-90"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="pt-6 border-t border-gray-800 flex justify-between items-center">
                    <div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest">Bill Total</div>
                        <div className="text-2xl font-bold text-blue-500">₹{order.total.toFixed(2)}</div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={onClear}
                            className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-colors"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20 active:scale-95"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderModal;
