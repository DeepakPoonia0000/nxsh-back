import mongoose from "mongoose";

const shopSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true,unique: true
    },
    name: {
        type: String, required: true
    },
    shopCategory: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true
    },
    picture: String,
    isVerified: { type: Boolean, default: false },
});

const Shop = mongoose.model('Shop', shopSchema);
export default Shop;