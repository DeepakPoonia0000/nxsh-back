import Category from "../../models/categoryModels/category.js";

export const getCategoryTree = async (req, res) => {
    try {
        const { shopCategory } = req; // Assuming this is the root category ID (e.g., "Clothing")
        console.log("Got Category tree");
        // Start from the shop's root category instead of `parentId = null`
        const buildTree = async (parentId, level = 1) => {
            const categories = await Category.find({ parentId, level });
            const tree = await Promise.all(
                categories.map(async (cat) => {
                    const children = await buildTree(cat._id, level + 1);
                    return {
                        _id: cat._id,
                        name: cat.name,
                        level: cat.level,
                        parentCategories: cat.parentCategories,
                        children
                    };
                })
            );
            return tree;
        };

        // Find the root category node by ID
        const rootCategory = await Category.findById(shopCategory || '6820145c2e1932e4317f8465');
        if (!rootCategory) {
            return res.status(404).json({ message: "Shop category not found" });
        }

        const rootTree = await buildTree(rootCategory._id, rootCategory.level + 1);

        const result = {
            _id: rootCategory._id,
            name: rootCategory.name,
            level: rootCategory.level,
            parentCategories: rootCategory.parentCategories,
            children: rootTree
        };

        // const sellerCategoryId = shopCategory || '6820145c2e1932e4317f8465';

        return res.status(200).json({ categories: [result], sellerCategoryId: shopCategory || '6820145c2e1932e4317f8465' });

    } catch (error) {
        console.error("getCategoryTree error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

export const getLevelOneCategories = async (req, res) => {
    try {
        const levelOneCategories = await Category.find({ level: 1 }).select('_id name');

        if (!levelOneCategories || levelOneCategories.length === 0) {
            return res.status(404).json({ message: "No level 1 categories found" });
        }

        res.status(200).json({ categories: levelOneCategories });
    } catch (error) {
        console.error("getLevelOneCategories error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};