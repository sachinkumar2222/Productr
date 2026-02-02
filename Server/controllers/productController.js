const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');

exports.createProduct = async (req, res) => {
    try {
        const { name, type, stock, mrp, sellingPrice, brand, images, eligibility } = req.body;

        // Basic validation
        if (!name || !type || !stock || !mrp || !sellingPrice || !brand) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Upload images to Cloudinary
        let imageUrls = [];
        if (images && images.length > 0) {
            const uploadPromises = images.map(image => {
                return cloudinary.uploader.upload(image, {
                    folder: 'productr_products',
                });
            });

            const uploadResults = await Promise.all(uploadPromises);
            imageUrls = uploadResults.map(result => result.secure_url);
        }

        const newProduct = new Product({
            name,
            type,
            stock,
            mrp,
            sellingPrice,
            brand,
            images: imageUrls,
            eligibility,
            userId: req.user._id
        });

        await newProduct.save();

        res.status(201).json({
            message: 'Product created successfully',
            product: newProduct
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Server error while creating product' });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const { isPublished } = req.query;
        let query = { userId: req.user._id };

        if (isPublished !== undefined) {
            query.isPublished = isPublished === 'true';
        }

        const products = await Product.find(query).sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error while fetching products' });
    }
};

exports.togglePublishStatus = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.isPublished = !product.isPublished;
        await product.save();

        res.status(200).json({
            message: `Product ${product.isPublished ? 'published' : 'unpublished'} successfully`,
            isPublished: product.isPublished
        });
    } catch (error) {
        console.error('Error updating publish status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { name, type, stock, mrp, sellingPrice, brand, images, eligibility } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Verify ownership
        if (product.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Upload new images to Cloudinary if any (Handling simply for now: if images array is passed, use it)
        // Note: For a robust implementation, we might want to handle partial updates or deletions differently.
        // Assuming the client sends the FULL array of images (existing URLs + new base64 strings if any, processed by client or server).
        // Since the current AddProductModal sends base64, we need to upload them. 
        // A smarter way: Client uploads new ones, keeps old URLs. Here we just process any string that looks like base64.

        // However, for this iteration, let's assume the logic mimics createProduct but updates fields.

        let finalImages = product.images;

        if (images && images.length > 0) {
            // Separate existing URLs from new base64 strings
            const newImages = images.filter(img => img.startsWith('data:image'));
            const existingImages = images.filter(img => img.startsWith('http'));

            let uploadedImageUrls = [];
            if (newImages.length > 0) {
                const uploadPromises = newImages.map(image => {
                    return cloudinary.uploader.upload(image, {
                        folder: 'productr_products',
                    });
                });
                const uploadResults = await Promise.all(uploadPromises);
                uploadedImageUrls = uploadResults.map(result => result.secure_url);
            }

            finalImages = [...existingImages, ...uploadedImageUrls];
        } else {
            // If images is empty array sent from client, it means delete all? or just no change? 
            // In modal logic, if user removes all images, it's empty.
            if (images) finalImages = [];
        }

        product.name = name || product.name;
        product.type = type || product.type;
        product.stock = stock || product.stock;
        product.mrp = mrp || product.mrp;
        product.sellingPrice = sellingPrice || product.sellingPrice;
        product.brand = brand || product.brand;
        product.eligibility = eligibility || product.eligibility;
        product.images = finalImages;

        await product.save();

        res.status(200).json({
            message: 'Product updated successfully',
            product
        });

    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Verify ownership
        if (product.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Product.deleteOne({ _id: product._id });

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
