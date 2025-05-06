import Category from "../../models/categoryModels/category.js";
import Product from "../../models/seller/productSchema.js";

export const createProduct = async (req, res) => {
    try {
        const { name, categoryId, price, description, images } = req.body;
        const sellerId = req.user._id; // assuming auth middleware

        const category = await Category.findById(categoryId);
        if (!category) return res.status(400).json({ message: "Invalid category" });

        const hasChildren = await Category.exists({ parentId: categoryId });
        if (hasChildren) {
            return res.status(400).json({ message: "Cannot assign product to non-leaf category" });
        }

        const product = new Product({
            name,
            categoryId,
            price,
            description,
            images,
            sellerId
        });

        await product.save();
        res.status(201).json({ message: "Product created", product });
    } catch (err) {
        console.error("createProduct error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

