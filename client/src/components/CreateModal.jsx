import { X, Save, Plus, Edit } from 'lucide-react';

const CreateModal = ({ type, onSubmit, onClose, initialData }) => {
    const [formData, setFormData] = useState(
        initialData || (
            type === 'item'
                ? { name: '', code: '', price: '', category: '' }
                : { number: '' }
        )
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (type === 'item') {
            onSubmit({ ...formData, price: parseFloat(formData.price) });
        } else {
            onSubmit({ ...formData, number: parseInt(formData.number) });
        }
    };

    const isEdit = !!initialData;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative w-full max-w-md glass bg-gray-900 rounded-3xl p-6 shadow-2xl animate-slide-up border border-blue-500/20">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        {isEdit ? <Edit className="w-6 h-6 text-blue-400" /> : <Plus className="w-6 h-6 text-blue-500" />}
                        {isEdit ? 'Edit' : 'Add New'} {type === 'item' ? 'Item' : 'Table'}
                    </h2>
                    <button onClick={onClose} className="p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {type === 'item' ? (
                        <>
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1 ml-1">Item Name</label>
                                <input
                                    required
                                    name="name"
                                    type="text"
                                    placeholder="e.g. Cheese Burger"
                                    className="w-full bg-gray-800/40 border border-gray-700 rounded-xl py-3 px-4 focus:ring-1 focus:ring-blue-500 outline-none"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1 ml-1">Item Code</label>
                                    <input
                                        required
                                        name="code"
                                        type="text"
                                        placeholder="e.g. BK01"
                                        className="w-full bg-gray-800/40 border border-gray-700 rounded-xl py-3 px-4 focus:ring-1 focus:ring-blue-500 outline-none font-mono"
                                        value={formData.code}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1 ml-1">Price (₹)</label>
                                    <input
                                        required
                                        name="price"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        className="w-full bg-gray-800/40 border border-gray-700 rounded-xl py-3 px-4 focus:ring-1 focus:ring-blue-500 outline-none"
                                        value={formData.price}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1 ml-1">Category</label>
                                <input
                                    required
                                    name="category"
                                    type="text"
                                    placeholder="e.g. Main Course"
                                    className="w-full bg-gray-800/40 border border-gray-700 rounded-xl py-3 px-4 focus:ring-1 focus:ring-blue-500 outline-none"
                                    value={formData.category}
                                    onChange={handleChange}
                                />
                            </div>
                        </>
                    ) : (
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1 ml-1">Table Number</label>
                            <input
                                required
                                name="number"
                                type="number"
                                placeholder="e.g. 15"
                                className="w-full bg-gray-800/40 border border-gray-700 rounded-xl py-3 px-4 focus:ring-1 focus:ring-blue-500 outline-none text-2xl font-bold text-center"
                                value={formData.number}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 bg-gray-800 text-gray-400 rounded-2xl font-semibold hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
                        >
                            <Save className="w-5 h-5" />
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateModal;
