import React from 'react';
import { X } from 'lucide-react';
import apiClient from '../api/apiClient';

// Custom Dropdown Component
const CustomDropdown = ({ options, value, onChange, placeholder, icon }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const dropdownRef = React.useRef(null);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full p-3 border rounded-lg cursor-pointer flex items-center justify-between transition-all font-medium text-gray-700 bg-white
                    ${isOpen ? 'border-[#1a1a80] ring-4 ring-[#1a1a80]/10' : 'border-gray-300 hover:border-gray-400'}`}
            >
                <span className={value ? 'text-gray-900' : 'text-gray-500'}>
                    {value || placeholder}
                </span>
                <span className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </span>
            </div>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                    <div className="py-1">
                        {/* Placeholder option as selectable option if needed, usually just header or reset */}
                        <div
                            className={`px-4 py-2 text-sm cursor-pointer transition-colors
                                ${!value ? 'bg-[#1a1a80] text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                            onClick={() => {
                                onChange('');
                                setIsOpen(false);
                            }}
                        >
                            {placeholder}
                        </div>
                        {options.map((option) => (
                            <div
                                key={option}
                                className={`px-4 py-2 text-sm cursor-pointer transition-colors
                                    ${value === option ? 'bg-[#1a1a80] text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                                onClick={() => {
                                    onChange(option);
                                    setIsOpen(false);
                                }}
                            >
                                {option}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const AddProductModal = ({ isOpen, onClose, onSuccess, productToEdit }) => {
    const [images, setImages] = React.useState([]);
    const [productType, setProductType] = React.useState('');
    const [eligibility, setEligibility] = React.useState('');
    const [errors, setErrors] = React.useState({});
    const [isLoading, setIsLoading] = React.useState(false);

    // Form refs
    const nameRef = React.useRef();
    const stockRef = React.useRef();
    const mrpRef = React.useRef();
    const sellingPriceRef = React.useRef();
    const brandRef = React.useRef();

    React.useEffect(() => {
        if (isOpen) {
            setErrors({}); // Clear errors when modal opens
        }
        if (isOpen && productToEdit) {
            // Populate form for editing
            nameRef.current.value = productToEdit.name;
            stockRef.current.value = productToEdit.stock;
            mrpRef.current.value = productToEdit.mrp;
            sellingPriceRef.current.value = productToEdit.sellingPrice;
            brandRef.current.value = productToEdit.brand;
            setProductType(productToEdit.type);
            setEligibility(productToEdit.eligibility);
            setImages(productToEdit.images || []);
        } else if (isOpen) {
            // Reset form for new product
            if (nameRef.current) nameRef.current.value = '';
            if (stockRef.current) stockRef.current.value = '';
            if (mrpRef.current) mrpRef.current.value = '';
            if (sellingPriceRef.current) sellingPriceRef.current.value = '';
            if (brandRef.current) brandRef.current.value = '';
            setProductType('');
            setEligibility('');
            setImages([]);
            setErrors({});
        }
    }, [isOpen, productToEdit]);

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const newImages = await Promise.all(
            files.map(file => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(file);
                });
            })
        );

        setImages(prev => [...prev, ...newImages]);
        e.target.value = ''; // Reset input so same file can be selected again
        setErrors({ ...errors, images: '' });
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!nameRef.current.value.trim()) newErrors.name = "Please enter product name";
        if (!productType) newErrors.type = "Please select product type";
        if (!stockRef.current.value.trim()) newErrors.stock = "Please enter quantity stock";
        if (!mrpRef.current.value.trim()) newErrors.mrp = "Please enter MRP";
        if (!sellingPriceRef.current.value.trim()) newErrors.sellingPrice = "Please enter selling price";
        if (!brandRef.current.value.trim()) newErrors.brand = "Please enter brand name";
        if (images.length === 0) newErrors.images = "Please populate with at least one image";
        if (!eligibility) newErrors.eligibility = "Please select eligibility";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        const productData = {
            name: nameRef.current.value,
            type: productType,
            stock: Number(stockRef.current.value),
            mrp: Number(mrpRef.current.value),
            sellingPrice: Number(sellingPriceRef.current.value),
            brand: brandRef.current.value,
            images: images,
            eligibility: eligibility
        };

        try {
            let response;
            if (productToEdit) {
                response = await apiClient.put(`/products/${productToEdit._id}`, productData);
            } else {
                response = await apiClient.post('/products/create', productData);
            }

            if (response.status === 200 || response.status === 201) {
                onSuccess(); // Close, Refresh, Show Toast
                // Reset form handled by useEffect on next open
            }
        } catch (error) {
            console.error("Error saving product:", error);
            alert(error.response?.data?.message || "Error saving product");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const productTypes = ["Foods", "Electronics", "Clothes", "Beauty Products", "Others"];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-2xl w-full max-w-[600px] h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200 text-left">
                {/* Header */}
                <div className="flex-none flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">{productToEdit ? 'Edit Product' : 'Add Product'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Form Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Product Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
                        <input
                            ref={nameRef}
                            type="text"
                            className={`w-full p-3 border rounded-lg outline-none transition-all font-medium text-gray-700 placeholder:text-gray-400
                                ${errors.name ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-gray-300 focus:border-[#1a1a80] focus:ring-4 focus:ring-[#1a1a80]/10'}`}
                            placeholder="e.g. CakeZone Walnut Brownie"
                            onChange={() => setErrors({ ...errors, name: '' })}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    {/* Product Type */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Product Type</label>
                        <CustomDropdown
                            options={productTypes}
                            value={productType}
                            onChange={(val) => { setProductType(val); setErrors({ ...errors, type: '' }); }}
                            placeholder="Select product type"
                        />
                        {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
                    </div>

                    {/* Grid for Stock, Pricing, Brand */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Quantity Stock */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity Stock</label>
                            <input
                                ref={stockRef}
                                type="text"
                                className={`w-full p-3 border rounded-lg outline-none transition-all font-medium text-gray-700 placeholder:text-gray-400
                                    ${errors.stock ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-gray-300 focus:border-[#1a1a80] focus:ring-4 focus:ring-[#1a1a80]/10'}`}
                                placeholder="Total stock"
                                onChange={() => setErrors({ ...errors, stock: '' })}
                            />
                            {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
                        </div>

                        {/* MRP */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">MRP</label>
                            <input
                                ref={mrpRef}
                                type="text"
                                className={`w-full p-3 border rounded-lg outline-none transition-all font-medium text-gray-700 placeholder:text-gray-400
                                    ${errors.mrp ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-gray-300 focus:border-[#1a1a80] focus:ring-4 focus:ring-[#1a1a80]/10'}`}
                                placeholder="Maximum Retail Price"
                                onChange={() => setErrors({ ...errors, mrp: '' })}
                            />
                            {errors.mrp && <p className="text-red-500 text-sm mt-1">{errors.mrp}</p>}
                        </div>

                        {/* Selling Price */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Selling Price</label>
                            <input
                                ref={sellingPriceRef}
                                type="text"
                                className={`w-full p-3 border rounded-lg outline-none transition-all font-medium text-gray-700 placeholder:text-gray-400
                                    ${errors.sellingPrice ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-gray-300 focus:border-[#1a1a80] focus:ring-4 focus:ring-[#1a1a80]/10'}`}
                                placeholder="Selling Price"
                                onChange={() => setErrors({ ...errors, sellingPrice: '' })}
                            />
                            {errors.sellingPrice && <p className="text-red-500 text-sm mt-1">{errors.sellingPrice}</p>}
                        </div>

                        {/* Brand Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Brand Name</label>
                            <input
                                ref={brandRef}
                                type="text"
                                className={`w-full p-3 border rounded-lg outline-none transition-all font-medium text-gray-700 placeholder:text-gray-400
                                    ${errors.brand ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-gray-300 focus:border-[#1a1a80] focus:ring-4 focus:ring-[#1a1a80]/10'}`}
                                placeholder="Brand Name"
                                onChange={() => setErrors({ ...errors, brand: '' })}
                            />
                            {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
                        </div>
                    </div>

                    {/* Upload Product Images */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-semibold text-gray-700">Upload Product Images</label>
                            <label htmlFor="image-upload" className="text-sm font-semibold text-[#1a1a80] cursor-pointer hover:underline">Add More Photos</label>
                        </div>

                        <div className={`border border-dashed rounded-xl p-4 min-h-[120px] bg-gray-50/30 ${errors.images ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}>
                            <input
                                id="image-upload"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                            />

                            {images.length === 0 ? (
                                <label htmlFor="image-upload" className="flex flex-col items-center justify-center h-24 cursor-pointer hover:bg-gray-100/50 rounded-lg transition-colors">
                                    <div className="bg-white p-2 rounded-full mb-2 shadow-sm border border-gray-100">
                                        <svg className="w-6 h-6 text-[#1a1a80]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 text-sm font-medium">Click to upload image</p>
                                </label>
                            ) : (
                                <div className="flex flex-wrap gap-4">
                                    {images.map((img, index) => (
                                        <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 shadow-sm group">
                                            <img src={img} alt="Product" className="w-full h-full object-cover" />
                                            <button
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
                                            >
                                                <X className="w-3 h-3 text-gray-500" />
                                            </button>
                                        </div>
                                    ))}
                                    <label htmlFor="image-upload" className="w-24 h-24 flex items-center justify-center border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                        <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Exchange or return eligibility */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Exchange or return eligibility</label>
                        <CustomDropdown
                            options={["Yes", "No"]}
                            value={eligibility}
                            onChange={(val) => { setEligibility(val); setErrors({ ...errors, eligibility: '' }); }}
                            placeholder="Select Option"
                        />
                        {errors.eligibility && <p className="text-red-500 text-sm mt-1">{errors.eligibility}</p>}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex-none p-6 border-t border-gray-100 flex justify-end bg-gray-50/50 rounded-b-2xl">
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-[#1a1a80] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#121250] active:scale-95 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                    >
                        {isLoading ? 'Saving...' : (productToEdit ? 'Update Product' : 'Create')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddProductModal;
