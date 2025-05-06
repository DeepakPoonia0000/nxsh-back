import mongoose from 'mongoose';

const sellerSchema = new mongoose.Schema({
    googleId: String,
    email: String,
    profile: String,
    password: String,
    name: String,
    role: {
        type: String,
        require: true,
        default: "seller"
    },
    picture: String,
    accessToken: String,
    refreshToken: String,
    profile: String,
    isVerified: { type: Boolean, default: false },
});

const Seller = mongoose.model('Seller', sellerSchema);
export default Seller;
