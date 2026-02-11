require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

// --- Routes ---

// 1. Get all items
app.get('/api/items', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('items')
            .select('*')
            .order('name');

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Get all tables
app.get('/api/tables', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('tables')
            .select('*')
            .order('number');

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Save an order
app.post('/api/orders', async (req, res) => {
    const { table_id, items, total_amount } = req.body;

    try {
        // 1. Create the order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert([{ table_id, total_amount, status: 'pending' }])
            .select()
            .single();

        if (orderError) throw orderError;

        // 2. Insert order items
        const orderItems = items.map(item => ({
            order_id: order.id,
            item_id: item.id,
            quantity: item.quantity,
            price_at_time: item.price
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);

        if (itemsError) throw itemsError;

        // 3. Update table status
        await supabase
            .from('tables')
            .update({ status: 'active' })
            .eq('id', table_id);

        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Clear/Complete an order
app.delete('/api/orders/:tableId', async (req, res) => {
    const { tableId } = req.params;

    try {
        const { error } = await supabase
            .from('tables')
            .update({ status: 'idle' })
            .eq('id', tableId);

        if (error) throw error;
        res.json({ message: 'Table cleared' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. Add a new item
app.post('/api/items', async (req, res) => {
    const { name, code, price, category } = req.body;
    try {
        const { data, error } = await supabase
            .from('items')
            .insert([{ name, code, price, category }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 6. Update an item
app.put('/api/items/:id', async (req, res) => {
    const { id } = req.params;
    const { name, code, price, category } = req.body;
    try {
        const { data, error } = await supabase
            .from('items')
            .update({ name, code, price, category })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 7. Delete an item
app.delete('/api/items/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await supabase
            .from('items')
            .delete()
            .eq('id', id);

        if (error) throw error;
        res.json({ message: 'Item deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 8. Add a new table
app.post('/api/tables', async (req, res) => {
    const { number } = req.body;
    try {
        const { data, error } = await supabase
            .from('tables')
            .insert([{ number, status: 'idle' }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 9. Delete a table
app.delete('/api/tables/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await supabase
            .from('tables')
            .delete()
            .eq('id', id);

        if (error) throw error;
        res.json({ message: 'Table deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
