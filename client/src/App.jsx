import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import TableGrid from './components/TableGrid';
import ItemList from './components/ItemList';
import OrderModal from './components/OrderModal';
import CreateModal from './components/CreateModal';
import Notification from './components/Notification';
import ConfirmDialog from './components/ConfirmDialog';

const API_BASE_URL = '/api';

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
  const [selectedEditItem, setSelectedEditItem] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' });
  const [confirm, setConfirm] = useState({ show: false, title: '', message: '', onConfirm: () => { } });

  // Fetch initial data
  const fetchData = async () => {
    try {
      const [tablesRes, itemsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/tables`),
        axios.get(`${API_BASE_URL}/items`)
      ]);
      setTables(Array.isArray(tablesRes.data) ? tablesRes.data : []);
      setItems(Array.isArray(itemsRes.data) ? itemsRes.data : []);
    } catch (err) {
      console.error('Error fetching data:', err);
      showNotification('Connection error: Could not fetch data from server.', 'error');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showNotification = (msg, type = 'info') => {
    let safeMessage = 'An unexpected error occurred';

    if (typeof msg === 'string') {
      safeMessage = msg;
    } else if (msg?.response?.data?.error) {
      safeMessage = msg.response.data.error;
    } else if (msg?.message) {
      safeMessage = msg.message;
    } else if (msg) {
      safeMessage = JSON.stringify(msg);
    }

    setNotification({ show: true, message: String(safeMessage), type });
  };

  const handleOpenModal = (tableId) => {
    setSelectedTable(tables.find(t => t.id === tableId));
    setSearchQueries(prev => ({ ...prev, modalItems: '' }));
    setIsModalOpen(true);
  };

  const handleOpenCreateModal = (type, editingItem = null) => {
    setCreateType(type);
    setSelectedEditItem(editingItem);
    setIsCreateModalOpen(true);
  };

  const handleCreateRequest = async (data) => {
    try {
      const endpoint = createType === 'item' ? 'items' : 'tables';
      if (selectedEditItem) {
        await axios.put(`${API_BASE_URL}/items/${selectedEditItem.id}`, data);
        showNotification('Item updated successfully!', 'success');
      } else {
        await axios.post(`${API_BASE_URL}/${endpoint}`, data);
        showNotification(`${createType.charAt(0).toUpperCase() + createType.slice(1)} added successfully!`, 'success');
      }
      setIsCreateModalOpen(false);
      setSelectedEditItem(null);
      fetchData(); // Refresh list
    } catch (err) {
      console.error('Error saving:', err);
      showNotification(err, 'error');
    }
  };

  const handleDeleteItem = (id) => {
    const item = items.find(i => i.id === id);
    setConfirm({
      show: true,
      title: 'Delete Item?',
      message: `Are you sure you want to delete "${item?.name}"? This will remove it from the menu forever.`,
      onConfirm: async () => {
        try {
          await axios.delete(`${API_BASE_URL}/items/${id}`);
          showNotification('Item deleted successfully', 'success');
          fetchData();
        } catch (err) {
          showNotification(err, 'error');
        }
        setConfirm(prev => ({ ...prev, show: false }));
      }
    });
  };

  const handleDeleteTable = (id) => {
    const table = tables.find(t => t.id === id);
    setConfirm({
      show: true,
      title: 'Remove Table?',
      message: `Are you sure you want to remove Table ${table?.number}? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await axios.delete(`${API_BASE_URL}/tables/${id}`);
          showNotification('Table removed successfully', 'success');
          fetchData();
        } catch (err) {
          showNotification(err, 'error');
        }
        setConfirm(prev => ({ ...prev, show: false }));
      }
    });
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
    setConfirm({
      show: true,
      title: 'Complete Order?',
      message: 'This will clear the table status and archive the current order.',
      onConfirm: async () => {
        try {
          await axios.delete(`${API_BASE_URL}/orders/${tableId}`);
          setActiveOrders(prev => {
            const newOrders = { ...prev };
            delete newOrders[tableId];
            return newOrders;
          });
          setIsModalOpen(false);
          showNotification('Order completed and table cleared', 'success');
        } catch (err) {
          showNotification(err, 'error');
        }
        setConfirm(prev => ({ ...prev, show: false }));
      }
    });
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
            onDelete={handleDeleteTable}
          />
        ) : (
          <ItemList
            items={items}
            searchQuery={searchQueries.items}
            onSearchChange={(val) => setSearchQueries(prev => ({ ...prev, items: val }))}
            onCopy={(msg) => showNotification(msg, 'success')}
            onAdd={() => handleOpenCreateModal('item')}
            onEdit={(item) => handleOpenCreateModal('item', item)}
            onDelete={handleDeleteItem}
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
          initialData={selectedEditItem}
          onSubmit={handleCreateRequest}
          onClose={() => {
            setIsCreateModalOpen(false);
            setSelectedEditItem(null);
          }}
        />
      )}

      {/* Notifications & Dialogs */}
      <Notification
        {...notification}
        onClose={() => setNotification(prev => ({ ...prev, show: false }))}
      />

      <ConfirmDialog
        {...confirm}
        onCancel={() => setConfirm(prev => ({ ...prev, show: false }))}
      />
    </div>
  );
}

export default App;
