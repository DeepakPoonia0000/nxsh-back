import './config/env.js'
import express from 'express';
import passport from 'passport';
import dbConnection from './dbConnection/dbConnection.js'
import './config/GoogleAuth.js';
import userAuthRouter from './routes/authRoutes.js'
import categoryRoutes from './routes/admin/categoryRoutes.js'
import sellerProductRoutes from './routes/shop/productRoutes.js'
import shopRoutes from './routes/shop/createShopRoutes.js'
import { CLIENT_URL, PORT } from './config/env.js';
import session from 'express-session';
import cors from 'cors'
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cookieParser())


app.use(cors({
    origin: [CLIENT_URL, "localhost:3000"],
    credentials: true,
}));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

await dbConnection();

// user routers
app.use('/auth', userAuthRouter);



// sellerRoutes
app.use('/seller', sellerProductRoutes);
app.use('/shop',shopRoutes);



// admin routes
app.use('/admin/category', categoryRoutes)

app.get("/", (req, res) => {
    res.status(200).json({ message: "Server is running ." })
})

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
