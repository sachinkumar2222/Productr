import React, { useState, useEffect } from 'react';
import { LayoutGrid, Plus, Loader2, Check, X } from 'lucide-react';
import apiClient from '../api/apiClient';
import ProductCard from '../components/ProductCard';
import AddProductModal from '../components/AddProductModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

const Home = () => {
    const [activeTab, setActiveTab] = useState('published');
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Edit Modal State
    const [isModaLOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const isPublished = activeTab === 'published';
            const response = await apiClient.get('/products', {
                params: { isPublished }
            });
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [activeTab]);

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
            {/* Tabs */}
            <div className="border-b border-gray-100 mb-8">
                <div className="flex gap-8">
                    <button
                        onClick={() => setActiveTab('published')}
                        className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'published' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Published
                        {activeTab === 'published' && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-t-full"></div>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('unpublished')}
                        className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'unpublished' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Unpublished
                        {activeTab === 'unpublished' && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-t-full"></div>
                        )}
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1">
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
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
                    <div className="flex flex-col items-center justify-center text-center h-64">
                        <div className="relative mb-6">
                            <div className="w-16 h-16 rounded-xl border-2 border-blue-900 flex items-center justify-center">
                                <LayoutGrid className="w-8 h-8 text-blue-900" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                <Plus className="w-5 h-5 text-blue-900" />
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-gray-700 mb-2">
                            No {activeTab === 'published' ? 'Published' : 'Unpublished'} Products
                        </h3>
                        <p className="text-gray-400 text-sm max-w-sm">
                            {activeTab === 'published'
                                ? 'Your Published Products will appear here'
                                : 'Your Unpublished Products will appear here'}
                            <br />
                            Create your first product to publish
                        </p>
                    </div>
                )}
            </div>

            {/* Add/Edit Product Modal */}
            <AddProductModal
                isOpen={isModaLOpen}
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

export default Home;
