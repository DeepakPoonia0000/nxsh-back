import Category from "../../models/categoryModels/category.js";
import Product from "../../models/seller/productSchema.js";


export const getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        const getAllDescendantIds = async (parentId) => {
            const categories = await Category.find({ parentId });
            const ids = [parentId];
            for (const cat of categories) {
                const childIds = await getAllDescendantIds(cat._id);
                ids.push(...childIds);
            }
            return ids;
        };

        const allCategoryIds = await getAllDescendantIds(categoryId);
        const products = await Product.find({ categoryId: { $in: allCategoryIds } });

        res.status(200).json({ products });
    } catch (error) {
        console.error("getProductsByCategory error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};