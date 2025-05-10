import Category from "../../models/categoryModels/category.js";
import Product from "../../models/seller/productSchema.js";
import uploadOnCloudinary from "../../utils/cloudinary.js";

export const createProduct = async (req, res) => {
    try {
        const { name, categoryId, price, description } = req.body;
        const sellerId = req.user._id; // assuming auth middleware

        const category = await Category.findById(categoryId);
        if (!category) return res.status(400).json({ message: "Invalid category" });

        const hasChildren = await Category.exists({ parentId: categoryId });
        if (hasChildren) {
            return res.status(400).json({ message: "Cannot assign product to non-leaf category" });
        }

        let productImages = [];
        if (req.files?.productImages) {
            console.log(req.files);
            for (const file of req.files.productImages) {
                if (file.size > 15 * 1024 * 1024) {
                    return res.status(400).json({ message: "Each image must be under 10MB" });
                }
                const uploadedFile = await uploadOnCloudinary(file.path);
                if (uploadedFile) productImages.push(uploadedFile.url);
            }
        }

        // Upload video
        let productVideo = null;
        if (req.files?.productVideo) {
            if (req.files?.productVideo?.[0]?.size > 25 * 1024 * 1024) {
                return res.status(400).json({ message: "Video must be under 25MB" });
            }
            const uploadedVideo = await uploadOnCloudinary(req.files.productVideo[0].path);
            if (uploadedVideo) productVideo = uploadedVideo.url;

            // Check and delete temp file
            try {
                await fs.unlink(req.files.productVideo[0].path);
            } catch (unlinkError) {
                console.warn(`Warning: Could not delete file ${req.files.productVideo[0].path}:`, unlinkError.message);
            }
        }

        const product = new Product({
            name,
            categoryId,
            price,
            description,
            images: productImages,
            video: productVideo,
            sellerId
        });

        await product.save();
        res.status(201).json({ message: "Product created", product });
    } catch (err) {
        console.error("createProduct error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

