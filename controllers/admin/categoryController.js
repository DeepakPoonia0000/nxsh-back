import Category from "../../models/categoryModels/category.js";


export const addCategoryHierarchy = async (req, res) => {
    try {
        const { hierarchy } = req.body; 
        // e.g., hierarchy: ["Electronics", "Laptops", "Gaming Laptops"]

        if (!Array.isArray(hierarchy) || hierarchy.length === 0) {
            return res.status(400).json({ message: "Hierarchy must be a non-empty array" });
        }

        let parentId = null;
        let parentCategories = [];
        let level = 1;
        let currentCategory = null;

        for (const name of hierarchy) {
            // Check if category already exists at this level under the same parent
            currentCategory = await Category.findOne({ name, parentId });

            if (currentCategory) {
                // If level or parentCategories are incorrect, update them
                const needsUpdate = currentCategory.level !== level ||
                                    JSON.stringify(currentCategory.parentCategories) !== JSON.stringify(parentCategories);
                if (needsUpdate) {
                    currentCategory.level = level;
                    currentCategory.parentCategories = [...parentCategories];
                    await currentCategory.save();
                }
            } else {
                // Create new category
                currentCategory = new Category({
                    name,
                    parentId,
                    level,
                    parentCategories: [...parentCategories]
                });
                await currentCategory.save();
            }

            // Update for next level
            parentId = currentCategory._id;
            parentCategories.push(name);
            level++;
        }

        return res.status(200).json({ message: "Category hierarchy processed successfully", category: currentCategory });
    } catch (err) {
        console.error("addCategoryHierarchy error:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};