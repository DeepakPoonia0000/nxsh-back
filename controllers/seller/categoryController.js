import Category from "../../models/categoryModels/category";

export const getCategoryTree = async (req, res) => {
    try {
        const buildTree = async (parentId = null, level = 1) => {
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

        const fullTree = await buildTree();
        return res.status(200).json({ categories: fullTree });
    } catch (error) {
        console.error("getCategoryTree error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
