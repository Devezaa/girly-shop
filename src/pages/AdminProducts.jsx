import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, Save, X, MoreHorizontal, Package, TrendingUp, AlertCircle, Tag, DollarSign } from "lucide-react";
import AdminProductForm from "../components/AdminProductForm";

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // 🏷️ Inline Edit State
    const [inlineEditId, setInlineEditId] = useState(null);
    const [inlinePrice, setInlinePrice] = useState("");

    // 🔄 Fetch Products
    const fetchProducts = () => {
        fetch('http://localhost:5001/api/products')
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error("Error fetching products:", err));
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // ➕ Handle Create/Update via Modal
    const handleSave = (formData) => {
        const method = editingProduct ? "PUT" : "POST";
        const url = editingProduct
            ? `http://localhost:5001/api/products/${editingProduct.id}`
            : 'http://localhost:5001/api/products';

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    fetchProducts();
                    setIsFormOpen(false);
                    setEditingProduct(null);
                } else {
                    alert(data.message);
                }
            });
    };

    // 🗑️ Handle Delete
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            await fetch(`http://localhost:5001/api/products/${id}`, { method: "DELETE" })
                .then(res => res.json())
                .then(data => {
                    if (data.success) fetchProducts();
                });
        }
    };

    // ⚡ Inline Price Editing Handlers
    const startInlineEdit = (product) => {
        setInlineEditId(product.id);
        setInlinePrice(product.price);
    };

    const saveInlineEdit = (id) => {
        if (parseFloat(inlinePrice) < 0) {
            alert("Price cannot be negative!");
            return;
        }

        fetch(`http://localhost:5001/api/products/${id}`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ price: inlinePrice })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    fetchProducts();
                    setInlineEditId(null);
                }
            });
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // 📊 Stats Calculation
    const totalProducts = products.length;
    const lowStock = products.filter(p => (p.stock || 0) < 5).length;
    const outOfStock = products.filter(p => (p.stock || 0) === 0).length;

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20 font-sans">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            Product Manager
                        </h1>
                        <p className="text-xs text-gray-500 mt-1">Manage inventory, prices, and stock levels.</p>
                    </div>

                    <button
                        onClick={() => { setEditingProduct(null); setIsFormOpen(true); }}
                        className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all text-sm"
                    >
                        <Plus size={16} /> Add Product
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* 📊 Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Products</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalProducts}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                            <Package size={24} />
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Low Stock</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{lowStock}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
                            <AlertCircle size={24} />
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Out of Stock</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{outOfStock}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
                            <X size={24} />
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="mb-6 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, brand..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full md:max-w-md bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm text-sm"
                    />
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <th className="p-4 pl-6">Product</th>
                                    <th className="p-4">Category</th>
                                    <th className="p-4">Stock</th>
                                    <th className="p-4">Price</th>
                                    <th className="p-4 text-right pr-6">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredProducts.map(product => {
                                    const stock = product.stock || 0;
                                    const isLowStock = stock > 0 && stock < 5;
                                    const isOutOfStock = stock === 0;

                                    return (
                                        <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="p-4 pl-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-lg bg-gray-50 p-1 border border-gray-100 shrink-0">
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="w-full h-full object-contain mix-blend-multiply"
                                                            onError={(e) => { e.target.src = "/products/anua-bottle.jpg"; }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-sm text-gray-900">{product.name}</div>
                                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                                            {product.brand && <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">{product.brand}</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                                    {product.category || 'Uncategorized'}
                                                </span>
                                            </td>

                                            {/* Stock Status */}
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${isOutOfStock ? 'bg-red-500' : isLowStock ? 'bg-orange-500' : 'bg-green-500'}`}></div>
                                                    <span className={`text-sm font-medium ${isOutOfStock ? 'text-red-600' : isLowStock ? 'text-orange-600' : 'text-green-600'}`}>
                                                        {isOutOfStock ? 'Out of Stock' : stock + ' in stock'}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* ⚡ Inline Editable Price Cell */}
                                            <td className="p-4 font-medium text-gray-900 w-48">
                                                {inlineEditId === product.id ? (
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="number"
                                                            value={inlinePrice}
                                                            onChange={(e) => setInlinePrice(e.target.value)}
                                                            className="w-20 px-2 py-1 border border-pink-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200 text-sm"
                                                            autoFocus
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') saveInlineEdit(product.id);
                                                                if (e.key === 'Escape') setInlineEditId(null);
                                                            }}
                                                        />
                                                        <button onClick={() => saveInlineEdit(product.id)} className="text-green-500 hover:bg-green-50 p-1 rounded"><Save size={14} /></button>
                                                        <button onClick={() => setInlineEditId(null)} className="text-red-400 hover:bg-red-50 p-1 rounded"><X size={14} /></button>
                                                    </div>
                                                ) : (
                                                    <div
                                                        onClick={() => startInlineEdit(product)}
                                                        className="cursor-pointer hover:bg-yellow-50 px-2 py-1 rounded -ml-2 transition-colors flex items-center gap-1 group/price w-fit"
                                                        title="Click to edit price directly"
                                                    >
                                                        <span className="font-bold">${(parseFloat(product.price) || 0).toFixed(2)}</span>
                                                        {product.oldPrice && (
                                                            <span className="text-xs text-gray-400 line-through">${parseFloat(product.oldPrice).toFixed(2)}</span>
                                                        )}
                                                        <Edit2 size={12} className="text-gray-300 opacity-0 group-hover/price:opacity-100 transition-opacity ml-1" />
                                                    </div>
                                                )}
                                            </td>

                                            <td className="p-4 text-right pr-6">
                                                <div className="flex items-center justify-end gap-1 text-gray-400">
                                                    <button
                                                        onClick={() => { setEditingProduct(product); setIsFormOpen(true); }}
                                                        className="p-2 hover:bg-blue-50 hover:text-blue-500 rounded-lg transition-colors"
                                                        title="Edit Full Details"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
                                                        title="Delete Product"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    {filteredProducts.length === 0 && (
                        <div className="p-16 text-center text-gray-400">
                            <div className="flex flex-col items-center justify-center gap-3">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                                    <Search size={32} className="text-gray-300" />
                                </div>
                                <h3 className="text-gray-900 font-medium">No products found</h3>
                                <p className="text-sm text-gray-500">We couldn't find anything matching "{searchQuery}"</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Form */}
            {isFormOpen && (
                <AdminProductForm
                    initialData={editingProduct}
                    onSubmit={handleSave}
                    onCancel={() => { setIsFormOpen(false); setEditingProduct(null); }}
                />
            )}
        </div>
    );
}
