import React, { useState } from 'react';
import { Trash2, Edit2, Loader2, RotateCcw } from 'lucide-react';
import apiClient from '../api/apiClient';

const ProductCard = ({ product, onEdit, onDelete }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isPublished, setIsPublished] = useState(product.isPublished || false);
    const [isPublishing, setIsPublishing] = useState(false);

    const handlePublishToggle = async () => {
        setIsPublishing(true);
        try {
            const response = await apiClient.patch(`/products/${product._id}/publish`);
            if (response.status === 200) {
                setIsPublished(response.data.isPublished);
            }
        } catch (error) {
            console.error("Failed to update publish status", error);
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-dotted border-gray-200 p-4 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group">
            {/* Image Slider Section */}
            <div className="relative h-56 mb-5 bg-white rounded-xl overflow-hidden flex items-center justify-center p-4 border border-gray-50">
                {product.images.length > 0 ? (
                    <img
                        src={product.images[currentImageIndex]}
                        alt={product.name}
                        className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="text-gray-300 flex flex-col items-center">
                        <span className="text-xs">No Image</span>
                    </div>
                )}

                {/* Custom Dots */}
                {product.images.length > 1 && (
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
                        {product.images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 
                                    ${idx === currentImageIndex
                                        ? 'bg-orange-500 w-3'
                                        : 'bg-gray-200 hover:bg-gray-300'}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Product Title */}
            <h3 className="font-bold text-gray-900 text-[15px] mb-4 line-clamp-1" title={product.name}>
                {product.name}
            </h3>

            {/* Details List */}
            <div className="space-y-2.5 mb-6 flex-1">
                <div className="flex justify-between items-center text-[13px]">
                    <span className="text-gray-400 font-medium">Product type -</span>
                    <span className="text-gray-600">{product.type}</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                    <span className="text-gray-400 font-medium">Quantity Stock -</span>
                    <span className="text-gray-600">{product.stock}</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                    <span className="text-gray-400 font-medium">MRP-</span>
                    <span className="text-gray-600">₹ {product.mrp}</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                    <span className="text-gray-400 font-medium">Selling Price -</span>
                    <span className="text-gray-600">₹ {product.sellingPrice}</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                    <span className="text-gray-400 font-medium">Brand Name -</span>
                    <span className="text-gray-600 truncate max-w-[50%] text-right">{product.brand}</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                    <span className="text-gray-400 font-medium">Total Number of images -</span>
                    <span className="text-gray-600">{product.images.length}</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                    <span className="text-gray-400 font-medium">Exchange Eligibility -</span>
                    <span className="text-gray-600 uppercase font-medium">
                        {product.eligibility === 'Yes' ? 'YES' : 'NO'}
                    </span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-dashed border-gray-100">
                {/* Publish/Unpublish Button */}
                <button
                    onClick={handlePublishToggle}
                    disabled={isPublishing}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm
                        ${isPublished
                            ? 'bg-[#4ade80] hover:bg-[#22c55e] text-white shadow-green-200'
                            : 'bg-[#1a1a80] hover:bg-[#121250] text-white shadow-blue-200'
                        } disabled:opacity-70 active:scale-95`}
                >
                    {isPublishing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    {isPublished ? 'Unpublish' : 'Publish'}
                </button>

                {/* Edit Button */}
                <button
                    onClick={() => onEdit && onEdit(product)}
                    className="flex-[0.8] bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-50 hover:border-gray-400 transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2"
                >
                    Edit
                </button>

                {/* Delete Button */}
                <button
                    onClick={() => onDelete && onDelete(product._id)}
                    className="p-2.5 bg-white border border-gray-300 rounded-lg text-gray-400 hover:text-red-500 hover:border-red-500 hover:bg-red-50 transition-all active:scale-95 shadow-sm"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
