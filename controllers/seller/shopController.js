import Category from "../../models/categoryModels/category.js";
import Shop from "../../models/seller/shopSchema.js";
import {uploadOnCloudinary} from "../../utils/cloudinary.js";


// export const createShop = async (req, res) => {
//     try {
//         const { name, shopCategory, picture } = req.body;
//         const { userId } = req;

//         // Check if a shop already exists for this user
//         const existingShop = await Shop.findOne({ userId });
//         if (existingShop) {
//             return res.status(400).json({ message: "Shop already exists for this user." });
//         }

//         console.log(name, shopCategory, picture);
//         const category = await Category.findById(shopCategory)
//         if (!category || category.level != 1) {
//             return res.status(400).json({ message: "Only level 1 Category can be chosen for the Shop Category ." });

//         }

//         // Create new shop
//         const newShop = new Shop({
//             userId,
//             name,
//             shopCategory,
//             picture
//         });

//         await newShop.save();

//         res.status(201).json({ message: "Shop created successfully", shop: newShop });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Failed to create shop", errorData: error });
//     }
// };


export const createShop = async (req, res) => {
    try {
        const { name, shopCategory } = req.body;
        const { userId } = req;

        const shopImageFile = req.files?.shopImage?.[0];

        if (!name || !shopCategory || !shopImageFile) {
            return res.status(400).json({ message: "Name, category, and image are required." });
        }

        // Check size
        if (shopImageFile.size > 10 * 1024 * 1024) {
            return res.status(400).json({ message: "Image must be under 10MB." });
        }

        // Upload to Cloudinary
        const uploadedImage = await uploadOnCloudinary(shopImageFile.path);
        if (!uploadedImage) {
            return res.status(500).json({ message: "Image upload failed." });
        }

        // Check if a shop already exists
        const existingShop = await Shop.findOne({ userId });
        if (existingShop) {
            return res.status(400).json({ message: "Shop already exists for this user." });
        }

        // Validate category level
        const category = await Category.findById(shopCategory);
        if (!category || category.level !== 1) {
            return res.status(400).json({ message: "Only level 1 Category can be chosen for the Shop Category." });
        }

        // Create shop
        const newShop = new Shop({
            userId,
            name,
            shopCategory,
            picture: uploadedImage.url, // Store Cloudinary URL
        });

        await newShop.save();
        console.log("new shop created =>", newShop);

        res.status(201).json({ message: "Shop created successfully", shop: newShop });
    } catch (error) {
        console.error("Shop creation failed:", error);
        res.status(500).json({ message: "Failed to create shop", errorData: error });
    }
};

export const getUserShopOld = async (req, res) => {
    try {
        const { user } = req;
        const userShop = await Shop.find({ userId: user._id });
        console.log("user shop => ", userShop);
        res.status(201).json({ message: "Shop Fetched successfully", shop: userShop });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to get shop", errorData: error });
    }
}

export const getUserShop = async (req, res) => {
    try {
        const { user } = req;
        const userShops = await Shop.find({ userId: user._id });

        if (userShops.length === 0) {
            return res.status(404).json({ message: "No shop found for this user" });
        }

        const shop = userShops[0]; // Assuming only one shop
        const category = await Category.findById(shop.shopCategory);

        let responseData = {
            ...shop._doc,
            categoryName: category?.name || null
        };

        res.status(200).json({ message: "Shop fetched successfully", shop: [responseData] });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to get shop", errorData: error });
    }
};
