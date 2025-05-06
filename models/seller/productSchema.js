import mongoose from "mongoose";

// const productSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     slug: {
//         type: String,
//         unique: true,
//         lowercase: true,
//         trim: true
//     },
//     description: {
//         type: String,
//         required: true
//     },
//     brand: {
//         type: String
//     },
//     category: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Category',
//         required: true
//     },
//     price: {
//         type: Number,
//         required: true
//     },
//     discountPrice: {
//         type: Number,
//         default: 0
//     },
//     stock: {
//         type: Number,
//         required: true
//     },
//     images: [
//         {
//             url: String,
//             alt: String
//         }
//     ],
//     ratings: [
//         {
//             user: {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: 'User'
//             },
//             star: Number,
//             comment: String
//         }
//     ],
//     averageRating: {
//         type: Number,
//         default: 0
//     },
//     isFeatured: {
//         type: Boolean,
//         default: false
//     },
//     isActive: {
//         type: Boolean,
//         default: true
//     }
// }, { timestamps: true });

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    price: Number,
    description: String,
    images: [String],
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Product = mongoose.model('Product', productSchema);
export default Product;