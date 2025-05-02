import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import Seller from '../models/seller/seller.js';
import User from '../models/user/user.js';
import { GOOGLE_CALLBACK_URL, GOOGLE_CLIENT, GOOGLE_SECRET } from './env.js';

passport.serializeUser((user, done) => {
    done(null, { id: user.id, role: user.role });
});

passport.deserializeUser(async ({ id, role }, done) => {
    const Model = role === 'seller' ? Seller : User;
    const user = await Model.findById(id);
    done(null, user);
});

function configureStrategy(role) {
    console.log("✅ Google Strategy Callback Triggered for", role);
    return new GoogleStrategy({
        clientID: GOOGLE_CLIENT,
        clientSecret: GOOGLE_SECRET,
        callbackURL: `${GOOGLE_CALLBACK_URL}/${role}`,
        passReqToCallback: true,
    }, async (req, accessToken, refreshToken, profile, done) => {
        try {
            const { id, displayName, photos, emails } = profile;
            // console.log(id, displayName, photos, emails, accessToken, refreshToken,)
            const email = emails[0].value;
            const Model = role === 'seller' ? Seller : User;

            let user = await Model.findOne({ email });

            if (!user) {
                user = await Model.create({
                    googleId: id,
                    email,
                    name: displayName,
                    picture: photos[0].value,
                    accessToken,
                    refreshToken,
                    isVerified: true,
                });
            } else {
                user.accessToken = accessToken;
                user.refreshToken = refreshToken;
                user.googleId = id;
                user.email = email;
                user.name = user.name || displayName;
                user.picture = user.picture || photos[0].value;
                user.isVerified = true;
                await user.save();
            }

            user.role = role;
            console.log("authentication done ....");
            return done(null, user);
        } catch (err) {
            console.error("Error in GoogleStrategy:", err);
            return done(err, null);
        }
    });
}

passport.use('google-buyer', configureStrategy('buyer'));
passport.use('google-seller', configureStrategy('seller'));