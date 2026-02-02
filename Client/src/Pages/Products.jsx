import React, { useState, useEffect } from 'react';
import { LayoutGrid, Plus, Check, X } from 'lucide-react';
import AddProductModal from '../components/AddProductModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import ProductCard from '../components/ProductCard';
import apiClient from '../api/apiClient';

const Products = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get('/products');
            setProducts(response.data);
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleProductCreated = () => {
        setIsModalOpen(false);
        fetchProducts(); // Refresh list
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
    };

    const confirmDelete = (id) => {
        const product = products.find(p => p._id === id);
        if (product) {
            setProductToDelete(product);
            setIsDeleteModalOpen(true);
        }
    };

    const handleDeleteProduct = async () => {
        if (!productToDelete) return;

        try {
            await apiClient.delete(`/products/${productToDelete._id}`);
            fetchProducts();
            setIsDeleteModalOpen(false);
            setProductToDelete(null);
        } catch (error) {
            console.error("Failed to delete product", error);
            alert("Failed to delete product");
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header (Only visible when there are items) */}
            {products.length > 0 && (
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Products</h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 text-gray-600 hover:text-[#1a1a80] font-bold transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Add Products
                    </button>
                </div>
            )}

            {/* Content Area */}
            {isLoading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a1a80]"></div>
                </div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20 overflow-y-auto no-scrollbar">
                    {products.map(product => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            onEdit={(product) => {
                                setEditingProduct(product);
                                setIsModalOpen(true);
                            }}
                            onDelete={confirmDelete}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                    {/* Empty State Icon */}
                    <div className="relative mb-8">
                        <div className="w-20 h-20 rounded-2xl border-[3px] border-[#1a1a80] flex items-center justify-center">
                            <LayoutGrid className="w-10 h-10 text-[#1a1a80]" strokeWidth={2.5} />
                        </div>
                        <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md border border-gray-100">
                            <Plus className="w-7 h-7 text-[#1a1a80]" strokeWidth={3} />
                        </div>
                    </div>

                    {/* Empty State Text */}
                    <h3 className="text-xl font-bold text-gray-700 mb-2">
                        Feels a little empty over here...
                    </h3>
                    <p className="text-gray-400 text-sm max-w-md mb-8 leading-relaxed">
                        You can create products without connecting store<br />
                        you can add products to store anytime
                    </p>

                    {/* Add Product Button */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-[#1a1a80] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#121250] active:scale-95 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                        Add your Products
                    </button>
                </div>
            )}

            {/* Add/Edit Product Modal */}
            <AddProductModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingProduct(null);
                }}
                onSuccess={handleProductCreated}
                productToEdit={editingProduct}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteProduct}
                productName={productToDelete?.name}
            />

            {/* Success Toast */}
            {showSuccessToast && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-xl shadow-lg border border-gray-100 flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300 z-50">
                    <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center shadow-sm">
                        <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    </div>
                    <span className="font-bold text-gray-700">Product {editingProduct ? 'updated' : 'added'} Successfully</span>
                    <button onClick={() => setShowSuccessToast(false)} className="ml-2 text-gray-400 hover:text-gray-600">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default Products;
