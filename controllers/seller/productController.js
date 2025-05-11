import Category from "../../models/categoryModels/category.js";
import Product from "../../models/seller/productSchema.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";

export const createProduct = async (req, res) => {
    try {
        const { name, categoryId, price, description } = req.body;
        const shopId = req.shop._id; // assuming auth middleware

        const category = await Category.findById(categoryId);
        if (!category) return res.status(400).json({ message: "Invalid category" });

        const hasChildren = await Category.exists({ parentId: categoryId });
        if (hasChildren) {
            return res.status(400).json({ message: "Cannot assign product to non-leaf category" });
        }

        // Generate the category path
        const categoryPath = [];
        let currentCategory = category;

        // Loop through the parent categories to build the category path
        while (currentCategory) {
            categoryPath.unshift({
                categoryId: currentCategory._id,
                categoryName: currentCategory.name
            });
            currentCategory = await Category.findById(currentCategory.parentId);
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
        } else {
            return res.status(400).json({ message: "Atleast one image is needed ." });
        }

        // Upload video
        let productVideo = null;
        // if (req.files?.productVideo) {
        //     if (req.files?.productVideo?.[0]?.size > 25 * 1024 * 1024) {
        //         return res.status(400).json({ message: "Video must be under 25MB" });
        //     }
        //     console.log("Video file => ", req.files?.productVideo)
        //     req.files?.productVideo

        //     const uploadedVideo = await uploadOnCloudinary(req.files.productVideo[0].path, 'video');
        //     if (uploadedVideo) productVideo = uploadedVideo.url;

        //     // Check and delete temp file
        //     try {
        //         await fs.unlink(req.files.productVideo[0].path);
        //     } catch (unlinkError) {
        //         console.warn(`Warning: Could not delete file ${req.files.productVideo[0].path}:`, unlinkError.message);
        //     }
        // }

        const product = new Product({
            name,
            categoryId,
            categoryPath,
            price,
            description,
            images: productImages,
            video: productVideo,
            shopId
        });

        await product.save();
        res.status(201).json({ message: "Product created", product });
    } catch (err) {
        console.error("createProduct error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const getShopProduct = async (req, res) => {
    try {
        const { shop } = req;
        const products = await Product.find({ shopId: shop._id });
        res.status(201).json({ message: "Products fetched successfully", products });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error });
    }
}