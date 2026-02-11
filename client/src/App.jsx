import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import TableGrid from './components/TableGrid';
import ItemList from './components/ItemList';
import OrderModal from './components/OrderModal';
import CreateModal from './components/CreateModal';

const API_BASE_URL = window.location.origin === 'http://localhost:5173'
  ? 'http://localhost:5000/api'
  : '/api';

function App() {
  const [activeTab, setActiveTab] = useState('tables'); // 'tables' or 'items'
  const [tables, setTables] = useState([]);
  const [items, setItems] = useState([]);
  const [searchQueries, setSearchQueries] = useState({
    tables: '',
    items: '',
    modalItems: ''
  });
  const [activeOrders, setActiveOrders] = useState({}); // { tableId: { items: { itemId: quantity }, total: 0 } }
  const [selectedTable, setSelectedTable] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createType, setCreateType] = useState('item'); // 'item' or 'table'
  const [toast, setToast] = useState({ show: false, message: '' });

  // Fetch initial data
  const fetchData = async () => {
    try {
      const [tablesRes, itemsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/tables`),
        axios.get(`${API_BASE_URL}/items`)
      ]);
      setTables(tablesRes.data);
      setItems(itemsRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 2000);
  };

  const handleOpenModal = (tableId) => {
    setSelectedTable(tables.find(t => t.id === tableId));
    setSearchQueries(prev => ({ ...prev, modalItems: '' }));
    setIsModalOpen(true);
  };

  const handleOpenCreateModal = (type) => {
    setCreateType(type);
    setIsCreateModalOpen(true);
  };

  const handleCreateRequest = async (data) => {
    try {
      const endpoint = createType === 'item' ? 'items' : 'tables';
      await axios.post(`${API_BASE_URL}/${endpoint}`, data);
      showToast(`${createType.charAt(0).toUpperCase() + createType.slice(1)} added successfully!`);
      setIsCreateModalOpen(false);
      fetchData(); // Refresh list
    } catch (err) {
      console.error('Error creating:', err);
      const msg = err.response?.data?.error || 'Error saving data';
      showToast(msg);
    }
  };

  const handleUpdateQty = (itemId, delta) => {
    const tableId = selectedTable.id;
    const item = items.find(i => i.id === itemId);

    setActiveOrders(prev => {
      const order = prev[tableId] || { items: {}, total: 0 };
      const currentQty = order.items[itemId] || 0;
      const newQty = Math.max(0, currentQty + delta);

      const newItems = { ...order.items };
      if (newQty === 0) {
        delete newItems[itemId];
      } else {
        newItems[itemId] = newQty;
      }

      // Calculate new total
      const newTotal = Object.entries(newItems).reduce((sum, [id, qty]) => {
        const itemObj = items.find(i => i.id === id);
        return sum + (itemObj.price * qty);
      }, 0);

      return {
        ...prev,
        [tableId]: { items: newItems, total: newTotal }
      };
    });
  };

  const handleClearOrder = async (tableId) => {
    if (window.confirm('Are you sure you want to clear this table?')) {
      try {
        await axios.delete(`${API_BASE_URL}/orders/${tableId}`);
        setActiveOrders(prev => {
          const newOrders = { ...prev };
          delete newOrders[tableId];
          return newOrders;
        });
        setIsModalOpen(false);
      } catch (err) {
        console.error('Error clearing order:', err);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-gray-100">
      <Header />

      <main className="flex-1 overflow-y-auto px-4 py-6 mb-20 scrollbar-hide">
        {activeTab === 'tables' ? (
          <TableGrid
            tables={tables}
            searchQuery={searchQueries.tables}
            onSearchChange={(val) => setSearchQueries(prev => ({ ...prev, tables: val }))}
            onTableClick={handleOpenModal}
            activeOrders={activeOrders}
            onAdd={() => handleOpenCreateModal('table')}
          />
        ) : (
          <ItemList
            items={items}
            searchQuery={searchQueries.items}
            onSearchChange={(val) => setSearchQueries(prev => ({ ...prev, items: val }))}
            onCopy={showToast}
            onAdd={() => handleOpenCreateModal('item')}
          />
        )}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {isModalOpen && (
        <OrderModal
          table={selectedTable}
          items={items}
          order={activeOrders[selectedTable.id] || { items: {}, total: 0 }}
          searchQuery={searchQueries.modalItems}
          onSearchChange={(val) => setSearchQueries(prev => ({ ...prev, modalItems: val }))}
          onUpdateQty={handleUpdateQty}
          onClear={() => handleClearOrder(selectedTable.id)}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {isCreateModalOpen && (
        <CreateModal
          type={createType}
          onSubmit={handleCreateRequest}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}

      {/* Toast */}
      <div className={`fixed top-20 left-1/2 -translate-x-1/2 glass px-4 py-2 rounded-full text-sm font-medium z-[100] transition-opacity duration-300 pointer-events-none ${toast.show ? 'opacity-100' : 'opacity-0'}`}>
        {toast.message}
      </div>
    </div>
  );
}

export default App;
