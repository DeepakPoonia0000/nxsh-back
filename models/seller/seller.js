import mongoose from 'mongoose';

const sellerSchema = new mongoose.Schema({
    googleId: String,
    email: String,
    profile: String,
    password: String,
    name: String,
    picture: String,
    accessToken: String,
    refreshToken: String,
    isVerified: { type: Boolean, default: false },
});

const Seller = mongoose.model('Seller', sellerSchema);
export default Seller;
