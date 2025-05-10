import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.js'; // Unified model
import { GOOGLE_CALLBACK_URL, GOOGLE_CLIENT, GOOGLE_SECRET } from './env.js';

passport.serializeUser((user, done) => {
    done(null, { id: user.id, role: user.role }); // Keeping role for possible future use
});

passport.deserializeUser(async ({ id }, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// function configureStrategy(role) {
//     console.log("✅ Google Strategy Callback Triggered for", role);
//     return new GoogleStrategy({
//         clientID: GOOGLE_CLIENT,
//         clientSecret: GOOGLE_SECRET,
//         callbackURL: `${GOOGLE_CALLBACK_URL}/${role}`,
//         passReqToCallback: true,
//     }, async (req, accessToken, refreshToken, profile, done) => {
//         try {
//             const { id, displayName, photos, emails } = profile;
//             const email = emails[0].value;

//             let user = await User.findOne({ googleId: id });

//             if (!user) {
//                 user = await User.create({
//                     googleId: id,
//                     email,
//                     name: displayName,
//                     picture: photos[0]?.value || null,
//                     accessToken,
//                     refreshToken,
//                     role,
//                     isVerified: true,
//                 });
//             }

//             return done(null, user);
//         } catch (err) {
//             console.error("Error in GoogleStrategy:", err);
//             return done(err, null);
//         }
//     });
// }

// Use different strategies for buyer and seller login routes
// passport.use('google-buyer', configureStrategy('buyer'));
// passport.use('google-seller', configureStrategy('seller'));

function configureStrategy(role, mode) {
    return new GoogleStrategy({
        clientID: GOOGLE_CLIENT,
        clientSecret: GOOGLE_SECRET,
        callbackURL: `${GOOGLE_CALLBACK_URL}/${role}/${mode}`,
        passReqToCallback: true,
    }, async (req, accessToken, refreshToken, profile, done) => {
        try {
            const { id, displayName, photos, emails } = profile;
            const email = emails[0].value;

            const existingUser = await User.findOne({ email });

            if (mode === 'signup') {
                if (existingUser) {
                    // 🚫 Already registered
                    return done(null, false, { message: `User already exists as ${existingUser.role}` });
                }

                const newUser = await User.create({
                    googleId: id,
                    email,
                    name: displayName,
                    picture: photos[0]?.value || null,
                    accessToken,
                    refreshToken,
                    role,
                    isVerified: true,
                });

                return done(null, newUser);
            }

            // 🔐 LOGIN
            if (!existingUser || existingUser.role !== role) {
                return done(null, false, { message: `No ${role} account found with this email.` });
            }

            return done(null, existingUser);
        } catch (err) {
            console.error("Error in GoogleStrategy:", err);
            return done(err, null);
        }
    });
}


passport.use('google-buyer-signup', configureStrategy('buyer', 'signup'));
passport.use('google-buyer-login', configureStrategy('buyer', 'login'));
passport.use('google-seller-signup', configureStrategy('seller', 'signup'));
passport.use('google-seller-login', configureStrategy('seller', 'login'));
