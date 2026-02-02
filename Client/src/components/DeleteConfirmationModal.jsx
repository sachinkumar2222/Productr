import React from 'react';
import { X } from 'lucide-react';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, productName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl w-full max-w-md shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 pb-2">
                    <h2 className="text-xl font-bold text-gray-800">Delete Product</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-4">
                    <p className="text-gray-600 leading-relaxed text-[15px]">
                        Are you sure you really want to delete this Product<br />
                        <span className="font-bold text-gray-800">" {productName} "</span> ?
                    </p>
                </div>

                {/* Footer */}
                <div className="p-6 pt-2 flex justify-end">
                    <button
                        onClick={onConfirm}
                        className="bg-[#1a1a80] hover:bg-[#121250] text-white px-6 py-2 rounded-lg font-bold text-sm transition-colors shadow-md active:scale-95"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
