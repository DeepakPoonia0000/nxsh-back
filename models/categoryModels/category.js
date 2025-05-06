import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        default: null,
    },
    level: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    parentCategories: {
        type: [String],
        required: false
    }
})

const Category = mongoose.model('Category', categorySchema)
export default Category;