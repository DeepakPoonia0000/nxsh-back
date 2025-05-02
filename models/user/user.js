import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  name: {
    type: String,
  },
  password: String,
  googleId: String,
  role:{
    type:String,
    require:true,
    default:"user"
  },
  picture: String,
  accessToken: String,
  refreshToken: String,
  profile: String,
  isVerified: { type: Boolean, default: false },
});

const User = mongoose.model('User', userSchema);
export default User;